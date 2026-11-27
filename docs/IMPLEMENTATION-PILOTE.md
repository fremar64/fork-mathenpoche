# Première implémentation du pilote

**Date :** 27 novembre 2026
**Périmètre :** base Next.js/TypeScript, graphe de parcours et interface 2D de l'exercice 6e, chapitre 1, série 1, exercice 2.

## Examen du dépôt ENAA

Le code ENAA a été examiné à partir du dépôt GitHub, notamment le catalogue, l'activité `valeur-position` et le jeu `assiettes-et-couverts`.

- `valeur-position` sépare les réglages, la génération des nombres, le score, l'état de la partie, le tableau de numération et l'écran de résultats. Il propose une réponse en deux essais et attribue le point si la réponse est corrigée au deuxième essai.
- Le code ENAA relevé ne correspond pas entièrement au cahier des charges de ce pilote : il propose cinq profils CP à CM2, des sessions de cinq questions à certains niveaux, et une durée d'évaluation de 45 secondes par question. Le présent pilote applique les décisions propres à Mathenpoche : six profils CP à 6e, dix questions et un compte à rebours global de 15 minutes en CP–CE2 ou 10 minutes en CM1–6e.
- `assiettes-et-couverts` est un jeu 3D React Three Fiber distinct, avec collecte de couverts pendant un seul trajet et vérification unique. Sa logique correspond au modèle de conceptualisation TSD discuté pour le CP. Ce jeu est conservé pour une étape ultérieure et n'est pas intégré au premier lot.

Les éléments retenus d'ENAA sont le découpage par activité, les réglages avant la partie, les fonctions métier séparées des composants visuels et l'usage d'un catalogue data-driven. Aucun comportement pédagogique d'ENAA n'a été copié sans comparaison aux décisions du pilote.

## Sources du pilote

- Sources originales : `mathenpoche-migration/6eme-chap1-serie1/sources/serie1/exo2/`.
- Export JPEXS de l'exercice : `mathenpoche-migration/6eme-chap1-serie1/extracted/exo2/N1s1ex2/`.
- Export JPEXS de l'aide : `mathenpoche-migration/6eme-chap1-serie1/extracted/exo2/N1s1ex2_an/`.
- Tableau de numération d'origine : `mathenpoche-migration/6eme-chap1-serie1/extracted/exo2/tab_entiers/`.
- Captures et vidéos UX : `mathenpoche-migration/6eme-chap1-serie1/Captures d’écran/` et `Captures vidéo/`.

Le script ActionScript de génération décrit dix questions, de nombres à deux chiffres aux nombres à douze chiffres, ainsi que les positions interrogées. Le nouveau générateur remplace la sélection aléatoire de l'ordre de grandeur par une progression contrôlée : en Entraînement, les nombres commencent petits et la difficulté monte après des réussites immédiates répétées ; en Évaluation, elle suit une progression fixe compatible avec le profil choisi.

Les formes SVG, images, sons et animations extraits des SWF n'ont pas été copiés dans l'application. L'interface actuelle est dessinée avec HTML et CSS ; l'aide est recréée comme une séquence pédagogique accessible au clavier.

## Graphe pédagogique

Le catalogue initial est décrit dans `src/content/learning-graph.ts` avec des nœuds (domaines, sous-parcours, activités) et des relations orientées (`contains`, `practices`, `prepares`, `reinvests`). Le premier chemin est :

`Numération → Nombres entiers naturels → Quel est le chiffre des… ?`

Les nombres décimaux, les fractions/nombres rationnels, les structures additives et multiplicatives, la géométrie et la gestion des données sont déjà représentés comme parcours prévus. Leurs prérequis et les relations plus fines restent à valider avec les enseignants ; aucun moteur de recommandation global ni tuteur IA n'est inclus dans ce prototype.

## Fonctions portées

- Accueil data-driven : domaines et sous-parcours affichent leur disponibilité ; le lien de l'exercice pilote est actif.
- Choix de profil CP, CE1, CE2, CM1, CM2 ou 6e, indépendant de la provenance 6e.
- Entraînement : difficulté progressive, réponse au clavier ou bouton, aide interactive en plusieurs étapes après deux erreurs, tableau de numération et score question par question.
- Évaluation : dix questions, compte à rebours global de 15 ou 10 minutes selon le profil, sans aide ni tableau de numération ; questions non répondues à expiration sans point et tentative incomplète non validante.
- Écran final avec les quatre appréciations et validation du profil d'évaluation à partir de 8/10 lorsque la session est complète.

## Cinématique de l'aide interactive

Les sept captures dans `docs/captures-animations-interactives/` montrent les deux sous-questions de l'exemple original. D'abord, l'élève voit le tableau vide et la règle des unités ; ensuite, les chiffres de `38 527` apparaissent dans les colonnes en partant de la droite. La colonne demandée et son chiffre sont alors encadrés en rouge, puis la phrase de correction apparaît. L'aide passe ensuite au rang des unités de mille, conserve le nombre placé, met en évidence la classe « Mille » et le chiffre 8. À l'état final, la flèche droite n'est plus affichée, la flèche gauche reste disponible pour relire et le bouton rouge ferme l'aide. La septième capture montre l'exercice après cette fermeture.

Dans le pilote, chaque question porte sur un seul rang. `generateHelpSteps(numberValue, targetRank)` produit donc une séquence pour ce rang : tableau vide, placement d'un chiffre par étape de droite à gauche, puis mise en évidence de la classe, de la colonne cible et de la réponse. Pour un nombre à cinq chiffres, cela donne sept étapes, comme la séquence fournie. Les flèches et les touches gauche/droite naviguent dans les étapes ; le bouton rouge ou Échap ferme l'aide et rend la main à l'élève. La flèche gauche est désactivée au début ; à la dernière étape, la flèche droite disparaît.

## Limites actuelles

- Le prototype n'a pas encore été validé en situation avec des élèves ou des enseignants ; les durées et la progression adaptative doivent être observées et ajustées.
- La progression n'est pas enregistrée : aucun compte, Supabase, tableau de bord ou stockage local n'est mis en place dans ce lot.
- L'aide interactive recrée l'objectif pédagogique à partir du comportement observé et des captures ; sa séquence doit être relue avec un enseignant avant publication.
- La page de navigation présente déjà la structure du graphe, mais ne calcule pas encore de recommandations personnalisées entre activités.
- Les règles de licence et d'attribution des contenus Mathenpoche restent soumises à la vérification prévue dans la Phase 0.
