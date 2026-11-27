export const questionCount = 10
export const passPercentage = 80

export const studyProfiles = [
  { id: 'CP', label: 'CP', maximum: 100 },
  { id: 'CE1', label: 'CE1', maximum: 1_000 },
  { id: 'CE2', label: 'CE2', maximum: 1_000_000 },
  { id: 'CM1', label: 'CM1', maximum: 1_000_000_000 },
  { id: 'CM2', label: 'CM2', maximum: 999_999_999_999 },
  { id: '6e', label: '6e', maximum: 999_999_999_999 },
] as const

export type StudyProfileId = (typeof studyProfiles)[number]['id']
export type ExerciseMode = 'training' | 'assessment'

const adaptiveCeilings = [30, 100, 1_000, 1_000_000, 1_000_000_000, 999_999_999_999]
const placeNames = [
  'unités', 'dizaines', 'centaines', 'unités de mille', 'dizaines de mille', 'centaines de mille',
  'unités de millions', 'dizaines de millions', 'centaines de millions', 'unités de milliards',
  'dizaines de milliards', 'centaines de milliards',
]

export interface ExerciseQuestion {
  number: number
  placeIndex: number
  placeName: string
  expectedDigit: number
  difficulty: number
}

export interface QuestionResult {
  number: number
  placeName: string
  expectedDigit: number
  givenDigit: number | null
  attempts: number
  points: 0 | 1
}

export interface PerformanceBand {
  label: string
  detail: string
}

export const formatNumber = (value: number) => new Intl.NumberFormat('fr-FR').format(value)

export function getMaxDifficulty(profile: StudyProfileId) {
  const maximum = studyProfiles.find((item) => item.id === profile)?.maximum ?? 100
  return Math.max(0, adaptiveCeilings.findIndex((ceiling) => ceiling >= maximum))
}

export function getTrainingDifficulty(current: number, cleanAnswer: boolean, nextStreak: number) {
  if (cleanAnswer && nextStreak >= 2) return Math.min(current + 1, adaptiveCeilings.length - 1)
  if (!cleanAnswer) return Math.max(0, current - 1)
  return current
}

export function getQuestionDifficulty(mode: ExerciseMode, index: number, profile: StudyProfileId, trainingDifficulty: number) {
  const maximum = getMaxDifficulty(profile)
  if (mode === 'training') return Math.min(trainingDifficulty, maximum)
  if (questionCount <= 1) return maximum
  return Math.round((index / (questionCount - 1)) * maximum)
}

export function generateQuestion(profile: StudyProfileId, difficulty: number): ExerciseQuestion {
  const maximum = studyProfiles.find((item) => item.id === profile)?.maximum ?? 100
  const ceiling = Math.min(maximum, adaptiveCeilings[Math.min(difficulty, adaptiveCeilings.length - 1)])
  const minimum = ceiling < 10 ? 0 : 10
  const number = Math.floor(Math.random() * (ceiling - minimum + 1)) + minimum
  const digits = String(number)
  const placeIndex = Math.floor(Math.random() * digits.length)
  const reversedDigit = digits[digits.length - 1 - placeIndex]
  return {
    number,
    placeIndex,
    placeName: placeNames[placeIndex] ?? 'unités',
    expectedDigit: Number(reversedDigit),
    difficulty,
  }
}

export function getPerformanceBand(score: number): PerformanceBand {
  const rate = (score / questionCount) * 100
  if (rate < 50) return { label: 'Performance très insuffisante', detail: 'Reprends les bases et utilise le tableau de numération en entraînement.' }
  if (rate < 80) return { label: 'Performance insuffisante', detail: 'Tu progresses. Entraîne-toi encore sur la valeur de position.' }
  if (rate < 100) return { label: 'Performance satisfaisante', detail: 'Tu as réussi au moins huit questions sur dix.' }
  return { label: 'Performance très satisfaisante', detail: 'Excellent travail : toutes les questions sont réussies.' }
}

export const assessmentDurationSeconds = (profile: StudyProfileId) =>
  ['CP', 'CE1', 'CE2'].includes(profile) ? 15 * 60 : 10 * 60

export const maxNumberForProfile = (profile: StudyProfileId) =>
  studyProfiles.find((item) => item.id === profile)?.maximum ?? 100
