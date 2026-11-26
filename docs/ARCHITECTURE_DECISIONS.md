# Décisions d'architecture — journal initial

| ID | Décision | Motif / portée | État |
| --- | --- | --- | --- |
| ADR-001 | Créer le fork dans un dépôt local distinct de l'installation existante. | Garder le site Apache/Ruffle et ses conteneurs intacts pendant le portage. Le dépôt local sera publiable sur GitHub après revue. | Adoptée |
| ADR-002 | Ne pas versionner les ZIP sources et SWF dans Git. | Les originaux sont sauvegardés à côté du dépôt ; le manifeste versionné assure traçabilité et détection de modification sans gonfler le dépôt. | Adoptée |
| ADR-003 | Utiliser Next.js, TypeScript et App Router pour l'application ; déployer sur Vercel. | Choix demandé par le porteur du projet. La décision d'architecture n'impose pas encore de bibliothèques de rendu d'exercices. | Adoptée |
| ADR-004 | Utiliser Supabase sur Coolify pour l'authentification et le suivi, en gardant le catalogue d'exercices versionné dans Git. | Les exercices publics restent utilisables sans compte et sans requête à la base. Supabase conserve les classes, comptes, affectations et progrès nécessaires aux tableaux de bord. | Adoptée |
| ADR-005 | Prévoir deux parcours d'usage : accès anonyme avec progression locale facultative, et comptes professeur/élève avec progression synchronisée. | Le professeur pourra gérer les comptes de ses élèves ; chaque tableau de bord est limité aux données permises par le rôle et la classe. Les détails d'identifiants et de permissions seront définis avant le pilote. | Adoptée |
| ADR-006 | Porter les exercices par étapes après inventaire de leurs dépendances et spécification de leur comportement. | Les archives contiennent des sources FLA, des SWF, des pages et des ressources mutualisées ; une conversion globale automatique n'est pas un critère réaliste. | Adoptée |
| ADR-007 | Reporter le choix final de licence du nouveau dépôt jusqu'à la vérification des avis de licence dans les archives et de la version GPL applicable. | La page d'archives annonce GPL sans préciser sur la page la version. Les textes et ressources réutilisés doivent être vérifiés avant publication. | À confirmer |
| ADR-008 | Utiliser Ruffle comme outil de consultation comparative de l'installation historique pendant le portage, pas comme implémentation finale des exercices migrés. | Le but du fork est de remplacer progressivement les SWF par des interactions HTML5. | Adoptée |
| ADR-009 | Le premier portage fonctionnel ciblé est le n° 2 de Numérique, chapitre 1, série 1 en 6e. | L'enseignant l'a choisi comme exercice pilote et a fourni ses règles pédagogiques ainsi que des captures d'écran. Le périmètre est l'exercice 2, pas toute la série. | Adoptée |

## Décisions restant à prendre

- Le dépôt public GitHub `fremar64/fork-mathenpoche` est créé et prêt à recevoir la branche locale `main`.
- Version exacte de la licence GPL et avis propres aux ressources/logiciels embarqués.
- Répartition du catalogue entre JSON/TypeScript/Markdown après étude des métadonnées historiques.
- Familles d'exercices et bibliothèques graphiques après portage de quelques exemples.
- Calendrier de livraison des comptes et tableaux de bord par rapport au MVP public.
- Emplacement Coolify, domaine, budget, sauvegarde externe et responsable de l'exploitation.
- Données minimales de suivi, conservation et règles de gestion des comptes élèves pour les pays pilotes.
