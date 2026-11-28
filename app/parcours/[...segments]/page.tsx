import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getChildren, getDescendantActivities, getDomains, type LearningNode } from '@/content/learning-graph'

type Props = { params: Promise<{ segments: string[] }> }

function findRouteNodes(segments: string[]) {
  const nodes: LearningNode[] = []
  let candidates = getDomains()
  for (const slug of segments) {
    const node = candidates.find((item) => item.slug === slug)
    if (!node) return null
    nodes.push(node)
    candidates = getChildren(node.id)
  }
  return nodes
}

function backLabel(parent?: LearningNode) {
  if (!parent) return '← Retour à l’accueil'
  return `← Retour à ${parent.title}`
}

function Card({ node, href, badge }: { node: LearningNode; href: string; badge?: string }) {
  const count = getDescendantActivities(node.id).filter((activity) => activity.status === 'available').length
  return <Link className={`nav-card content-card accent-${node.accent}`} href={href}>
    <div className="card-top"><span className="card-icon" aria-hidden="true">{node.icon ?? (node.kind === 'pathway' ? '✳' : '↗')}</span><span className="status-pill">{badge ?? (count ? `${count} activité${count > 1 ? 's' : ''}` : 'À venir')}</span></div>
    <h2>{node.title}</h2><p>{node.description}</p><span className="card-action">Explorer <span aria-hidden="true">↗</span></span>
  </Link>
}

export default async function LearningRoute({ params }: Props) {
  const { segments } = await params
  const nodes = findRouteNodes(segments)
  if (!nodes || nodes.length < 1 || nodes.length > 3) notFound()
  const current = nodes.at(-1)!
  const parent = nodes.at(-2)
  const children = getChildren(current.id)
  const isDomain = current.kind === 'domain'
  const isPathway = current.kind === 'pathway'
  const isFamily = current.kind === 'family'
  const sectionTitle = isDomain ? 'CHOISIS UN SOUS-PARCOURS' : isPathway ? 'QUE VEUX-TU FAIRE ?' : 'ACTIVITÉS'
  const familyIntro = isPathway
  const parentHref = nodes.length === 1 ? '/' : `/parcours/${segments.slice(0, -1).join('/')}`

  return <main className="site-shell inner-shell">
    <Link className="context-back" href={parentHref}>{backLabel(parent)}</Link>
    <header className="view-heading">
      <span className={`view-icon accent-${current.accent}`} aria-hidden="true">{current.icon ?? '✳'}</span>
      <div><p className="eyebrow">{isDomain ? 'PARCOURS D’APPRENTISSAGE' : isPathway ? 'SOUS-PARCOURS' : 'FAMILLE D’ACTIVITÉS'}</p><h1>{current.title}</h1><p>{current.description}</p></div>
    </header>
    {current.gradeProfiles && <div className="grade-chips" aria-label="Niveaux concernés">{current.gradeProfiles.map((grade) => <span key={grade}>{grade}</span>)}</div>}
    <section className="content-section">
      <p className="eyebrow">{sectionTitle}</p>
      {familyIntro && <p className="family-lede">Commence par explorer une situation, puis entraîne-toi à mobiliser les savoir-faire.</p>}
      <div className={`content-grid ${familyIntro ? 'family-grid' : ''}`}>
        {children.map((child) => {
          if (child.kind === 'activity') {
            const returnPath = `/parcours/${segments.join('/')}`
            const href = child.status === 'available' && child.href ? `${child.href}?returnTo=${encodeURIComponent(returnPath)}` : '#'
            return <article className={`nav-card activity-card accent-${child.accent} ${child.status === 'planned' ? 'planned-card' : ''}`} key={child.id}>
              <div className="card-top"><span className="card-icon" aria-hidden="true">{child.id.includes('brousseau') ? '🧩' : '✦'}</span><span className="status-pill">{child.status === 'available' ? 'Disponible' : 'Bientôt disponible'}</span></div>
              <h2>{child.title}</h2><p>{child.description}</p>
              {child.status === 'available' && child.href ? <Link className="card-action" href={href}>Choisir les réglages <span aria-hidden="true">↗</span></Link> : <span className="card-action muted-action">En préparation</span>}
            </article>
          }
          const href = `/parcours/${segments.join('/')}/${child.slug}`
          const badge = isPathway ? (child.id.includes('problems') ? 'CONCEPTUALISER · RÉINVESTIR' : 'SAVOIR-FAIRE') : undefined
          return <Card key={child.id} node={child} href={href} badge={badge} />
        })}
      </div>
      {isFamily && children.length === 0 && <p className="empty-note">Les activités de cette famille seront ajoutées progressivement.</p>}
    </section>
  </main>
}
