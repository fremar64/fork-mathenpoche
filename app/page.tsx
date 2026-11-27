import Link from 'next/link'
import { getChildren, learningDomains } from '@/content/learning-graph'

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Rallye Maths, accueil">
          <span className="wordmark-mark">R</span>
          <span>Rallye Maths</span>
        </Link>
        <span className="free-note">Gratuit · sans compte obligatoire</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Apprendre les mathématiques en faisant</p>
          <h1>Des idées claires,<br />des nombres qui prennent sens.</h1>
          <p className="hero-lede">Choisis un domaine, suis un parcours et entraîne-toi à ton rythme.</p>
          <a className="button button-primary" href="#parcours">Découvrir les parcours <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-sun" />
          <div className="number-card number-card-one">4 207</div>
          <div className="number-card number-card-two">+ 38</div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <span className="hero-spark spark-one">✳</span>
          <span className="hero-spark spark-two">✳</span>
        </div>
      </section>

      <section className="pathways-section" id="parcours">
        <div className="section-heading">
          <div><p className="eyebrow">Explorer</p><h2>Parcours d’apprentissage</h2></div>
          <p>Les activités se relient aux notions et aux savoir-faire qu’elles aident à construire.</p>
        </div>
        <div className="domain-grid">
          {learningDomains.map((domain, index) => {
            const children = getChildren(domain.id)
            return (
              <article className={`domain-card domain-card-${index + 1}`} key={domain.id}>
                <div className="domain-card-top">
                  <span className="domain-icon" aria-hidden="true">{['01', '02', '03', '04'][index]}</span>
                  <span className={`status-pill ${domain.status}`}>{domain.status === 'available' ? 'En ligne' : 'À venir'}</span>
                </div>
                <h3>{domain.title}</h3>
                <p>{domain.description}</p>
                <div className="path-list">
                  {children.map((pathway) => {
                    const pathwayChildren = getChildren(pathway.id)
                    const activities = pathwayChildren.filter((child) => child.kind === 'activity')
                    const nestedPathways = pathwayChildren.filter((child) => child.kind === 'pathway')
                    return (
                      <div className="path-row" key={pathway.id}>
                        <div>
                          <strong>{pathway.title}</strong>
                          {nestedPathways.map((nestedPathway) => (
                            <span className="related-path" key={nestedPathway.id}>Poursuivre vers {nestedPathway.title}</span>
                          ))}
                          {activities.map((activity) => (
                            <Link className="activity-link" href={activity.href ?? '#'} key={activity.id}>
                              {activity.title}<span aria-hidden="true">↗</span>
                            </Link>
                          ))}
                        </div>
                        <span className={`mini-status ${pathway.status}`} aria-label={pathway.status === 'available' ? 'Disponible' : 'Prévu'}>
                          {pathway.status === 'available' ? '●' : '○'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="site-footer"><span>Rallye Maths</span><span>Un projet éducatif gratuit pour les élèves et les enseignants francophones.</span></footer>
    </main>
  )
}
