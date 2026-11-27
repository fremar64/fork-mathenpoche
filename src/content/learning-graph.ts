export type LearningNodeKind = 'domain' | 'pathway' | 'activity'
export type LearningRelation = 'contains' | 'practices' | 'prepares' | 'reinvests'

export interface LearningNode {
  id: string
  kind: LearningNodeKind
  title: string
  description: string
  status: 'available' | 'planned'
  href?: string
  gradeProfiles?: string[]
  source?: string
}

export interface LearningEdge {
  from: string
  to: string
  relation: LearningRelation
}

/**
 * Curriculum graph kept in source control. It describes domains, pathways and
 * activities; adaptive recommendations can be added without making the public
 * catalogue depend on an account or database.
 */
export const learningNodes: LearningNode[] = [
  { id: 'domain:numeration', kind: 'domain', title: 'Numération', description: 'Lire, écrire et représenter les nombres.', status: 'available' },
  { id: 'path:natural-numbers', kind: 'pathway', title: 'Nombres entiers naturels', description: 'Comprendre les nombres entiers et leur écriture de position.', status: 'available' },
  {
    id: 'activity:place-value',
    kind: 'activity',
    title: 'Quel est le chiffre des… ?',
    description: 'Identifier le chiffre correspondant à une position dans un nombre entier.',
    status: 'available',
    href: '/activites/valeur-position',
    gradeProfiles: ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e'],
    source: 'Mathenpoche 6e · Numérique · Chapitre 1 · Série 1 · Exercice 2',
  },
  { id: 'path:decimals', kind: 'pathway', title: 'Nombres décimaux', description: 'Comprendre les écritures décimales et leurs usages.', status: 'planned' },
  { id: 'path:rationals', kind: 'pathway', title: 'Fractions et nombres rationnels', description: 'Étendre les écritures des nombres aux fractions et aux rationnels.', status: 'planned' },
  { id: 'domain:calculation', kind: 'domain', title: 'Calcul', description: 'Choisir et maîtriser des procédures de calcul.', status: 'planned' },
  { id: 'path:additive', kind: 'pathway', title: 'Structures additives', description: 'Résoudre des situations d’addition et de soustraction.', status: 'planned' },
  { id: 'path:multiplicative', kind: 'pathway', title: 'Structures multiplicatives', description: 'Résoudre des situations de multiplication et de division.', status: 'planned' },
  { id: 'domain:geometry', kind: 'domain', title: 'Géométrie', description: 'Étudier les figures, les relations et l’espace.', status: 'planned' },
  { id: 'path:geometry-basics', kind: 'pathway', title: 'Figures et relations géométriques', description: 'Figures planes, solides, alignement, parallélisme et angles.', status: 'planned' },
  { id: 'domain:data', kind: 'domain', title: 'Gestion des données', description: 'Organiser, lire et interpréter des données.', status: 'planned' },
  { id: 'path:statistics', kind: 'pathway', title: 'Statistiques élémentaires', description: 'Lire des tableaux et représentations de données.', status: 'planned' },
]

export const learningEdges: LearningEdge[] = [
  { from: 'domain:numeration', to: 'path:natural-numbers', relation: 'contains' },
  { from: 'path:natural-numbers', to: 'activity:place-value', relation: 'practices' },
  { from: 'domain:numeration', to: 'path:decimals', relation: 'contains' },
  { from: 'path:decimals', to: 'path:rationals', relation: 'prepares' },
  { from: 'domain:calculation', to: 'path:additive', relation: 'contains' },
  { from: 'domain:calculation', to: 'path:multiplicative', relation: 'contains' },
  { from: 'domain:geometry', to: 'path:geometry-basics', relation: 'contains' },
  { from: 'domain:data', to: 'path:statistics', relation: 'contains' },
]

export const getChildren = (parentId: string) => {
  const childIds = learningEdges.filter((edge) => edge.from === parentId).map((edge) => edge.to)
  return childIds.map((id) => learningNodes.find((node) => node.id === id)).filter((node): node is LearningNode => Boolean(node))
}

export const learningDomains = learningNodes.filter((node) => node.kind === 'domain')
