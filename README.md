# Mathenpoche HTML5

Fork en préparation pour porter progressivement les exercices Mathenpoche vers une application Next.js/TypeScript, sans rendre les exercices dépendants d'un compte.

**URL publique cible du MVP :** [https://rallye-maths.ceredis.net](https://rallye-maths.ceredis.net)

## État

La Phase 0 est terminée. Le dépôt contient maintenant le premier prototype Next.js/TypeScript : le catalogue est décrit par un graphe pédagogique versionné dans Git, et l'exercice pilote « Quel est le chiffre des… ? » est porté en interface 2D.

Voir :

- [`docs/CAHIER_DES_CHARGES.md`](docs/CAHIER_DES_CHARGES.md) — objectifs et exigences produit ;
- [`docs/STRATEGIE-PEDAGOGIQUE.md`](docs/STRATEGIE-PEDAGOGIQUE.md) — deux familles d'activités et parcours d'apprentissage par notion ;
- [`docs/PHASE0.md`](docs/PHASE0.md) — provenance, sauvegarde et installation historique ;
- [`docs/PILOTE-6E-CHAP1-SERIE1-EXO2.md`](docs/PILOTE-6E-CHAP1-SERIE1-EXO2.md) — fiche fonctionnelle de l'exercice pilote ;
- [`docs/ARCHITECTURE_DECISIONS.md`](docs/ARCHITECTURE_DECISIONS.md) — décisions prises et points à confirmer ;
- [`docs/IMPLEMENTATION-PILOTE.md`](docs/IMPLEMENTATION-PILOTE.md) — examen du code ENAA, écarts relevés et périmètre de cette première implémentation ;
- [`inventory/`](inventory/) — inventaire généré depuis les archives.

## Démarrer en local

Prérequis : Node.js 20.9 ou plus récent.

```sh
npm install
npm run dev
```

L'application est alors disponible à `http://localhost:3000`. L'exercice pilote est accessible depuis le parcours **Numération → Nombres entiers naturels**.

Fichiers d'inventaire utiles : `archive_manifest.json`, `archive_members.csv`, `grade_summary.csv`, `exercises.csv`, `pilot-exercise.json`, `shared_dependencies.csv`, `referenced_shared_dependencies.csv`, `page_references.csv`, `external_references.csv` et `license_candidates.csv`.

## Sources archivées

Les ZIP originaux sont sauvegardés hors de ce dépôt, dans `../phase0-backup/archives-originales/`. Ils ne sont pas versionnés dans Git. Le manifeste d'inventaire donne leurs tailles, empreintes SHA-256, chemins, provenances connues et contenus ZIP.

## Licence

L'archive officielle annonce une licence GPL pour Mathenpoche. La version exacte et les obligations propres à chaque composant doivent être confirmées avant de choisir le fichier de licence de ce fork. Voir [`docs/PHASE0.md`](docs/PHASE0.md).
