import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rallye Maths — apprendre les mathématiques',
  description: 'Des parcours et exercices de mathématiques gratuits pour les élèves francophones.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
