export type LearningNodeKind = 'domain' | 'pathway' | 'family' | 'activity'
export type LearningRelation = 'contains' | 'practices' | 'prepares' | 'reinvests'
export type LearningStatus = 'available' | 'planned'
export type LearningAccent = 'numeration' | 'calculation' | 'geometry' | 'data'

export interface LearningNode {
  id: string
  slug: string
  kind: LearningNodeKind
  title: string
  description: string
  status: LearningStatus
  accent: LearningAccent
  icon?: string
  href?: string
  gradeProfiles?: string[]
  source?: string
}

export interface LearningEdge {
  from: string
  to: string
  relation: LearningRelation
}

/** Le graphe versionné décrit toute la navigation, des domaines jusqu'aux activités. */
export const learningNodes: LearningNode[] = [
  { id: 'domain:numeration', slug: 'numeration', kind: 'domain', title: 'Numération', description: 'Lire, écrire et représenter les nombres, et utiliser ces connaissances pour résoudre des problèmes de la vie courante.', status: 'available', accent: 'numeration', icon: '▦' },
  { id: 'domain:calculation', slug: 'calcul', kind: 'domain', title: 'Calcul', description: 'Maîtriser les techniques de calcul et résoudre des problèmes concrets en choisissant les bonnes opérations et leurs étapes.', status: 'planned', accent: 'calculation', icon: '＋' },
  { id: 'domain:geometry', slug: 'geometrie', kind: 'domain', title: 'Géométrie', description: 'Connaître les figures géométriques, leurs caractéristiques et leurs mesures, et utiliser ces connaissances pour reconnaître les formes des objets réels et résoudre des problèmes de la vie quotidienne.', status: 'planned', accent: 'geometry', icon: '△' },
  { id: 'domain:data', slug: 'donnees', kind: 'domain', title: 'Gestion des données', description: 'Organiser, lire et interpréter des tableaux ou graphiques pour analyser des situations réelles et résoudre des problèmes.', status: 'planned', accent: 'data', icon: '▥' },

  { id: 'path:natural-numbers', slug: 'nombres-entiers-naturels', kind: 'pathway', title: 'Nombres entiers naturels', description: 'Comprendre les nombres entiers et leur écriture de position.', status: 'available', accent: 'numeration', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:decimals', slug: 'nombres-decimaux', kind: 'pathway', title: 'Nombres décimaux', description: 'Lire, comparer et représenter les nombres décimaux.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:rationals', slug: 'fractions', kind: 'pathway', title: 'Fractions', description: 'Comprendre les fractions et étendre le domaine des nombres rationnels.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:additive', slug: 'structures-additives', kind: 'pathway', title: 'Structures additives', description: 'Résoudre des situations d’addition et de soustraction.', status: 'planned', accent: 'calculation', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:multiplicative', slug: 'structures-multiplicatives', kind: 'pathway', title: 'Structures multiplicatives', description: 'Résoudre des situations de multiplication et de division.', status: 'planned', accent: 'calculation', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:geometry-basics', slug: 'figures-et-relations', kind: 'pathway', title: 'Figures et relations géométriques', description: 'Figures planes, solides, alignement, parallélisme et angles.', status: 'planned', accent: 'geometry', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'path:statistics', slug: 'statistiques-elementaires', kind: 'pathway', title: 'Statistiques élémentaires', description: 'Lire des tableaux et interpréter des représentations de données.', status: 'planned', accent: 'data', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },

  { id: 'family:natural-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des situations-problèmes à explorer pour construire du sens et découvrir une notion mathématique (conceptualisation et réinvestissement).', status: 'planned', accent: 'numeration', icon: '🧩' },
  { id: 'family:natural-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices décontextualisés pour s’entraîner et automatiser des méthodes et des techniques mathématiques (connaissances procédurales).', status: 'available', accent: 'numeration', icon: '🎯' },
  { id: 'family:decimal-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des situations pour donner du sens aux écritures décimales et les réinvestir.', status: 'planned', accent: 'numeration', icon: '🧩' },
  { id: 'family:decimal-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour lire, comparer et calculer avec des nombres décimaux.', status: 'planned', accent: 'numeration', icon: '🎯' },
  { id: 'family:fraction-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des situations de partage et de mesure pour construire le sens des fractions.', status: 'planned', accent: 'numeration', icon: '🧩' },
  { id: 'family:fraction-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour représenter, comparer et calculer avec des fractions.', status: 'planned', accent: 'numeration', icon: '🎯' },
  { id: 'family:additive-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des situations pour modéliser des transformations et des comparaisons additives.', status: 'planned', accent: 'calculation', icon: '🧩' },
  { id: 'family:additive-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour choisir et automatiser des procédures additives.', status: 'planned', accent: 'calculation', icon: '🎯' },
  { id: 'family:multiplicative-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des situations de groupement, de partage et de proportionnalité.', status: 'planned', accent: 'calculation', icon: '🧩' },
  { id: 'family:multiplicative-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour automatiser les faits numériques et les procédures multiplicatives.', status: 'planned', accent: 'calculation', icon: '🎯' },
  { id: 'family:geometry-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des défis de construction et de raisonnement dans l’espace et le plan.', status: 'planned', accent: 'geometry', icon: '🧩' },
  { id: 'family:geometry-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour reconnaître, tracer et décrire des figures.', status: 'planned', accent: 'geometry', icon: '🎯' },
  { id: 'family:data-problems', slug: 'resolution-problemes', kind: 'family', title: 'Résolution de problèmes', description: 'Des enquêtes pour recueillir et interpréter des données.', status: 'planned', accent: 'data', icon: '🧩' },
  { id: 'family:data-practice', slug: 'entrainement', kind: 'family', title: 'Entraînement aux savoir-faire', description: 'Des exercices pour lire des tableaux et des représentations statistiques.', status: 'planned', accent: 'data', icon: '🎯' },

  { id: 'activity:brousseau-counting', slug: 'jeu-du-denombrement', kind: 'activity', title: 'Le jeu du dénombrement', description: 'Une situation de comptage pour construire les premiers nombres au CP.', status: 'planned', accent: 'numeration', gradeProfiles: ['CP'] },
  { id: 'activity:place-value', slug: 'valeur-position', kind: 'activity', title: 'Quel est le chiffre des… ?', description: 'Identifie la valeur de position des chiffres dans l’écriture d’un nombre entier à l’aide d’un tableau de numération, avec des niveaux gradués du CP à la 6e.', status: 'available', accent: 'numeration', href: '/activites/valeur-position', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'], source: 'Mathenpoche 6e · Numérique · Chapitre 1 · Série 1 · Exercice 2' },
  { id: 'activity:decompose-numbers', slug: 'decomposition-nombres', kind: 'activity', title: 'Décompose les nombres', description: 'Décompose un nombre selon la valeur de ses chiffres.', status: 'planned', accent: 'numeration', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:order-numbers', slug: 'rangement-nombres', kind: 'activity', title: 'Range les nombres', description: 'Range des nombres dans l’ordre croissant ou décroissant.', status: 'planned', accent: 'numeration', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:write-numbers', slug: 'ecriture-chiffres', kind: 'activity', title: 'Écris le nombre en chiffres', description: 'Écoute un nombre entier dicté et écris-le en chiffres.', status: 'planned', accent: 'numeration', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:decimals-game', slug: 'jeu-nombres-decimaux', kind: 'activity', title: 'Les nombres dans le marché', description: 'Utilise les écritures décimales pour comparer des prix et des mesures.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:decimals-exercises', slug: 'exercices-nombres-decimaux', kind: 'activity', title: 'Lire et comparer les décimaux', description: 'Des exercices progressifs de numération décimale.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:fractions-game', slug: 'jeu-fractions', kind: 'activity', title: 'Le partage équitable', description: 'Résous des situations de partage à l’aide de fractions.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:fractions-exercises', slug: 'exercices-fractions', kind: 'activity', title: 'Représenter des fractions', description: 'Des exercices pour représenter et comparer les fractions.', status: 'planned', accent: 'numeration', gradeProfiles: ['CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:additive-game', slug: 'billes-additives', kind: 'activity', title: 'Billes rouges et billes bleues', description: 'Représente deux collections et écris l’égalité qui les relie.', status: 'planned', accent: 'calculation', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1'] },
  { id: 'activity:additive-exercises', slug: 'exercices-additifs', kind: 'activity', title: 'Les additions posées', description: 'Entraîne-toi à choisir et à poser des calculs additifs.', status: 'planned', accent: 'calculation', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:multiplicative-game', slug: 'jeu-multiplication', kind: 'activity', title: 'La boutique des paquets', description: 'Résous des situations de groupement et de partage.', status: 'planned', accent: 'calculation', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:multiplicative-exercises', slug: 'exercices-multiplicatifs', kind: 'activity', title: 'Calculs multiplicatifs', description: 'Des exercices progressifs de multiplication et de division.', status: 'planned', accent: 'calculation', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:geometry-game', slug: 'jeu-geometrie', kind: 'activity', title: 'Explorateurs des figures', description: 'Observe et construis des figures pour résoudre des défis.', status: 'planned', accent: 'geometry', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:geometry-exercises', slug: 'exercices-geometrie', kind: 'activity', title: 'Figures et relations', description: 'Des exercices sur les formes, les angles et les relations géométriques.', status: 'planned', accent: 'geometry', gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:data-game', slug: 'jeu-enquete-donnees', kind: 'activity', title: 'L’enquête des données', description: 'Recueille et interprète des informations pour répondre à une question.', status: 'planned', accent: 'data', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
  { id: 'activity:data-exercises', slug: 'exercices-statistiques', kind: 'activity', title: 'Lire les données', description: 'Des exercices sur les tableaux et graphiques simples.', status: 'planned', accent: 'data', gradeProfiles: ['CE1', 'CE2', 'CM1', 'CM2', '6e'] },
]

export const learningEdges: LearningEdge[] = [
  { from: 'domain:numeration', to: 'path:natural-numbers', relation: 'contains' },
  { from: 'domain:numeration', to: 'path:decimals', relation: 'contains' },
  { from: 'domain:numeration', to: 'path:rationals', relation: 'contains' },
  { from: 'domain:calculation', to: 'path:additive', relation: 'contains' },
  { from: 'domain:calculation', to: 'path:multiplicative', relation: 'contains' },
  { from: 'domain:geometry', to: 'path:geometry-basics', relation: 'contains' },
  { from: 'domain:data', to: 'path:statistics', relation: 'contains' },

  { from: 'path:natural-numbers', to: 'family:natural-problems', relation: 'contains' },
  { from: 'path:natural-numbers', to: 'family:natural-practice', relation: 'contains' },
  { from: 'path:decimals', to: 'family:decimal-problems', relation: 'contains' },
  { from: 'path:decimals', to: 'family:decimal-practice', relation: 'contains' },
  { from: 'path:rationals', to: 'family:fraction-problems', relation: 'contains' },
  { from: 'path:rationals', to: 'family:fraction-practice', relation: 'contains' },
  { from: 'path:additive', to: 'family:additive-problems', relation: 'contains' },
  { from: 'path:additive', to: 'family:additive-practice', relation: 'contains' },
  { from: 'path:multiplicative', to: 'family:multiplicative-problems', relation: 'contains' },
  { from: 'path:multiplicative', to: 'family:multiplicative-practice', relation: 'contains' },
  { from: 'path:geometry-basics', to: 'family:geometry-problems', relation: 'contains' },
  { from: 'path:geometry-basics', to: 'family:geometry-practice', relation: 'contains' },
  { from: 'path:statistics', to: 'family:data-problems', relation: 'contains' },
  { from: 'path:statistics', to: 'family:data-practice', relation: 'contains' },

  { from: 'family:natural-problems', to: 'activity:brousseau-counting', relation: 'prepares' },
  { from: 'family:natural-practice', to: 'activity:place-value', relation: 'practices' },
  { from: 'family:natural-practice', to: 'activity:decompose-numbers', relation: 'practices' },
  { from: 'family:natural-practice', to: 'activity:order-numbers', relation: 'practices' },
  { from: 'family:natural-practice', to: 'activity:write-numbers', relation: 'practices' },
  { from: 'family:decimal-problems', to: 'activity:decimals-game', relation: 'reinvests' },
  { from: 'family:decimal-practice', to: 'activity:decimals-exercises', relation: 'practices' },
  { from: 'family:fraction-problems', to: 'activity:fractions-game', relation: 'reinvests' },
  { from: 'family:fraction-practice', to: 'activity:fractions-exercises', relation: 'practices' },
  { from: 'family:additive-problems', to: 'activity:additive-game', relation: 'prepares' },
  { from: 'family:additive-practice', to: 'activity:additive-exercises', relation: 'practices' },
  { from: 'family:multiplicative-problems', to: 'activity:multiplicative-game', relation: 'prepares' },
  { from: 'family:multiplicative-practice', to: 'activity:multiplicative-exercises', relation: 'practices' },
  { from: 'family:geometry-problems', to: 'activity:geometry-game', relation: 'reinvests' },
  { from: 'family:geometry-practice', to: 'activity:geometry-exercises', relation: 'practices' },
  { from: 'family:data-problems', to: 'activity:data-game', relation: 'reinvests' },
  { from: 'family:data-practice', to: 'activity:data-exercises', relation: 'practices' },
]

export const getNode = (id: string) => learningNodes.find((node) => node.id === id)

export const getChildren = (parentId: string) => learningEdges
  .filter((edge) => edge.from === parentId)
  .map((edge) => getNode(edge.to))
  .filter((node): node is LearningNode => Boolean(node))

export const getParent = (childId: string) => {
  const edge = learningEdges.find((item) => item.to === childId)
  return edge ? getNode(edge.from) : undefined
}

export const getDescendantActivities = (nodeId: string): LearningNode[] => {
  const node = getNode(nodeId)
  if (!node) return []
  if (node.kind === 'activity') return [node]
  return getChildren(nodeId).flatMap((child) => getDescendantActivities(child.id))
}

export const getDomains = () => learningNodes.filter((node) => node.kind === 'domain')
