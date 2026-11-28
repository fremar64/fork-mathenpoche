'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { InteractiveNumerationHelp } from './InteractiveNumerationHelp'
import type { RankType } from './help-model'
import {
  assessmentDurationSeconds,
  formatNumber,
  generateQuestion,
  getMaxDifficulty,
  getPerformanceBand,
  getQuestionDifficulty,
  getTrainingDifficulty,
  maxNumberForProfile,
  questionCount,
  studyProfiles,
  type ExerciseMode,
  type ExerciseQuestion,
  type QuestionResult,
  type StudyProfileId,
} from './model'

type Phase = 'setup' | 'playing' | 'results'
type FeedbackTone = 'neutral' | 'success' | 'error' | 'notice'

const positionGroups = [
  { name: 'MILLIARDS', cells: ['Centaines', 'Dizaines', 'Unités'] },
  { name: 'MILLIONS', cells: ['Centaines', 'Dizaines', 'Unités'] },
  { name: 'MILLE', cells: ['Centaines', 'Dizaines', 'Unités'] },
  { name: 'UNITÉS', cells: ['Centaines', 'Dizaines', 'Unités'] },
]

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

function DifficultyProfilePicker({
  value,
  onChange,
}: {
  value: StudyProfileId
  onChange: (profile: StudyProfileId) => void
}) {
  return (
    <fieldset className="profile-fieldset">
      <legend>Niveau de difficulté</legend>
      <p className="field-help">Choisis la taille maximale des nombres de l’exercice.</p>
      <div className="profile-grid">
        {studyProfiles.map((profile) => (
          <label className={`profile-option ${value === profile.id ? 'selected' : ''}`} key={profile.id}>
            <input
              type="radio"
              name="difficulty-profile"
              value={profile.id}
              checked={value === profile.id}
              onChange={() => onChange(profile.id)}
            />
            <span className="profile-grade">{profile.label}</span>
            <span className="profile-limit">jusqu’à {formatNumber(profile.maximum)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NumerationTable({
  values,
  onChange,
  onClear,
}: {
  values: Record<number, string>
  onChange: (position: number, value: string) => void
  onClear: () => void
}) {
  return (
    <section className="numeration-tool" aria-label="Tableau de numération">
      <div className="tool-heading">
        <div><span className="tool-kicker">Outil de l’exercice</span><h3>Tableau de numération</h3></div>
        <span className="tool-badge">Entraînement</span>
      </div>
      <p className="tool-instruction">Écris chaque chiffre du nombre dans la case de sa position.</p>
      <div className="numeration-scroll">
        <table className="numeration-table">
          <thead>
            <tr>{positionGroups.map((group) => <th key={group.name} colSpan={3}>{group.name}</th>)}</tr>
            <tr>{positionGroups.flatMap((group, groupIndex) => group.cells.map((cell, cellIndex) => (
              <th className="place-heading" key={`${group.name}-${cell}`}>
                {cell}<span className="visually-hidden"> du groupe {group.name.toLowerCase()}</span>
              </th>
            )))}</tr>
          </thead>
          <tbody><tr>
            {Array.from({ length: 12 }, (_, cellIndex) => {
              const placeIndex = 11 - cellIndex
              return <td key={cellIndex}>
                <input
                  aria-label={`Chiffre de la position ${placeIndex + 1}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={values[placeIndex] ?? ''}
                  onChange={(event) => onChange(placeIndex, event.target.value)}
                />
              </td>
            })}
          </tr></tbody>
        </table>
      </div>
      <div className="tool-footer">
        <p>De droite à gauche : unités, dizaines, centaines…</p>
        <button className="button button-quiet button-small" onClick={onClear} type="button">Effacer</button>
      </div>
    </section>
  )
}

export function ValuePositionExercise({ returnHref = '/parcours/numeration/nombres-entiers-naturels/entrainement' }: { returnHref?: string }) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [profile, setProfile] = useState<StudyProfileId>('CP')
  const [mode, setMode] = useState<ExerciseMode>('training')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState<ExerciseQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [feedback, setFeedback] = useState<{ text: string; tone: FeedbackTone }>({ text: '', tone: 'neutral' })
  const [isLocked, setIsLocked] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [tableValues, setTableValues] = useState<Record<number, string>>({})
  const [trainingDifficulty, setTrainingDifficulty] = useState(0)
  const [cleanAnswerStreak, setCleanAnswerStreak] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [timeExpired, setTimeExpired] = useState(false)
  const [timedTraining, setTimedTraining] = useState(false)
  const answerInputRef = useRef<HTMLInputElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const score = useMemo(() => results.reduce((total, result) => total + result.points, 0), [results])
  const currentQuestionNumber = questionIndex + 1
  const maxDifficulty = getMaxDifficulty(profile)

  const start = () => {
    setProfile(profile)
    setQuestionIndex(0)
    setTrainingDifficulty(0)
    setCleanAnswerStreak(0)
    setResults([])
    setAttempts(0)
    setAnswer('')
    setIsLocked(false)
    setFeedback({ text: '', tone: 'neutral' })
    setTimeExpired(false)
    setRemainingSeconds(mode === 'assessment' || timedTraining ? assessmentDurationSeconds(profile) : 0)
    setQuestion(generateQuestion(profile, getQuestionDifficulty(mode, 0, profile, 0)))
    setPhase('playing')
  }

  const advance = useCallback(() => {
    setAutoAdvance(false)
    setShowHelp(false)
    setShowTable(false)
    setTableValues({})
    const nextIndex = questionIndex + 1
    if (nextIndex >= questionCount) {
      setPhase('results')
      return
    }
    setQuestionIndex(nextIndex)
    setAttempts(0)
    setAnswer('')
    setIsLocked(false)
    setFeedback({ text: '', tone: 'neutral' })
    setQuestion(generateQuestion(profile, getQuestionDifficulty(mode, nextIndex, profile, trainingDifficulty)))
  }, [questionIndex, profile, mode, trainingDifficulty])

  useEffect(() => {
    if (!autoAdvance || phase !== 'playing') return
    const timer = window.setTimeout(advance, 1200)
    return () => window.clearTimeout(timer)
  }, [autoAdvance, phase, advance])

  useEffect(() => {
    if (phase !== 'playing' || (mode !== 'assessment' && !timedTraining) || remainingSeconds <= 0 || results.length >= questionCount) return
    const timer = window.setTimeout(() => setRemainingSeconds((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [phase, mode, timedTraining, remainingSeconds, results.length])

  useEffect(() => {
    if (phase === 'playing' && (mode === 'assessment' || timedTraining) && remainingSeconds === 0 && results.length < questionCount) {
      setTimeExpired(true)
      setPhase('results')
    }
  }, [phase, mode, timedTraining, remainingSeconds, results.length])

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!question || isLocked || answer === '') return

    const digit = Number(answer)
    if (digit === question.expectedDigit) {
      setResults((previous) => [...previous, {
        number: question.number,
        placeName: question.placeName,
        expectedDigit: question.expectedDigit,
        givenDigit: digit,
        attempts: attempts + 1,
        points: 1,
      }])
      if (mode === 'training') {
        if (attempts === 0) {
          const nextStreak = cleanAnswerStreak + 1
          setCleanAnswerStreak(nextStreak >= 2 ? 0 : nextStreak)
          setTrainingDifficulty(getTrainingDifficulty(trainingDifficulty, true, nextStreak))
        } else {
          setCleanAnswerStreak(0)
        }
      }
      setFeedback({ text: 'Bravo !', tone: 'success' })
      setAnswer(String(digit))
      setIsLocked(true)
      setAutoAdvance(true)
      return
    }

    setAnswer('')
    if (attempts === 0) {
      setAttempts(1)
      setFeedback({
        text: mode === 'training' ? 'Faux ! Encore un essai ! Utilise l’aide !' : 'Réponse incorrecte. Essaie encore.',
        tone: 'error',
      })
      setCleanAnswerStreak(0)
      return
    }

    setResults((previous) => [...previous, {
      number: question.number,
      placeName: question.placeName,
      expectedDigit: question.expectedDigit,
      givenDigit: digit,
      attempts: 2,
      points: 0,
    }])
    if (mode === 'training') {
      setTrainingDifficulty(getTrainingDifficulty(trainingDifficulty, false, 0))
      setFeedback({ text: 'Non ! Regarde bien l’aide !', tone: 'error' })
      setShowHelp(true)
    } else {
      setFeedback({ text: 'Réponse incorrecte. Passe à la question suivante.', tone: 'error' })
    }
    setIsLocked(true)
    setAutoAdvance(false)
  }

  const updateTableCell = (position: number, value: string) => {
    setTableValues((current) => ({ ...current, [position]: value.replace(/[^0-9]/g, '').slice(-1) }))
  }

  const closeHelp = () => {
    setShowHelp(false)
    window.setTimeout(() => {
      if (isLocked) nextButtonRef.current?.focus()
      else answerInputRef.current?.focus()
    }, 0)
  }

  const restart = () => {
    setPhase('setup')
    setQuestion(null)
    setResults([])
    setFeedback({ text: '', tone: 'neutral' })
  }

  if (phase === 'setup') {
    return (
      <main className="exercise-shell">
        <header className="exercise-topbar">
          <Link className="back-link" href={returnHref}>← <span>Retour aux activités</span></Link>
          <span className="topbar-activity">Numération <span>·</span> Nombres entiers naturels</span>
        </header>
        <section className="setup-card">
          <div className="activity-intro">
            <p className="eyebrow">Mathenpoche 6e · Série 1 · Exercice 2</p>
            <h1>Quel est le chiffre des… ?</h1>
            <p>Repère la position d’un chiffre dans l’écriture d’un nombre entier naturel.</p>
          </div>
          <DifficultyProfilePicker value={profile} onChange={setProfile} />
          <fieldset className="mode-fieldset">
            <legend>Mode d’activité</legend>
            <div className="mode-options">
              <label className={`mode-option ${mode === 'training' ? 'selected' : ''}`}>
                <input type="radio" name="mode" checked={mode === 'training'} onChange={() => setMode('training')} />
                <span className="mode-icon" aria-hidden="true">↻</span>
                <span><strong>Entraînement</strong><small>Le tableau reste disponible. Le chronomètre est facultatif pour t’aider à repérer chaque colonne.</small></span>
              </label>
              <label className={`mode-option ${mode === 'assessment' ? 'selected' : ''}`}>
                <input type="radio" name="mode" checked={mode === 'assessment'} onChange={() => setMode('assessment')} />
                <span className="mode-icon assessment-icon" aria-hidden="true">◷</span>
                <span><strong>Évaluation</strong><small>10 questions, sans aide ni tableau, avec un chronomètre global de {profile === 'CP' || profile === 'CE1' || profile === 'CE2' ? '15' : '10'} minutes.</small></span>
              </label>
            </div>
          </fieldset>
          <label className={`timer-option ${mode === 'assessment' ? 'timer-option-fixed' : ''}`}>
            <input type="checkbox" checked={mode === 'assessment' || timedTraining} disabled={mode === 'assessment'} onChange={(event) => setTimedTraining(event.target.checked)} />
            <span><strong>Activer un temps limite global</strong><small>{mode === 'assessment' ? `Activé automatiquement : ${profile === 'CP' || profile === 'CE1' || profile === 'CE2' ? '15' : '10'} minutes pour la session.` : `Optionnel : ${profile === 'CP' || profile === 'CE1' || profile === 'CE2' ? '15' : '10'} minutes pour toute la session.`}</small></span>
          </label>
          <div className="setup-summary">
            <span className="summary-mark">10</span>
            <p><strong>10 questions · 1 point par question</strong><br />Une seule erreur peut être corrigée. À partir de 8/10 bonnes réponses (80 %), le niveau est considéré comme acquis.</p>
          </div>
          <button className="button button-primary button-wide" onClick={start} type="button">Commencer l’exercice <span aria-hidden="true">→</span></button>
        </section>
        <p className="source-note">Profil {profile} : nombres jusqu’à {formatNumber(maxNumberForProfile(profile))}.</p>
      </main>
    )
  }

  if (phase === 'results') {
    const performance = getPerformanceBand(score)
    const validated = !timeExpired && results.length === questionCount && score >= 8
    const scoreColor = score < 5 ? 'low' : score < 8 ? 'mid' : score < 10 ? 'good' : 'perfect'
    return (
      <main className="exercise-shell">
        <header className="exercise-topbar">
          <Link className="back-link" href={returnHref}>← <span>Retour aux activités</span></Link>
          <span className="topbar-activity">Numération <span>·</span> Résultats</span>
        </header>
        <section className="results-card">
          <p className="eyebrow">Exercice terminé {timeExpired ? '· Temps écoulé' : ''}</p>
          <h1>Ton résultat</h1>
          <div className={`result-score ${scoreColor}`}>
            <span className="result-fraction">{score}<small> / 10</small></span>
            <div><strong>{performance.label}</strong><span>{Math.round((score / questionCount) * 100)} % de réussite</span></div>
          </div>
          <p className="result-detail">{timeExpired ? 'Le temps est écoulé. Les questions non répondues ne rapportent pas de point.' : performance.detail}</p>
          {mode === 'assessment' && <p className={`validation-note ${validated ? 'validated' : ''}`}>{validated ? `Niveau ${profile} validé pour cet exercice.` : `Niveau ${profile} non validé. Entraîne-toi puis refais une évaluation complète.`}</p>}
          <div className="results-meta"><span>{profile}</span><span>{mode === 'training' ? 'Entraînement' : 'Évaluation'}</span><span>{results.length}/10 questions traitées</span></div>
          <div className="result-actions"><button className="button button-primary" onClick={start} type="button">Recommencer</button><button className="button button-secondary" onClick={restart} type="button">Changer les réglages</button></div>
          <Link className="result-back-link" href={returnHref}>Retour aux activités</Link>
        </section>
      </main>
    )
  }

  if (!question) return null
  const maxTime = assessmentDurationSeconds(profile)
  const progress = Math.min((questionIndex / questionCount) * 100, 100)
  const questionAnswerDisabled = isLocked

  return (
    <main className="exercise-shell playing-shell">
      <header className="exercise-topbar">
        <button className="back-link" onClick={restart} type="button">← <span>Quitter</span></button>
        <span className="topbar-activity">Quel est le chiffre des… ?</span>
        <span className={`mode-chip ${mode}`}>{mode === 'training' ? 'Entraînement' : 'Évaluation'}</span>
      </header>

      <div className="progress-row">
        <div className="progress-copy"><span>Question {currentQuestionNumber} sur {questionCount}</span><span>{score} point{score > 1 ? 's' : ''} · {results.length} traitée{results.length > 1 ? 's' : ''}</span></div>
        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={questionCount} aria-valuenow={questionIndex}><span style={{ width: `${progress}%` }} /></div>
      </div>

      <section className="question-card">
        <div className="question-card-top"><span className="question-label">Question n°{currentQuestionNumber}</span>
          {(mode === 'assessment' || timedTraining) && <span className={`timer ${remainingSeconds <= 60 ? 'urgent' : ''}`} aria-live="polite"><span aria-hidden="true">◷</span> {formatTime(remainingSeconds)}<span className="visually-hidden"> sur {formatTime(maxTime)}</span></span>}
          {mode === 'training' && <span className="difficulty-indicator">Difficulté <span>{Math.min(trainingDifficulty + 1, maxDifficulty + 1)} / {maxDifficulty + 1}</span></span>}
        </div>
        <div className="question-prompt">Dans le nombre <strong>{formatNumber(question.number)}</strong>, le chiffre des <button className="place-link" type="button" onClick={() => mode === 'training' && setShowTable(true)}>{question.placeName}</button> est…</div>
        {mode === 'training' && <button className="table-toggle" aria-expanded={showTable} onClick={() => setShowTable((visible) => !visible)} type="button"><span className="toggle-icon">▦</span>{showTable ? 'Masquer le tableau de numération' : 'Afficher le tableau de numération'}</button>}
        {mode === 'training' && showTable && <NumerationTable values={tableValues} onChange={updateTableCell} onClear={() => setTableValues({})} />}

        <form className="answer-form" onSubmit={submitAnswer}>
          <label htmlFor="answer-input">Ta réponse</label>
          <div className="answer-line">
            <input
              autoFocus
              autoComplete="off"
              id="answer-input"
              ref={answerInputRef}
              inputMode="numeric"
              maxLength={1}
              pattern="[0-9]"
              value={answer}
              onChange={(event) => setAnswer(event.target.value.replace(/[^0-9]/g, '').slice(-1))}
              disabled={questionAnswerDisabled}
              aria-describedby="answer-feedback"
            />
            {!isLocked && <button className="button button-primary validate-button" disabled={!answer} type="submit">Valider <span aria-hidden="true">↵</span></button>}
            {isLocked && results.at(-1)?.points === 0 && <button ref={nextButtonRef} className="button button-next" onClick={advance} type="button">Suite <span aria-hidden="true">→</span></button>}
          </div>
        </form>

        <div className={`feedback ${feedback.tone}`} id="answer-feedback" aria-live="polite" role="status">
          {feedback.text && <><span className="feedback-symbol" aria-hidden="true">{feedback.tone === 'success' ? '✓' : feedback.tone === 'error' ? '!' : '•'}</span><span>{feedback.text}</span></>}
        </div>
        {mode === 'training' && feedback.tone === 'error' && attempts === 1 && !isLocked && <button className="help-link" onClick={() => setShowHelp(true)} type="button">Besoin d’un coup de pouce ? Ouvrir l’aide</button>}
        {mode === 'training' && isLocked && results.at(-1)?.points === 0 && <p className="suite-hint">La question suivante t’attend.</p>}
      </section>

      <div className="live-score"><span className="score-dot" /><span>Mon score</span><strong>{score} sur {results.length}</strong></div>

      {showHelp && question && mode === 'training' && <InteractiveNumerationHelp
        key={`${question.number}-${question.placeIndex}`}
        numberValue={question.number}
        targetRank={question.placeIndex as RankType}
        onClose={closeHelp}
      />}
    </main>
  )
}
