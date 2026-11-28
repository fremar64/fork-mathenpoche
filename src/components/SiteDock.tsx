'use client'

import type { PointerEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getDomains } from '@/content/learning-graph'

const dockItems = [
  { href: '/', label: 'Accueil', icon: '🏠', theme: 'dock-home' },
  ...getDomains().map((domain) => ({
    href: `/parcours/${domain.slug}`,
    label: domain.title,
    icon: domain.icon,
    theme: `accent-${domain.accent}`,
  })),
]

function magnifyIcons(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return
  const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('.dock-link'))
  const scales = links.map((link) => {
    const rect = link.getBoundingClientRect()
    const distance = Math.abs(event.clientX - (rect.left + rect.width / 2))
    return 1 + 0.48 * Math.max(0, 1 - distance / 100) ** 2
  })
  links.forEach((link, index) => link.style.setProperty('--dock-scale', String(scales[index])))
}

function resetIcons(event: PointerEvent<HTMLElement>) {
  event.currentTarget.querySelectorAll<HTMLAnchorElement>('.dock-link')
    .forEach((link) => link.style.removeProperty('--dock-scale'))
}

export function SiteDock() {
  const pathname = usePathname()

  return (
    <nav className="site-dock" aria-label="Navigation principale" onPointerMove={magnifyIcons} onPointerLeave={resetIcons}>
      {dockItems.map(({ href, label, icon, theme }) => {
        const currentPage = pathname === href
        const active = currentPage || pathname.startsWith(`${href}/`)
        return (
          <Link
            className={`dock-link ${theme}${active ? ' active' : ''}`}
            href={href}
            key={href}
            aria-label={label}
            aria-current={currentPage ? 'page' : active ? 'location' : undefined}
          >
            <span className="dock-icon" aria-hidden="true">{icon}</span>
            <span className="dock-tooltip" aria-hidden="true">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
