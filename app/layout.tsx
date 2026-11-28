import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteDock } from '@/components/SiteDock'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rallye Maths — apprendre les mathématiques',
  description: 'Des parcours et exercices de mathématiques gratuits pour les élèves francophones.',
  icons: { icon: '/img/favicon.png' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}<SiteDock /></body>
    </html>
  )
}
