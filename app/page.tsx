import Image from 'next/image'
import Link from 'next/link'
import { CeredisFooter } from '@/components/CeredisFooter'
import { SpatialBackdrop } from '@/components/SpatialBackdrop'
import { SponsorCarousel } from '@/components/SponsorCarousel'
import { getChildren, getDescendantActivities, getDomains } from '@/content/learning-graph'

export default function HomePage() {
  return (
    <>
      <main className="home-page">
        <div className="home-intro">
          <SpatialBackdrop />
          <div className="site-shell home-shell">
            <header className="topbar brand-header">
              <Link className="brand-logo" href="/" aria-label="Rallye Maths, accueil">
                <Image src="/img/logo.png" alt="CEREDIS" width={210} height={51} preload />
              </Link>
              <p className="institution-title">Centre de Ressources Didactiques et d’Innovation Scolaire</p>
              <div className="header-sponsors">
                <SponsorCarousel />
                <span className="free-note">Gratuit · sans compte obligatoire</span>
              </div>
            </header>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">RALLYE-MATHS · APPRENDRE EN FAISANT</p>
                <h1>Des idées claires,<br /><span>des nombres qui prennent sens.</span></h1>
                <p className="hero-lede">Choisis un domaine, suis un parcours et entraîne-toi à ton rythme.</p>
                <a className="button button-primary" href="#parcours">
                  Explorer les parcours <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="hero-art">
                <picture className="hero-photo">
                  <source srcSet="/img/ecoliers-africains.webp" type="image/webp" />
                  <Image
                    src="/img/ecoliers-africains.png"
                    alt="Des élèves réunis devant un ordinateur"
                    width={1133}
                    height={1388}
                    unoptimized
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </section>
          </div>
        </div>

        <section className="site-shell pathways-section" id="parcours">
          <div className="section-heading">
            <div><p className="eyebrow">CHOISIS TON PARCOURS</p><h2>Explore les mathématiques</h2></div>
            <p>Des activités reliées entre elles pour construire tes connaissances et les réutiliser.</p>
          </div>
          <div className="domain-grid">
            {getDomains().map((domain) => {
              const isAvailable = getDescendantActivities(domain.id).some((activity) => activity.status === 'available')
              const badge = isAvailable ? `${getChildren(domain.id).length} sous-parcours` : 'À venir'
              return (
                <Link
                  className={`nav-card domain-card accent-${domain.accent}${isAvailable ? ' domain-card-available' : ' domain-card-upcoming'}`}
                  href={`/parcours/${domain.slug}`}
                  key={domain.id}
                >
                  <div className="card-top">
                    <span className="card-icon" aria-hidden="true">{domain.icon}</span>
                    <span className="status-pill">{badge}</span>
                  </div>
                  <h3>{domain.title}</h3>
                  <p>{domain.description}</p>
                  <span className="card-action">Découvrir <span aria-hidden="true">↗</span></span>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <CeredisFooter />
    </>
  )
}
