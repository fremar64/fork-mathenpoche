import { ValuePositionExercise } from '@/activities/valeur-position/ValuePositionExercise'

type Props = { searchParams: Promise<{ returnTo?: string }> }

export default async function ValuePositionPage({ searchParams }: Props) {
  const { returnTo } = await searchParams
  const returnHref = returnTo?.startsWith('/parcours/') && !returnTo.startsWith('//')
    ? returnTo
    : '/parcours/numeration/nombres-entiers-naturels/entrainement'
  return <ValuePositionExercise returnHref={returnHref} />
}
