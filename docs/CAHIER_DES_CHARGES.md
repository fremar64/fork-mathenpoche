# Cahier des charges — fork HTML5 de Mathenpoche

**Version :** 0.1 — 26 novembre 2026  
**Statut :** cadrage produit mis à jour selon les orientations du porteur du projet ; les détails d'implémentation et les validations professorales restent à préciser.

## 1. Vision

Créer un fork libre, gratuit d’accès et utilisable sur le web qui organise deux familles complémentaires : les exercices décontextualisés de Mathenpoche pour entraîner des savoir-faire et des schèmes opératoires, et des jeux sérieux originaux de résolution de problèmes contextualisés. Le catalogue cible les cinq niveaux du primaire (CP, CE1, CE2, CM1, CM2) et les niveaux 6e, 5e, 4e, 3e et 2nde. Le MVP prend comme premier corpus l'archive Mathenpoche 6e ; les contenus des cinq niveaux du primaire seront intégrés au projet par étapes. Une activité peut toutefois être proposée dès le pilote à plusieurs classes en choisissant un profil de difficulté adapté : le niveau de provenance d'un exercice ne détermine pas à lui seul le niveau de compétence requis. Les exercices Mathenpoche seront progressivement réécrits en technologies web actuelles afin de fonctionner sans Adobe Flash. Le service vise en priorité les élèves et professeurs de mathématiques du Congo et des pays africains francophones.

Le projet doit rester utile avec des téléphones modestes, des connexions lentes ou instables et des sessions courtes en classe. La création d’un compte ne doit jamais être obligatoire pour accéder aux exercices. Les professeurs pourront créer et gérer leurs comptes ainsi que ceux des élèves qui en ont besoin. Les tableaux de bord permettront aux professeurs de suivre leurs classes et aux élèves connectés de consulter leurs propres progrès. L'accès restera gratuit pour les élèves et les enseignants ; le financement de la maintenance et des évolutions reposera sur le sponsoring et le naming.

## 2. Situation de départ observée

- Le site source local est servi par Apache dans Docker. Il contient les anciennes pages par niveau et une copie locale de Ruffle pour lire les SWF.
- Le dossier source local ne contient pas de dépôt Git à ce jour. Il ne semble pas encore s’agir d’une application Next.js.
- Les archives de contenu séparées contiennent les SWF et des archives de sources FLA pour les niveaux demandés. Les archives comprennent aussi d’anciens programmes et des exercices complémentaires.
- Une archive de niveau ne garantit pas à elle seule que tous les fichiers partagés, polices, sons, bibliothèques, pages ou services dont les exercices dépendent ont été recensés.

Ces constats sont issus d’une première inspection des dossiers locaux. La phase de cadrage technique devra confirmer l’inventaire complet avant de figer l’architecture.

## 3. Objectifs

1. Regrouper dans une seule application les contenus des cinq niveaux du primaire et des cinq niveaux 6e–2nde, avec navigation par classe, chapitre, série et exercice ; le premier corpus MVP est l'archive 6e.
2. Remplacer progressivement les exercices Flash par des exercices HTML5 accessibles depuis les navigateurs actuels.
3. Préserver autant que possible les objectifs pédagogiques, les consignes, les aides, la correction et les variantes des exercices d’origine.
4. Proposer une expérience rapide sur mobile, adaptée aux débits limités et sans compte obligatoire pour s’entraîner. Pour les activités compatibles, séparer le choix de l'activité mathématique du profil de difficulté (notamment l'ordre de grandeur des nombres).
5. Permettre aux professeurs de créer leur compte, de créer et gérer des comptes élèves, de proposer des exercices ou parcours et de suivre les progrès de leurs élèves dans un tableau de bord.
6. Permettre à chaque élève connecté de consulter son propre tableau de bord, son historique et ses progrès.
7. Publier le code source sur GitHub et déployer l’application web sur Vercel. Héberger les services Supabase sur l’infrastructure Coolify prévue par le porteur du projet.
8. Respecter la licence et les attributions applicables aux contenus d’origine et aux dépendances réutilisées.
9. Organiser les parcours par notion et niveau d'études : conceptualisation initiale inspirée de la TSD au CP ; extension du domaine des nombres par des exercices Mathenpoche aux niveaux suivants ; puis réinvestissement contextualisé selon un modèle de jeu adapté.

## 4. Hors périmètre initial

- Reproduire immédiatement tous les exercices et toutes les fonctions de l’ancien site.
- Reproduire immédiatement toutes les fonctions d’un éventuel ancien système de comptes, de classes et de suivi ; les fonctions du nouveau projet sont définies dans ce cahier des charges et déployées par étapes.
- Faire dépendre l’affichage public des exercices d’un appel réseau à la base de données.
- Ajouter au MVP un tuteur LLM personnifié par un avatar 3D animé. Cette piste sera étudiée après validation du MVP, avec une attention particulière aux usages pédagogiques, au coût et au fonctionnement sur appareils modestes.
- Ajouter de la messagerie, de la publicité ou de la collecte de données personnelles non nécessaires à l’apprentissage.
- Inclure CAP dans le périmètre de la première version, sauf décision ultérieure.

## 5. Publics et besoins

### Élève

- Trouver rapidement son niveau et l’exercice demandé par l’enseignant.
- Comprendre la consigne, demander une aide, répondre, obtenir un retour clair et recommencer.
- Utiliser le service sur ordinateur, tablette ou téléphone, avec clavier ou écran tactile.
- Retrouver localement ses exercices récents sans devoir fournir son identité.
- S’il possède un compte, retrouver ses exercices terminés, ses résultats et sa progression par niveau ou notion.

### Professeur

- Naviguer et projeter les exercices en classe.
- Partager un lien direct vers un exercice ou une série.
- Créer et gérer son compte professeur et les comptes élèves de ses classes, avec une procédure sécurisée de remise ou de renouvellement des identifiants.
- Créer ou attribuer des exercices et des parcours, puis consulter dans un tableau de bord l’avancement de la classe et les progrès individuels de ses élèves.
- Accéder uniquement aux classes et résultats qui lui sont autorisés.

### Élève avec compte

- Se connecter avec les identifiants remis ou activés par son professeur.
- Consulter son propre tableau de bord : exercices réalisés, progression, résultats et travaux attribués.
- Ne jamais accéder aux résultats personnels des autres élèves.

### Administrateur de contenu

- Contrôler l’inventaire, les sources et les licences.
- Savoir quels exercices sont à analyser, en cours de portage, relus ou publiés.
- Corriger les contenus et métadonnées par revue Git, sans modifier le moteur de l’application.

## 6. Expérience produit attendue

### Navigation

- Accueil présentant les niveaux du primaire et du collège/lycée à mesure que leurs contenus sont intégrés ; le MVP démarre avec le corpus 6e.
- Accès aux deux types d'activités et parcours organisés par notion ; pages de niveau, chapitre, série, jeu et exercice avec des URL stables et partageables.
- Recherche simple par titre, notion et code historique lorsqu’il est disponible.
- Indication visible des exercices portés en HTML5 et des contenus encore indisponibles.

### Écran d’exercice

- Titre, niveau, chapitre, série, consigne et objectif pédagogique.
- Deux modes distincts : **Entraînement** (aide et outils pédagogiques disponibles, sans chronomètre) et **Évaluation** (chronométré, sans aide ni outils d'aide comme le tableau de numération).
- Pour les activités où le niveau de difficulté est paramétrable, choix explicite d'un profil de difficulté, indépendant du niveau du catalogue et du niveau de l'archive source ; le professeur peut verrouiller ce réglage pour un travail attribué.
- Pour un exercice à un point par question, une réponse correcte au premier ou au deuxième essai rapporte le point ; deux erreurs consécutives laissent à zéro la question concernée sans retirer de point déjà gagné. À la fin, afficher le taux de réussite et l'appréciation pédagogique prévue pour l'exercice.
- Un profil de difficulté correspond à un niveau d'études, ici CP, CE1, CE2, CM1, CM2 ou 6e. Pour une activité et un profil donnés, le niveau de compétence est validé par une tentative complète avec au moins 80 % de réussite (par exemple 8/10 ou 4/5). Une évaluation interrompue par le chronomètre ne valide pas le niveau, même si le score partiel atteint le seuil ; les questions non répondues valent zéro et l'élève doit s'entraîner puis refaire l'exercice.
- Zone d’interaction adaptée à la famille d’exercice.
- Aide et correction accessibles selon le mode choisi ; aucune aide ni aucun tableau d'aide en mode Évaluation.
- Retour compréhensible après une réponse, possibilité de réessayer et indication du score si pertinent.
- Contrôles utilisables au clavier et au toucher ; taille de texte et contraste lisibles.
- Préférence pour des médias légers et des ressources locales plutôt que des dépendances distantes.

### Parcours par notion

- Présenter les deux familles dans un même catalogue : exercices Mathenpoche décontextualisés et jeux sérieux contextualisés conçus pour le fork.
- Organiser les parcours par notion et par niveau d'études, sans imposer un jeu de découverte identique à toutes les classes.
- Au CP, proposer un jeu inspiré de la situation fondamentale du dénombrement pour soutenir la conceptualisation initiale, puis une synthèse avec l'enseignant et des exercices Mathenpoche.
- À partir du CE1, partir de connaissances primitives des nombres naturels déjà conceptualisées ; utiliser les exercices Mathenpoche pour étendre le domaine des nombres maîtrisés, puis proposer un jeu de réinvestissement contextualisé conçu selon un modèle adapté à ces niveaux.
- Le jeu CP inspiré de la TSD et les jeux de vie courante pour les niveaux avancés sont des modèles distincts. Les modalités d'évaluation des jeux contextualisés seront définies après leur prototypage et l'observation des activités réelles des élèves.
- Les mécanismes ludiques servent la résolution mathématique : le contexte et les rétroactions rendent la connaissance utile, plutôt que d'ajouter seulement des points ou un décor à une série de questions.
- Présenter les résultats d'entraînement et les traces de réinvestissement contextualisé séparément dans les tableaux de bord. Ne pas fixer a priori les critères d'évaluation du jeu avancé ni lui appliquer automatiquement le seuil de 80 % des exercices.

### Connexion faible

- Servir les pages et exercices statiques depuis le CDN.
- Charger uniquement le code et les médias nécessaires à l’exercice ouvert.
- Éviter les appels répétés à Supabase pendant une interaction pédagogique.
- Mesurer le poids des pages et la fluidité sur un téléphone d’entrée de gamme avant de définir les budgets finaux.
- Étudier une capacité d’installation ou d’usage hors connexion après le premier pilote ; ne pas la promettre avant validation technique.

### Financement et visibilité des partenaires

- Le service est gratuit d'accès pour les élèves et les enseignants. Le projet prévoit de financer la maintenance et le développement par le sponsoring et le naming.
- Les logos des institutions et entreprises partenaires peuvent apparaître dans l'interface sous la mention de soutien du projet et avec une animation discrète.
- Les logos et animations ne doivent jamais recouvrir une question, une réponse, un score ou une commande pédagogique. Respecter la préférence de réduction des animations et éviter les clignotements ou mouvements rapides.
- La présence d'un partenaire ne doit pas modifier les exercices ni rendre les parcours pédagogiques payants.

## 7. Architecture proposée

### Application web

- Next.js avec TypeScript et App Router, dans un dépôt GitHub dédié au fork. Le starter retenu est [React Three Next de pmndrs](https://github.com/pmndrs/react-three-next), qui associe Next.js, React Three Fiber et Three.js.
- Utiliser le rendu DOM/React pour la navigation, les consignes, les formulaires, les tableaux et les tableaux de bord. Réserver le Canvas Three.js aux visualisations mathématiques ou animations pédagogiques qui en tirent un bénéfice réel, afin de préserver le chargement sur les téléphones modestes et les connexions lentes.
- Vérifier le poids initial, l'accessibilité, la compatibilité Vercel et les usages réellement nécessaires du starter pendant le prototype ; charger les scènes 3D uniquement là où elles sont utilisées.
- Pages, catalogue et métadonnées pré-rendables autant que possible. Les composants interactifs des exercices s’exécutent côté navigateur.
- Moteur partagé pour le cadre commun : consigne, aides, validation, retour, progression locale et instrumentation.
- Exercices organisés par familles pédagogiques et interactives. Chaque famille peut avoir son propre composant ou moteur ; ne pas forcer une abstraction générique avant d’avoir porté plusieurs exercices représentatifs.
- Le curriculum est décrit par un graphe pédagogique versionné dans Git : domaines, sous-parcours, notions, prérequis, activités et relations d’apprentissage. Les métadonnées restent éditables et contrôlables dans le dépôt ; la base n’est pas la source de vérité du catalogue public.
- Les parcours peuvent être traversés depuis plusieurs points (domaine, notion ou activité) et associent les activités à leurs objectifs, types, rôles pédagogiques, profils de difficulté, prérequis et statuts de portage. Les recommandations adaptatives s’appuient progressivement sur ces relations et sur les résultats disponibles, sans rendre l’accès anonyme dépendant d’une base.
- Le graphe ne signifie pas que toutes les notions ou relations sont déjà validées : elles sont ajoutées par étapes et relues avec des enseignants. La première livraison utilise cette structure pour relier Numération → Nombres entiers naturels → exercice pilote.
- Images, sons et autres ressources utilisées par les exercices servis depuis l’application ou un stockage adapté, avec attribution et optimisation.

### Supabase sur Coolify

- PostgreSQL/Supabase est la base des comptes, classes, comptes élèves, parcours attribués et tentatives nécessaires aux tableaux de bord.
- Les professeurs créent ou invitent leurs élèves au moyen d’un flux sécurisé côté serveur. La création de comptes ne doit pas exposer la clé administrative Supabase dans le navigateur.
- L’accès aux données côté client doit être protégé par des politiques RLS : un élève lit ses propres résultats ; un professeur lit les résultats des élèves rattachés à ses classes ; les opérations de gestion sont limitées aux rôles autorisés.
- Les tables et migrations doivent être versionnées dans Git. Les environnements de développement, prévisualisation et production doivent être séparés autant que l’hébergement le permet.
- Garder les exercices consultables sans compte et limiter les données d’élèves au strict nécessaire. Prévoir une progression locale pour les visiteurs sans compte et une progression synchronisée pour les élèves connectés.
- L’auto-hébergement de Supabase implique de gérer les mises à jour, secrets, SMTP, disponibilité, sauvegardes et restaurations. Les fonctions de la plateforme autohébergée ne sont pas identiques à Supabase Cloud ; les sauvegardes doivent être testées par restauration.

### Déploiement et performance

- Vercel héberge l’application Next.js et ses fonctions serveur éventuelles.
- URL publique cible du MVP : **[https://rallye-maths.ceredis.net](https://rallye-maths.ceredis.net)**. Le porteur du projet indique avoir créé l'enregistrement DNS dans Cloudflare ; le rattachement et la vérification du domaine côté Vercel restent à effectuer.
- Coolify héberge Supabase sur un serveur contrôlé par le projet. Ne pas exposer PostgreSQL directement à Internet si une connexion applicative sécurisée peut être utilisée.
- Choisir la région d’exécution des fonctions en tenant compte de la localisation réelle de la base. Les fichiers statiques profitent du CDN ; les requêtes de données dynamiques traversent le réseau jusqu’à la base.
- Tester la latence depuis plusieurs pays d’Afrique francophone et sur réseaux mobiles. La présence d’un point de présence CDN proche ne rend pas automatiquement proches les fonctions et la base de données.
- Garder un budget de fonctionnement et des alertes de consommation : gratuité pour les élèves et les enseignants ne signifie pas hébergement sans coût pour le projet.

## 8. Modèle de données envisagé

Les exercices eux-mêmes restent dans le dépôt. La base ne conserve que les données nécessaires aux fonctions de compte et de suivi.

- `profiles` : identifiant Auth, rôle minimal, préférences utiles.
- `classes` : professeur propriétaire, nom non sensible, paramètres.
- `class_members` : rattachement d’un compte élève à une classe, état du compte et pseudonyme éventuel.
- `assignments` : exercices ou séries attribués par un professeur à une classe ou à un élève, échéance éventuelle et état d’avancement.
- `learning_paths` : notion et niveau d'études visés, activités reliées et rôle adapté au parcours (conceptualisation initiale, entraînement, réinvestissement contextualisé).
- `attempts` : compte élève, activité, famille/type, résultat utile, nombre d'essais si nécessaire et horodatage ; conserver une durée seulement si elle sert à un objectif pédagogique explicite.
- Chaque résultat suivi doit identifier le mode (Entraînement ou Évaluation), le score obtenu et le maximum, le taux de réussite, le profil de difficulté choisi, le caractère complet ou interrompu de la tentative et, pour une Évaluation chronométrée, la durée. Ces données alimentent séparément le suivi des savoir-faire et les traces de réinvestissement contextualisé ; ne pas les présenter comme un diagnostic général des capacités de l'élève.
- `exercise_competency_progress` (vue ou projection dérivée des tentatives Mathenpoche) : état de validation par élève, exercice et niveau d'études choisi. Une tentative complète à au moins 80 % valide ce niveau ; une tentative incomplète à expiration ne le valide jamais. Cette règle ne valide pas automatiquement les résultats d'un jeu contextualisé.
- `contextual_reinvestment_evidence` (vue ou projection dérivée des tentatives de jeu) : observations et résultats au jeu contextualisé, reliés à la notion, au profil de difficulté et au scénario ; les critères restent propres au jeu et ne seront fixés qu'après son observation.
- `teacher_paths` : parcours personnalisés référençant les identifiants d’exercices du catalogue versionné.
- Vues ou requêtes de synthèse pour le tableau de bord professeur (par classe et par élève) et le tableau de bord élève (ses propres résultats uniquement).

Ce schéma est une première proposition à valider avec des enseignants. Les identifiants d’élèves, les champs collectés, les durées de conservation, les rôles et les politiques RLS devront être définis avant le pilote. Le professeur doit pouvoir retrouver ses classes et leurs élèves sans qu’une identité civile soit nécessaire : privilégier un pseudonyme ou un identifiant fourni par l’établissement et éviter de collecter nom complet, date de naissance, adresse ou données sensibles si la fonction peut marcher sans.

## 9. Stratégie de migration des exercices

### Inventaire

Pour chaque exercice, établir une fiche de suivi avec :

- niveau, chapitre, série, code et titre ;
- chemin de l’archive SWF et de la source FLA correspondante ;
- fichiers HTML/JS/XML, ressources partagées et bibliothèques nécessaires ;
- notion et objectif pédagogique ;
- type d’interaction et règles de validation ;
- présence d’aléatoire, d’aides, de correction, de sons, de temps ou de score ;
- statut de licence/attribution vérifié ;
- état : à inventorier, analysé, spécifié, porté, relu pédagogiquement, publié.

### Portage

1. Choisir un exercice et repérer toutes ses dépendances.
2. Observer l’exercice d’origine et consigner les états importants, les réponses acceptées, les erreurs et les aides.
3. Rédiger une courte spécification comportementale vérifiable.
4. Réimplémenter la logique, l’interface et les médias avec les composants web retenus.
5. Vérifier les réponses correctes et incorrectes, les cas limites, la répétition, les variantes aléatoires et les actions clavier/tactiles.
6. Faire relire le résultat par un professeur de mathématiques et comparer son rendu à l’exercice historique.
7. Publier le portage et mettre à jour son statut dans le catalogue.

Un lecteur Ruffle peut servir à comparer ou consulter temporairement les anciens contenus pendant la migration, mais ne constitue pas la cible HTML5 du portage. Les anciens SWF ne devraient pas être exposés comme contenus exécutables publics sans décision de sécurité explicite.

## 10. Phases et livrables

### Phase 0 — cadrage et sauvegarde

- Créer un dépôt Git propre pour le nouveau fork, sans remplacer le site local existant.
- Sauvegarder les archives originales et leur provenance ; calculer des empreintes des ZIP.
- Établir l’inventaire des cinq niveaux, des sources FLA, des SWF, des pages, des dépendances communes et des licences.
- Documenter l’environnement Docker actuel et la méthode de consultation des exercices originaux.

**Sortie attendue :** dépôt initial, inventaire machine-lisible et décisions d’architecture enregistrées.

### Phase 1 — prototype pédagogique

- Prototype en cours dans le dépôt `fork-mathenpoche` : graphe de domaines et sous-parcours, page d'accueil et premier portage 2D de l'exercice 2 de Numérique, chapitre 1, série 1. Le CP/CE1/CE2/CM1/CM2/6e est sélectionnable comme profil de difficulté, séparé du niveau de provenance de l'exercice.
- Comparer ce portage aux captures, vidéos, pages sources et scripts ActionScript extraits ; ajuster les règles de génération, le feedback, l'aide, le tableau de numération, les modes et le score conformément à la fiche [`PILOTE-6E-CHAP1-SERIE1-EXO2.md`](PILOTE-6E-CHAP1-SERIE1-EXO2.md).
- Le jeu de conceptualisation CP inspiré de Brousseau et le jeu immersif des niveaux suivants ne font pas partie de ce premier lot. L'authentification Supabase et les tableaux de bord sont également reportés.
- Mesurer poids, affichage mobile, usage clavier/tactile, animations du starter et comportement sur connexion lente.
- Ne pas activer le suivi individuel réel à ce stade ; définir toutefois le contrat de données des tentatives et les besoins des deux tableaux de bord pour éviter une migration coûteuse.

**Sortie attendue :** prototype déployable en prévisualisation, validé par comparaison avec l’original.

### Phase 2 — MVP public

- Publier le premier corpus issu de l'archive Mathenpoche 6e et sa navigation complète ; préparer le catalogue à accueillir les niveaux du primaire et 5e à 2nde par étapes.
- Présenter les deux familles d'activités et les parcours adaptés : conceptualisation initiale au CP, extension du domaine des nombres par exercices aux niveaux suivants, puis réinvestissement en contexte selon un modèle de jeu adapté.
- Rendre disponibles, dans les activités compatibles, les profils de difficulté CP, CE1, CE2, CM1, CM2 et 6e, indépendamment du niveau de provenance du contenu.
- Porter une petite sélection d’exercices par familles identifiées ; afficher clairement l’état de couverture.
- Ajouter recherche simple, liens directs, progression locale facultative et documentation de contribution. Les exercices restent entièrement utilisables sans compte.
- Mettre en place pipeline de déploiement GitHub vers prévisualisation Vercel puis production.
- Préparer le domaine public `rallye-maths.ceredis.net` et vérifier le routage Cloudflare–Vercel avant l'ouverture du MVP.
- Inclure la présentation discrète des partenaires dans l'interface, sans gêner les exercices.

**Sortie attendue :** application gratuite d’accès, utilisable sans compte, avec un premier ensemble d’exercices relus.

### Phase 3 — comptes, classes et tableaux de bord

- Déployer Supabase sur Coolify avec secrets, HTTPS, politiques RLS, sauvegardes externalisées et procédure de restauration éprouvée.
- Ajouter l’authentification professeur, la création et gestion sécurisées des comptes élèves, les classes, les parcours attribués et l’enregistrement des tentatives.
- Ajouter le tableau de bord professeur : classes, élèves, travaux attribués, avancement et progrès individuels, avec filtres par classe, élève, période et exercice lorsque pertinent.
- Ajouter le tableau de bord élève : progrès par activité et niveau de difficulté/études, niveaux de compétence validés ou restant à travailler, historique de ses exercices et travaux attribués.
- Séparer dans les tableaux de bord les validations de savoir-faire obtenues par les exercices et les observations de réinvestissement contextualisé ; ne définir le barème d'un jeu avancé qu'après observation des élèves.
- Vérifier les permissions par rôle et par classe ; un professeur ne voit que ses classes, et un élève seulement ses propres résultats.
- Garder les exercices publics et la progression locale accessibles sans compte.

**Sortie attendue :** comptes et tableaux de bord utilisables dans un pilote encadré, avec règles de confidentialité et permissions vérifiées avant l’utilisation par de vrais élèves.

### Phase 4 — extension et pérennité

- Prioriser les portages selon l’usage pédagogique, la demande des professeurs, les dépendances et le coût de migration.
- Intégrer par étapes les archives et contenus des cinq niveaux du primaire, puis étendre la couverture 5e à 2nde ; conserver la séparation entre classe de provenance, activité mathématique et profil de difficulté.
- Accueillir des contributions via fiches d’exercice, conventions, revue de code et revue pédagogique.
- Suivre erreurs, performance mobile, disponibilité, coût d’hébergement et couverture du catalogue.

**Sortie attendue :** programme de portage continu et procédure maintenable par une communauté.

## 11. Critères d’acceptation

### Version publique sans compte

- Le corpus MVP issu de l'archive 6e est accessible depuis une application ; la navigation peut s'étendre aux cinq niveaux du primaire et aux niveaux 5e à 2nde sans refonte du catalogue.
- Les profils de difficulté sont proposés séparément de la classe de provenance de l'activité lorsqu'ils s'appliquent.
- Les modes Entraînement et Évaluation respectent leurs règles d'outils, d'aide et de chronométrage.
- Chaque exercice affiche à la fin son score et, lorsque le barème le prévoit, l'appréciation du taux de réussite.
- Les exercices portés sont identifiés sans ambiguïté ; les exercices non portés ne donnent pas l’impression d’être disponibles.
- Chaque exercice publié possède une fiche de comportement, une attribution/licence vérifiée et une validation pédagogique.
- Les interactions principales fonctionnent au clavier et sur écran tactile.
- Les exercices publics ne requièrent pas de compte et ne bloquent pas sur une panne de Supabase.
- Un déploiement de prévisualisation et un déploiement de production sont distingués.
- La page et le parcours d’exercice ont été vérifiés sur au moins un téléphone modeste et une connexion limitée.
- La licence GPL d’origine, les auteurs et les modifications du fork sont documentés dans le dépôt et dans l’application.

### Pilote avec comptes et tableaux de bord

- Aucun secret serveur n’est inclus dans les bundles du navigateur ; les données privées sont protégées par RLS.
- Les comptes professeur peuvent créer et gérer les comptes élèves de leurs classes par une procédure sécurisée.
- Le tableau de bord professeur montre les classes qui lui appartiennent, les travaux attribués et les progrès de ses élèves.
- Le tableau de bord élève ne révèle que ses propres données ; ses progrès sont conservés après déconnexion et reconnexion.
- Les résultats permettent de situer l'élève sur les activités ou notions réalisées et de suivre son évolution ; les modes, scores, taux et durées d'évaluation utiles sont distingués.
- Le tableau de bord valide un niveau de savoir-faire Mathenpoche pour un profil d'études seulement après une tentative complète avec au moins 80 % de réussite ; une évaluation terminée par expiration reste non validée. Les jeux contextualisés ont un suivi distinct et aucun seuil prédéfini.
- Le catalogue adapte la progression par notion et niveau d'études : jeu TSD de conceptualisation au CP, exercices Mathenpoche d'extension des nombres pour les niveaux avancés, puis jeu contextualisé selon un autre modèle. Les résultats procéduraux et les observations en contexte sont distingués.
- Les autorisations ont été vérifiées avec des comptes de test couvrant plusieurs professeurs, plusieurs classes et plusieurs élèves.
- Une procédure de sauvegarde et une restauration de Supabase ont été démontrées avant le suivi réel d’élèves.

## 12. Principaux risques et réponses prévues

| Risque | Réponse prévue |
| --- | --- |
| Les sources FLA sont anciennes, binaires ou incomplètes | Inventorier les dépendances et utiliser SWF, sources, pages historiques et observation du comportement comme preuves complémentaires. |
| Des exercices dépendent de bibliothèques Flash communes | Identifier les moteurs et ressources mutualisés avant de fixer les familles de portage. |
| Réécriture trop coûteuse pour tout le catalogue | Publier par étapes, prioriser les exercices utiles et mesurer le coût d’un portage représentatif. |
| Erreur pédagogique dans une conversion automatique | Revue professorale et vérification des réponses attendues pour chaque exercice publié. |
| Réseau lent ou téléphone peu puissant | Catalogue statique, médias optimisés, interactions locales et tests sur appareils/réseaux représentatifs. |
| Données de mineurs ou de classes exposées | Comptes facultatifs pour accéder aux exercices, pseudonymisation, minimisation, RLS vérifiée par rôle/classe, durées de conservation explicites et revue de confidentialité avant collecte. |
| Panne ou perte du Supabase autohébergé | Sauvegardes vers un stockage séparé, supervision, mises à jour planifiées et restauration périodiquement testée. |
| Coûts d’infrastructure | Suivi mensuel et alertes ; séparer la gratuité d’usage de la prise en charge des coûts d’hébergement. |
| Dépendance Vercel–Coolify éloignée | Mesurer les temps de réponse depuis les pays ciblés et placer les fonctions au plus près de la base, ou réduire les requêtes synchrones. |

## 13. Décisions à prendre avant l’implémentation des comptes et tableaux de bord

1. Détailler le calendrier d'intégration des cinq niveaux du primaire et des niveaux 5e à 2nde après le MVP issu de l'archive 6e.
2. Valider avec les enseignants les profils de difficulté pour les activités concernées et les règles d'adaptation.
3. Décider si les comptes et tableaux de bord sont inclus dans le MVP public ou livrés dans une version pilote distincte ; leur objectif est de conserver les résultats authentifiés et de montrer le positionnement de l'élève.
4. Préciser si le mode hors connexion est une exigence de lancement ou une étape ultérieure.
5. Définir le pays et le serveur Coolify envisagés, le budget et la personne responsable des mises à jour et sauvegardes ; rattacher et vérifier le domaine `rallye-maths.ceredis.net` auprès de Vercel.
6. Définir les champs minimaux des comptes élèves, le mode de création/remise des identifiants, les règles de récupération et la procédure de consentement/autorisation adaptée aux établissements et pays pilotes.
7. Vérifier les règles de confidentialité et les durées de conservation des données de progrès avant le pilote.
8. Vérifier la licence exacte de chaque corpus et composant réutilisé, ainsi que les obligations de redistribution du fork.
9. Concevoir avec des enseignants le jeu TSD de conceptualisation initiale pour le CP et le jeu immersif contextualisé pour les niveaux plus avancés ; observer les actions des élèves avant de définir les modalités d'évaluation du second jeu.

Les règles du premier exercice, y compris ses profils de difficulté et les points à faire valider pédagogiquement, sont détaillées dans [`PILOTE-6E-CHAP1-SERIE1-EXO2.md`](PILOTE-6E-CHAP1-SERIE1-EXO2.md).

## 14. Références techniques à revalider au moment du déploiement

- [Documentation Next.js — déploiement](https://nextjs.org/docs/app/getting-started/deploying)
- [Documentation Supabase — auto-hébergement](https://supabase.com/docs/guides/self-hosting)
- [Documentation Coolify — Supabase](https://coolify.io/docs/services/supabase)
- [Documentation Coolify — sauvegardes](https://coolify.io/docs/databases/backups)
- [Documentation Vercel — régions](https://vercel.com/docs/regions)
- [Archive Mathenpoche et licence annoncée](https://archives.mathenpoche.sesamath.net/index.php?page=220)

## 15. Références pédagogiques

Les principes et le parcours en deux familles sont détaillés dans [`STRATEGIE-PEDAGOGIQUE.md`](STRATEGIE-PEDAGOGIQUE.md). La conception des jeux est inspirée de la TSD, sans supposer qu'un jeu suffit à constituer une situation didactique :

- [Guy Brousseau, *La théorie des situations didactiques — Le cours de Montréal, 1997*](https://ardm.eu/guy-brousseau/guy-brousseau.com/1694/la-theorie-des-situations-didactiques-le-cours-de-montreal-1997/index.html)
- [Guy Brousseau, *Le contrat didactique : le milieu*, Recherches en didactique des mathématiques](https://revue-rdm.com/1988/le-contrat-didactique-le-milieu/)

