Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
#!/usr/bin/env python3
"""Build a reproducible inventory for the archived Mathenpoche ZIP files."""

from __future__ import annotations

import argparse
import csv
import hashlib
import posixpath
import json
import re
import sys
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


SOURCE_PAGE = "https://archives.mathenpoche.sesamath.net/index.php?page=220"
SWF_PAGE = "https://archives.mathenpoche.sesamath.net/index.php?page=210"
LEVELS = {
    "6eme": {"label": "6e", "source": "6eme.zip", "swf": "6eme.zip"},
    "5eme": {"label": "5e", "source": "5eme.zip", "swf": "5eme.zip"},
    "4eme": {"label": "4e", "source": "4eme.zip", "swf": "4eme.zip"},
    "3eme": {"label": "3e", "source": "3eme.zip", "swf": "3eme.zip"},
    "2nde": {"label": "2nde", "source": "2nde.zip", "swf": "2nde.zip"},
}
OPTIONAL_SOURCE_ARCHIVES = {
    "3eme-avant_programmes_2008.zip",
    "4eme-avant_programmes_2007.zip",
    "ebeps.zip",
}
EXTENSIONS_OF_INTEREST = {
    ".as", ".bak", ".css", ".fla", ".gif", ".gz", ".htm", ".html",
    ".jpg", ".jpeg", ".js", ".mp3", ".png", ".swf", ".txt", ".xml",
}
LICENSE_NAME = re.compile(
    r"(?:^|[._\-\s])(?:licen[cs]e|copying|copyright|notice|auteurs?|readme|gpl)(?:[._\-\s]|$)",
    re.I,
)
EXERCISE_PART = re.compile(r"^(?:exo|exercice)\d+[a-z]?$", re.I)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def source_url(category: str, archive_name: str) -> str:
    base = "https://archives.mathenpoche.sesamath.net/telechargements"
    if category == "Sources":
        return f"{base}/sources/{archive_name}"
    return f"{base}/{archive_name}"


def file_extension(name: str) -> str:
    return PurePosixPath(name).suffix.lower()


def root_relative(name: str) -> str:
    parts = PurePosixPath(name).parts
    return "/".join(parts[1:]) if len(parts) > 1 else name


def exercise_directory(name: str) -> str | None:
    parts = PurePosixPath(name).parts
    for index, part in enumerate(parts[:-1]):
        if EXERCISE_PART.fullmatch(part):
            return "/".join(parts[: index + 1])
    return None


def normalized_exercise_stem(stem: str, level_label: str) -> str:
    normalized = stem.casefold().removesuffix("_an")
    grade_prefix = level_label[0]
    if level_label != "2nde" and normalized.startswith(grade_prefix) and len(normalized) > 1:
        if normalized[1].isalpha():
            normalized = normalized[1:]
    return normalized


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


class ReferenceParser(HTMLParser):
    ATTRIBUTES = {"src", "href", "data", "movie", "codebase", "action", "background", "poster"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if value and name and name.lower() in self.ATTRIBUTES:
                self.references.append(value.strip())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--verify-crc",
        action="store_true",
        help="décompresser les entrées de toutes les archives pour vérifier les CRC ZIP",
    )
    parser.add_argument(
        "--install-root",
        type=Path,
        default=None,
        help="chemin local optionnel de l'installation historique à comparer",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    workspace_root = repo_root.parent
    original_root = workspace_root
    backup_root = workspace_root / "phase0-backup" / "archives-originales"
    inventory_root = repo_root / "inventory"

    manifest: dict = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "scope": "Mathenpoche levels 6e, 5e, 4e, 3e, 2nde; optional historical archives are included for reference",
        "license_note": "The archive pages state GPL; exact version remains to be confirmed from source notices.",
        "provenance_pages": {"SWF": SWF_PAGE, "Sources": SOURCE_PAGE},
        "archives": [],
    }
    previous_manifest_path = inventory_root / "archive_manifest.json"
    previously_verified_hashes: set[str] = set()
    if previous_manifest_path.is_file():
        try:
            previous_manifest = json.loads(previous_manifest_path.read_text(encoding="utf-8"))
            previously_verified_hashes = {
                item["sha256"]
                for item in previous_manifest.get("archives", [])
                if item.get("crc_verified")
            }
        except (json.JSONDecodeError, KeyError, TypeError):
            previously_verified_hashes = set()
    member_rows: list[dict] = []
    candidate_rows: list[dict] = []
    archive_by_category_name: dict[tuple[str, str], dict] = {}

    for category in ("Sources", "SWF"):
        source_dir = original_root / category
        backup_dir = backup_root / category
        if not source_dir.is_dir() or not backup_dir.is_dir():
            raise SystemExit(f"Répertoires source/sauvegarde absents pour {category}")

        for original_path in sorted(source_dir.glob("*.zip")):
            backup_path = backup_dir / original_path.name
            if not backup_path.is_file():
                raise SystemExit(f"Copie de sauvegarde absente : {backup_path}")

            original_hash = sha256(original_path)
            backup_hash = sha256(backup_path)
            if original_hash != backup_hash:
                raise SystemExit(f"Empreinte différente pour {original_path.name}")

            with zipfile.ZipFile(backup_path) as archive:
                infos = [info for info in archive.infolist() if not info.is_dir()]
                bad_member = archive.testzip() if args.verify_crc else None
                if bad_member:
                    raise SystemExit(f"CRC ZIP invalide : {backup_path.name}:{bad_member}")
                crc_verified = args.verify_crc or original_hash in previously_verified_hashes

                extension_counts = Counter(file_extension(info.filename) for info in infos)
                entry_records = []
                for info in infos:
                    extension = file_extension(info.filename)
                    record = {
                        "member": info.filename,
                        "size_bytes": info.file_size,
                        "compressed_bytes": info.compress_size,
                        "crc32": f"{info.CRC:08x}",
                        "extension": extension,
                    }
                    entry_records.append(record)
                    member_rows.append(
                        {
                            "category": category,
                            "archive": original_path.name,
                            "member": info.filename,
                            "extension": extension,
                            "size_bytes": info.file_size,
                            "compressed_bytes": info.compress_size,
                            "crc32": f"{info.CRC:08x}",
                            "exercise_directory": exercise_directory(info.filename) or "",
                            "candidate_shared_path": root_relative(info.filename),
                        }
                    )
                    if LICENSE_NAME.search(PurePosixPath(info.filename).name):
                        candidate_rows.append(
                            {"category": category, "archive": original_path.name, **record}
                        )

            install_path = args.install_root / original_path.name if category == "SWF" and args.install_root else None
            install_record = None
            if install_path and install_path.is_file():
                install_hash = sha256(install_path)
                install_record = {
                    "archive_name": original_path.name,
                    "size_bytes": install_path.stat().st_size,
                    "sha256": install_hash,
                    "matches_archive_original": install_hash == original_hash,
                }

            record = {
                "category": category,
                "name": original_path.name,
                "original_path": f"{category}/{original_path.name}",
                "backup_path": f"../phase0-backup/archives-originales/{category}/{backup_path.name}",
                "official_download_url": source_url(category, original_path.name),
                "official_index_page": SOURCE_PAGE if category == "Sources" else SWF_PAGE,
                "size_bytes": original_path.stat().st_size,
                "sha256": original_hash,
                "zip_file_count": len(infos),
                "total_uncompressed_bytes": sum(info.file_size for info in infos),
                "extension_counts": dict(sorted(extension_counts.items())),
                "crc_verified": crc_verified,
                "matches_local_install_copy": install_record,
                "members": entry_records,
            }
            manifest["archives"].append(record)
            archive_by_category_name[(category, original_path.name)] = record
            print(f"Inventorié {category}/{original_path.name} ({len(infos)} fichiers)")

    checksums_path = workspace_root / "phase0-backup" / "SHA256SUMS"
    checksum_lines = []
    backup_parent = workspace_root / "phase0-backup"
    for item in manifest["archives"]:
        relative_backup_path = f"archives-originales/{item['category']}/{item['name']}"
        checksum_lines.append(f"{item['sha256']}  {relative_backup_path}")
    checksums_path.write_text("\n".join(checksum_lines) + "\n", encoding="utf-8")

    inventory_root.mkdir(parents=True, exist_ok=True)
    (inventory_root / "archive_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    write_csv(
        inventory_root / "archive_members.csv",
        [
            "category", "archive", "member", "extension", "size_bytes",
            "compressed_bytes", "crc32", "exercise_directory", "candidate_shared_path",
        ],
        member_rows,
    )
    write_csv(
        inventory_root / "license_candidates.csv",
        ["category", "archive", "member", "size_bytes", "compressed_bytes", "crc32", "extension"],
        candidate_rows,
    )

    summary_rows = []
    for key, level in LEVELS.items():
        for category, archive_name in (("Sources", level["source"]), ("SWF", level["swf"])):
            archive_record = archive_by_category_name.get((category, archive_name))
            if not archive_record:
                continue
            summary_rows.append(
                {
                    "level": level["label"],
                    "archive_type": category,
                    "archive": archive_name,
                    "archive_bytes": archive_record["size_bytes"],
                    "member_count": archive_record["zip_file_count"],
                    "total_uncompressed_bytes": archive_record["total_uncompressed_bytes"],
                    **{
                        f"count_{ext.lstrip('.') or 'no_extension'}": count
                        for ext, count in archive_record["extension_counts"].items()
                    },
                }
            )
    summary_fields = list(dict.fromkeys(field for row in summary_rows for field in row))
    write_csv(inventory_root / "grade_summary.csv", summary_fields, summary_rows)

    exercise_groups: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in member_rows:
        if row["category"] != "SWF" or not row["exercise_directory"]:
            continue
        level_key = next(
            (key for key, data in LEVELS.items() if row["archive"] == data["swf"]), None
        )
        if level_key:
            exercise_groups[(LEVELS[level_key]["label"], row["exercise_directory"])].append(row)

    source_stems: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))
    for level in LEVELS.values():
        source_record = archive_by_category_name.get(("Sources", level["source"]))
        if source_record:
            for member in source_record["members"]:
                if member["extension"] == ".fla":
                    source_stem = PurePosixPath(member["member"]).stem.casefold().removesuffix("_an")
                    key = normalized_exercise_stem(source_stem, level["label"])
                    source_stems[key][level["label"]].add(source_stem)

    exercise_rows = []
    for (level_label, directory), files in sorted(exercise_groups.items()):
        swf_members = [row for row in files if row["extension"] == ".swf"]
        stems = {
            normalized_exercise_stem(PurePosixPath(row["member"]).stem, level_label)
            for row in swf_members
        }
        matched_fla = sorted(
            source_stem
            for stem in stems
            for source_stem in source_stems.get(stem, {}).get(level_label, set())
        )
        exercise_rows.append(
            {
                "level": level_label,
                "exercise_directory": directory,
                "swf_count": len(swf_members),
                "html_count": sum(row["extension"] in {".htm", ".html"} for row in files),
                "js_count": sum(row["extension"] == ".js" for row in files),
                "xml_count": sum(row["extension"] == ".xml" for row in files),
                "member_count": len(files),
                "matched_source_fla_stems": ";".join(matched_fla),
            }
        )
    write_csv(
        inventory_root / "exercises.csv",
        [
            "level", "exercise_directory", "swf_count", "html_count", "js_count",
            "xml_count", "member_count", "matched_source_fla_stems",
        ],
        exercise_rows,
    )

    path_uses: dict[str, list[dict]] = defaultdict(list)
    for row in member_rows:
        if row["category"] != "SWF":
            continue
        if row["archive"] not in {data["swf"] for data in LEVELS.values()}:
            continue
        path_uses[row["candidate_shared_path"]].append(row)
    shared_rows = []
    for relative_path, uses in sorted(path_uses.items()):
        levels_found = sorted(
            {
                data["label"]
                for data in LEVELS.values()
                if data["swf"] in {row["archive"] for row in uses}
            }
        )
        if len(levels_found) < 2:
            continue
        crc_values = sorted({row["crc32"] for row in uses})
        shared_rows.append(
            {
                "relative_path": relative_path,
                "level_count": len(levels_found),
                "levels": ";".join(levels_found),
                "archive_member_count": len(uses),
                "matching_crc32_across_entries": len(crc_values) == 1,
                "crc32_values": ";".join(crc_values),
            }
        )
    write_csv(
        inventory_root / "shared_dependencies.csv",
        [
            "relative_path", "level_count", "levels", "archive_member_count",
            "matching_crc32_across_entries", "crc32_values",
        ],
        shared_rows,
    )

    page_reference_rows: list[dict] = []
    resolved_target_levels: dict[str, set[str]] = defaultdict(set)
    referenced_members: dict[tuple[str, str], int] = Counter()
    external_reference_rows: list[dict] = []
    dynamic_reference_pattern = re.compile(
        r"\b(?:loadMovie(?:Num)?|loadVariables(?:Num)?)\s*\(\s*['\"]([^'\"]+)['\"]",
        re.I,
    )
    css_url_pattern = re.compile(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", re.I)

    swf_archive_records = [
        item
        for item in manifest["archives"]
        if item["category"] == "SWF" and item["name"] in {data["swf"] for data in LEVELS.values()}
    ]
    for archive_record in swf_archive_records:
        archive_name = archive_record["name"]
        level_label = next(
            data["label"] for data in LEVELS.values() if data["swf"] == archive_name
        )
        member_names = {item["member"] for item in archive_record["members"]}
        archive_path = Path(archive_record["backup_path"])
        with zipfile.ZipFile(archive_path) as archive:
            for info in archive.infolist():
                if info.is_dir() or file_extension(info.filename) not in {
                    ".htm", ".html", ".js", ".css", ".xml"
                }:
                    continue
                raw = archive.read(info).decode("utf-8", errors="replace")
                parser_for_file = ReferenceParser()
                try:
                    parser_for_file.feed(raw)
                except Exception:
                    pass
                refs = list(parser_for_file.references)
                refs.extend(match.group(1).strip() for match in dynamic_reference_pattern.finditer(raw))
                refs.extend(match.group(1).strip() for match in css_url_pattern.finditer(raw))

                for reference in sorted(set(refs)):
                    parsed = urlsplit(reference)
                    path = unquote(parsed.path).replace("\\", "/")
                    if not path or parsed.scheme or path.startswith("//"):
                        status = "external_or_non_file"
                        resolved = ""
                    else:
                        archive_root = PurePosixPath(info.filename).parts[0]
                        if path.startswith("/"):
                            candidate = posixpath.normpath(posixpath.join(archive_root, path.lstrip("/")))
                        else:
                            candidate = posixpath.normpath(
                                posixpath.join(posixpath.dirname(info.filename), path)
                            )
                        resolved = candidate if candidate in member_names else ""
                        status = "found_in_archive" if resolved else "not_found_by_static_path"
                        if resolved:
                            relative_target = root_relative(resolved)
                            resolved_target_levels[relative_target].add(level_label)
                            referenced_members[(archive_name, resolved)] += 1

                    row = {
                        "level": level_label,
                        "archive": archive_name,
                        "source_member": info.filename,
                        "reference": reference,
                        "resolved_member": resolved,
                        "resolution": status,
                    }
                    page_reference_rows.append(row)
                    if status == "external_or_non_file":
                        external_reference_rows.append(row)

    write_csv(
        inventory_root / "page_references.csv",
        ["level", "archive", "source_member", "reference", "resolved_member", "resolution"],
        page_reference_rows,
    )
    write_csv(
        inventory_root / "external_references.csv",
        ["level", "archive", "source_member", "reference", "resolved_member", "resolution"],
        external_reference_rows,
    )
    reference_summary_rows = []
    for relative_target, levels_found in sorted(resolved_target_levels.items()):
        if len(levels_found) < 2:
            continue
        uses = [
            {"archive": archive_name, "target": target, "count": count}
            for (archive_name, target), count in referenced_members.items()
            if root_relative(target) == relative_target
        ]
        reference_summary_rows.append(
            {
                "relative_target": relative_target,
                "level_count": len(levels_found),
                "levels": ";".join(sorted(levels_found)),
                "total_reference_count": sum(use["count"] for use in uses),
                "archive_targets": ";".join(
                    f"{use['archive']}:{use['target']} ({use['count']})" for use in uses
                ),
            }
        )
    write_csv(
        inventory_root / "referenced_shared_dependencies.csv",
        ["relative_target", "level_count", "levels", "total_reference_count", "archive_targets"],
        reference_summary_rows,
    )

    print(
        f"Écritures terminées : {len(manifest['archives'])} archives, "
        f"{len(member_rows)} fichiers, {len(exercise_rows)} dossiers d'exercice, "
        f"{len(shared_rows)} chemins répétés entre niveaux, "
        f"{len(page_reference_rows)} références statiques analysées."
    )
    if not args.verify_crc:
        print("Note : relancer avec --verify-crc pour décompresser et contrôler les CRC des ZIP.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
