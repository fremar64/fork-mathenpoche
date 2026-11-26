Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
# Phase 0 — cadrage et sauvegarde

## Répertoires examinés

- Archives fournies : dossiers `Sources/` et `SWF/` du répertoire de travail local.
- Application historique déployée : installation distincte du dépôt, décrite dans les sections ci-dessous.
- Nouvelle sauvegarde : `../phase0-backup/archives-originales/` par rapport au dépôt.
- Nouveau dépôt : le présent répertoire `fork-mathenpoche/`.

La nouvelle copie des archives est distincte des originaux et du site en cours d'exécution. Les ZIP restent hors du dépôt Git pour garder le dépôt léger. Les empreintes du manifeste permettent de vérifier que la copie de sauvegarde est identique aux originaux.

## Provenance connue

Les archives sont associées aux pages de téléchargement de l'archive officielle Mathenpoche :

- SWF : <https://archives.mathenpoche.sesamath.net/index.php?page=210> ; liens directs dans `/telechargements/{nom}.zip`.
- Sources FLA : <https://archives.mathenpoche.sesamath.net/index.php?page=220> ; liens directs dans `/telechargements/sources/{nom}.zip`.
- La page des sources annonce que les fichiers FLA sont modifiables conformément à la licence GPL et présente les niveaux 6e, 5e, 4e, 3e et 2nde, plus des archives anciennes et EBEPS.
- La page des binaires annonce des archives de contenu SWF téléchargeables, y compris CAP. CAP n'est pas dans le périmètre initial du fork.

Les téléchargements des ZIP renvoient des contenus binaires, donc leur contenu n'est pas cité comme page web dans le présent document. Les URL des archives sont consignées dans `inventory/archive_manifest.json`. La page des archives annonce la licence GPL, mais la recherche des noms de fichiers n'a pas trouvé de notice interne évidente de type `LICENSE`, `COPYING` ou `README` dans les ZIP.

## Sauvegarde et intégrité

Le dossier `../phase0-backup/archives-originales/` contient une copie des répertoires Sources et SWF. `../phase0-backup/SHA256SUMS` est un fichier standard de sommes de contrôle des copies. `inventory/archive_manifest.json` enregistre, pour chaque ZIP : chemin original, chemin de sauvegarde, URL officielle connue, taille, SHA-256, nombre d'entrées, résultat de comparaison et liste des fichiers. `inventory/archive_members.csv` fournit une vue tabulaire complète ; `inventory/grade_summary.csv` et `inventory/exercises.csv` donnent les synthèses par niveau et dossier d'exercice.

La première vérification a contrôlé les CRC de toutes les entrées des 14 ZIP. Les 8 archives sources et 6 archives SWF ont une empreinte identique entre origine et sauvegarde. Les 6 ZIP de niveaux et CAP présents dans le répertoire de l'installation historique ont également les mêmes SHA-256 que les ZIP SWF correspondants.

Pour régénérer l'inventaire après modification explicite des archives :

```bash
python3 scripts/build_inventory.py
```

Le script compare les empreintes des originaux et des sauvegardes. Les archives historiques ne doivent pas être modifiées par le script.

## Inventaire initial des contenus

Périmètre cible : 6e, 5e, 4e, 3e et 2nde. Les archives historiques comprennent aussi deux versions « avant programmes », EBEPS et CAP ; elles sont référencées pour éviter toute confusion, mais les variantes anciennes, EBEPS et CAP ne sont pas automatiquement incluses dans la première vague de portage.

L'inventaire distingue les FLA de sources, les SWF exécutables, pages HTML, scripts, XML de niveau, CSS et ressources média. `inventory/page_references.csv` relève les références statiques dans les pages HTML, scripts, CSS et XML ; `inventory/referenced_shared_dependencies.csv` identifie des cibles référencées dans plusieurs niveaux ; `inventory/external_references.csv` consigne les URL et références non fichier. `inventory/shared_dependencies.csv` recense les chemins récurrents, notamment les noyaux géométriques, aides et menus. Dans cette première comparaison, 1 983 chemins relatifs apparaissent dans plusieurs ZIP de niveau ; 138 ont le même CRC32 pour toutes leurs occurrences. La présence d'un même nom ne prouve pas que les contenus sont identiques : il faudra calculer des empreintes SHA-256 des fichiers retenus avant de les mutualiser.

Le scanner a relevé 12 023 références statiques : 7 828 résolues par chemin relatif dans les ZIP, 1 899 non résolues par cette règle simple et 2 296 externes ou non fichier (dont anciens appels au contrôle Flash). « Non résolue » ne signifie pas automatiquement « cassée » : les archives contiennent des appels historiques côté serveur, des URL Flash et des chemins qui peuvent dépendre du document de base du navigateur. Ces lignes sont à examiner manuellement avant de conclure.

Les premiers décomptes des sources FLA dans les archives principales sont : 769 (6e), 842 (5e), 1 066 (4e), 766 (3e) et 87 (2nde), soit 3 530 fichiers FLA. Les ZIP SWF correspondants comprennent environ 4 125 fichiers `.swf`. L'index détecte 1 847 dossiers dont le chemin ressemble à `exoN` et associe par nom normalisé au moins un FLA plausible à 1 686 de ces dossiers. Ce rapprochement est heuristique, pas une validation de l'équivalence pédagogique ou technique ; les lignes restantes et les doublons doivent être revus. Les nombres de FLA incluent des documents de création et ne représentent pas le nombre d'exercices publiables. Le manifeste détaillé est la source de vérité pour les décomptes révisés.

## Installation historique et consultation

L'installation historique est servie par Apache HTTP Server `httpd:2.4-alpine` dans Docker Compose :

- service `mathenpoche`, conteneur `mathenpoche-httpd` ;
- port publié sur `127.0.0.1:8085` vers le port 80 du conteneur ;
- montage en lecture seule de `./www` vers `/usr/local/apache2/htdocs` ;
- montage des vhosts Apache en lecture seule ;
- en-têtes de sites locaux : `mathenpoche6eme.ceredis.net`, `mathenpoche5eme.ceredis.net`, `mathenpoche4eme.ceredis.net`, `mathenpoche3eme.ceredis.net`, `mathenpoche2nd.ceredis.net`, `mathenpochecap.ceredis.net`.

La configuration Nginx locale relaie ces noms vers `127.0.0.1:8085`. Le script `launch-mathenpoche.sh` ouvre ces six adresses dans Firefox ou Pale Moon. Il faut que la résolution locale des noms et le proxy Nginx soient opérationnels. Le contenu historique est distribué depuis `www/`; les pages HTML y chargent Ruffle, et Apache associe le type MIME `application/wasm` aux fichiers `.wasm`.

Vérification en lecture seule du 26 novembre 2026 : Docker signale `mathenpoche-httpd` en état `Up`, avec le port `127.0.0.1:8085->80/tcp`. Les six noms de niveau se résolvent localement sur `127.0.0.1`, et une requête avec l'en-tête `Host: mathenpoche6eme.ceredis.net` a reçu `HTTP 200` sur le port 8085. La vérification n'a pas lancé, arrêté ni recréé le conteneur.

Le script `setup-app.sh` extrait les six ZIP de niveaux dans `www/`, télécharge le dernier paquet Ruffle Selfhosted depuis l'API GitHub, vérifie son digest SHA-256, injecte le script Ruffle dans les pages HTML qui ne le référencent pas et génère les pages `index.html` de redirection. La copie actuellement présente déclare Ruffle Selfhosted `0.8.0` dans `www/ruffle/package.json`. **Ne pas relancer ce script pendant le portage sans sauvegarder `www/`** : il modifie le contenu servi et sa récupération de Ruffle n'est pas figée sur une version.

Cette installation sert de référence de comparaison. Le fork Next.js doit être développé et déployé séparément, sans montage sur ce répertoire ni remplacement des conteneurs existants.

## Licences et attributions

La page d'archives Mathenpoche annonce une licence GPL. La version exacte et les notices contenues dans les archives doivent être inspectées avant le choix d'un fichier `LICENSE` pour le nouveau dépôt. Les fichiers intégrés tels que Ruffle ont leur propre licence (le paquet local indique MIT ou Apache-2.0) et devront garder leurs avis si des éléments sont réutilisés. La licence d'un composant ne remplace pas celle des contenus Mathenpoche.

## Limites de cet inventaire

- Les comptages et chemins décrivent le contenu ZIP ; ils ne certifient pas la justesse pédagogique ni le fonctionnement de chaque exercice.
- La mise en correspondance FLA/SWF par nom est indicative : un SWF peut charger des bibliothèques communes ou des fichiers externes.
- La provenance connue est la page officielle et ses liens directs ; les archives locales ont été comparées entre elles, pas retéléchargées depuis le site.
- Les volumes/tables et l'état réel des conteneurs n'ont pas été modifiés ni inspectés en écriture.
