import Image from 'next/image'

const sponsorPlaceholders = [
  '/img/logo1.png',
  '/img/logo3.png',
  '/img/logo4.png',
  '/img/logo5.png',
  '/img/logo6.png',
  '/img/logo7.png',
]

/** Quiet, CSS-only crossfade for the circular sponsor placeholders. */
export function SponsorCarousel() {
  return <div className="sponsor-carousel" role="img" aria-label="Emplacements réservés aux logos des sponsors">
    {sponsorPlaceholders.map((src, index) => <div
      className="sponsor-slide"
      key={src}
      style={{ animationDelay: `${index * 6 - 1.3}s` }}
      aria-hidden="true"
    >
      <Image src={src} alt="" fill sizes="68px" />
    </div>)}
  </div>
}
