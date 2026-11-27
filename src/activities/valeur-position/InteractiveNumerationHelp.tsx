'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatNumber } from './model'
import { generateHelpSteps, placeRanks, type RankType } from './help-model'

const tableGroups = [
  { name: 'MILLIARDS', indexes: [11, 10, 9] },
  { name: 'MILLIONS', indexes: [8, 7, 6] },
  { name: 'MILLE', indexes: [5, 4, 3] },
  { name: 'UNITÉS', indexes: [2, 1, 0] },
] as const

interface InteractiveNumerationHelpProps {
  numberValue: number
  targetRank: RankType
  onClose: () => void
}

export function InteractiveNumerationHelp({ numberValue, targetRank, onClose }: InteractiveNumerationHelpProps) {
  const steps = useMemo(() => generateHelpSteps(numberValue, targetRank), [numberValue, targetRank])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const step = steps[currentStepIndex]
  const target = placeRanks[targetRank]

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setCurrentStepIndex((index) => Math.max(0, index - 1))
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setCurrentStepIndex((index) => Math.min(steps.length - 1, index + 1))
      }
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, steps.length])

  return (
    <div className="help-backdrop" role="presentation">
      <section className="numeration-help" role="dialog" aria-modal="true" aria-labelledby="interactive-help-title">
        <div className="numeration-help-controls" aria-label="Navigation de l’aide">
          <button
            className="help-round-button help-round-button-green"
            type="button"
            aria-label="Étape précédente"
            title="Étape précédente · Flèche gauche"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((index) => Math.max(0, index - 1))}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="help-round-button help-round-button-red"
            type="button"
            aria-label="Fermer l’aide et revenir à l’exercice"
            title="Fermer l’aide · Échap"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
          {currentStepIndex < steps.length - 1 ? (
            <button
              className="help-round-button help-round-button-green"
              type="button"
              aria-label="Étape suivante"
              title="Étape suivante · Flèche droite"
              onClick={() => setCurrentStepIndex((index) => Math.min(steps.length - 1, index + 1))}
            >
              <span aria-hidden="true">→</span>
            </button>
          ) : <span className="help-control-spacer" aria-hidden="true" />}
        </div>

        <div className="numeration-help-question">
          <span className="visually-hidden" id="interactive-help-title">Aide interactive : chiffre des {target.name}</span>
          <span aria-hidden="true">Dans le nombre <strong>{formatNumber(numberValue)}</strong></span>
          <span aria-hidden="true">Quel est le chiffre des <strong>{target.name}</strong> ?</span>
        </div>

        <p className="numeration-help-prompt" key={step.id}>{step.prompt}</p>
        <div className="help-table-scroll" aria-live="polite" aria-atomic="true">
          <table className="help-numeration-table" aria-label={`Tableau de numération, étape ${currentStepIndex + 1} sur ${steps.length}`}>
            <thead>
              <tr>{tableGroups.map((group) => <th className={step.focusedRank !== null && target.group === group.name ? 'target-group-heading' : ''} key={group.name} colSpan={3}>{group.name}</th>)}</tr>
              <tr>{tableGroups.flatMap((group) => group.indexes.map((index) => {
                const rank = placeRanks[index as RankType]
                return <th className={`help-place-heading ${step.focusedRank === index ? 'target-place-heading' : ''}`} key={index}>{rank.shortName}<span className="visually-hidden"> du groupe {rank.group.toLowerCase()}</span></th>
              }))}</tr>
            </thead>
            <tbody>
              <tr>{step.cells.map((cell) => {
                const rank = placeRanks[cell.position]
                const isNew = step.newlyPlacedRank === cell.position
                return (
                  <td
                    className={`help-digit-cell ${cell.highlight !== 'none' ? `highlight-${cell.highlight}` : ''}`}
                    key={cell.position}
                    aria-label={`${rank.name} : ${cell.visible ? cell.digit : 'vide'}${cell.highlight === 'answer' ? ', chiffre recherché' : ''}`}
                  >
                    <span className={cell.visible ? `help-digit ${isNew ? 'digit-arriving' : ''}` : 'help-digit hidden-digit'} key={`${step.id}-${cell.position}`}>
                      {cell.visible ? cell.digit : ''}
                    </span>
                  </td>
                )
              })}</tr>
            </tbody>
          </table>
        </div>
        <p className={`numeration-help-explanation ${step.revealAnswer ? 'answer-explanation' : ''}`} key={`${step.id}-explanation`}>
          {step.explanation}
        </p>
        <div className="numeration-help-progress" aria-label={`Étape ${currentStepIndex + 1} sur ${steps.length}`}>
          {steps.map((item, index) => <span className={index <= currentStepIndex ? 'completed' : ''} key={item.id} />)}
          <span className="visually-hidden">Étape {currentStepIndex + 1} sur {steps.length}</span>
        </div>
      </section>
    </div>
  )
}
