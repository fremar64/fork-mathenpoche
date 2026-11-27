export const placeRanks = [
  { index: 0, name: 'unités', group: 'UNITÉS', shortName: 'unités' },
  { index: 1, name: 'dizaines', group: 'UNITÉS', shortName: 'dizaines' },
  { index: 2, name: 'centaines', group: 'UNITÉS', shortName: 'centaines' },
  { index: 3, name: 'unités de mille', group: 'MILLE', shortName: 'unités' },
  { index: 4, name: 'dizaines de mille', group: 'MILLE', shortName: 'dizaines' },
  { index: 5, name: 'centaines de mille', group: 'MILLE', shortName: 'centaines' },
  { index: 6, name: 'unités de millions', group: 'MILLIONS', shortName: 'unités' },
  { index: 7, name: 'dizaines de millions', group: 'MILLIONS', shortName: 'dizaines' },
  { index: 8, name: 'centaines de millions', group: 'MILLIONS', shortName: 'centaines' },
  { index: 9, name: 'unités de milliards', group: 'MILLIARDS', shortName: 'unités' },
  { index: 10, name: 'dizaines de milliards', group: 'MILLIARDS', shortName: 'dizaines' },
  { index: 11, name: 'centaines de milliards', group: 'MILLIARDS', shortName: 'centaines' },
] as const

export type RankType = (typeof placeRanks)[number]['index']
export type NumerationGroup = 'MILLIARDS' | 'MILLIONS' | 'MILLE' | 'UNITÉS'
export type CellHighlight = 'none' | 'group' | 'rank' | 'answer'

export interface NumerationHelpCell {
  position: RankType
  digit: string | null
  visible: boolean
  highlight: CellHighlight
}

export interface HelpStep {
  id: string
  prompt: string
  explanation: string
  visibleDigitCount: number
  newlyPlacedRank: RankType | null
  focusedRank: RankType | null
  revealAnswer: boolean
  cells: NumerationHelpCell[]
}

const rankFor = (position: number) => placeRanks[position as RankType]

export function generateHelpSteps(numberValue: number, targetRank: RankType): HelpStep[] {
  if (!Number.isSafeInteger(numberValue) || numberValue < 0) {
    throw new RangeError('Le nombre à expliquer doit être un entier naturel sûr.')
  }

  const target = rankFor(targetRank)
  if (!target) throw new RangeError(`Rang de numération inconnu : ${targetRank}.`)

  const digits = String(numberValue).split('').reverse()
  const expectedDigit = digits[targetRank] ?? '0'
  const buildCells = (visibleDigitCount: number, focusedRank: RankType | null, revealAnswer: boolean) =>
    placeRanks.slice().reverse().map((rank) => {
      const visible = rank.index < visibleDigitCount
      const isAnswer = revealAnswer && rank.index === targetRank
      const isTargetRank = focusedRank !== null && rank.index === focusedRank
      const isTargetGroup = focusedRank !== null && rank.group === target.group

      return {
        position: rank.index,
        digit: visible ? digits[rank.index] ?? null : isAnswer ? '0' : null,
        visible: visible || isAnswer,
        highlight: isAnswer ? 'answer' : isTargetRank ? 'rank' : isTargetGroup ? 'group' : 'none',
      } satisfies NumerationHelpCell
    })

  const steps: HelpStep[] = [{
    id: 'start',
    prompt: `On place le nombre ${numberValue.toLocaleString('fr-FR')} dans le tableau.`,
    explanation: 'On commence par le chiffre le plus à droite : celui des unités.',
    visibleDigitCount: 0,
    newlyPlacedRank: null,
    focusedRank: null,
    revealAnswer: false,
    cells: buildCells(0, null, false),
  }]

  for (let visibleDigitCount = 1; visibleDigitCount <= digits.length; visibleDigitCount += 1) {
    const newlyPlacedRank = (visibleDigitCount - 1) as RankType
    const place = rankFor(newlyPlacedRank)
    const isLastDigit = visibleDigitCount === digits.length

    steps.push({
      id: `place-${newlyPlacedRank}`,
      prompt: `On place le nombre ${numberValue.toLocaleString('fr-FR')} dans le tableau.`,
      explanation: isLastDigit
        ? 'On place ensuite les autres chiffres, toujours de droite à gauche.'
        : `Le chiffre ${digits[newlyPlacedRank]} occupe la colonne des ${place.name}.`,
      visibleDigitCount,
      newlyPlacedRank,
      focusedRank: null,
      revealAnswer: false,
      cells: buildCells(visibleDigitCount, null, false),
    })
  }

  steps.push({
    id: 'answer',
    prompt: `Quel est le chiffre des ${target.name} dans ${numberValue.toLocaleString('fr-FR')} ?`,
    explanation: `Le chiffre des ${target.name} est ${expectedDigit}.`,
    visibleDigitCount: digits.length,
    newlyPlacedRank: null,
    focusedRank: targetRank,
    revealAnswer: true,
    cells: buildCells(digits.length, targetRank, true),
  })

  return steps
}
