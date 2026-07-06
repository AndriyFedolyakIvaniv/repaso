import { useMemo, useState } from 'react'

import type { Exercise } from '../types/math'

interface ExerciseCardProps {
  exercise: Exercise
  practiceLevel: number
  contextLabel?: string
  isCompleted: boolean
  onResult: (exercise: Exercise, correct: boolean, usedHint: boolean) => void
}

const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '')

export function ExerciseCard({
  exercise,
  practiceLevel,
  contextLabel,
  isCompleted,
  onResult,
}: ExerciseCardProps) {
  const [value, setValue] = useState('')
  const [hintIndex, setHintIndex] = useState(-1)
  const [showSolution, setShowSolution] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'try-again'>('idle')

  const hint = hintIndex >= 0 ? exercise.hintSteps[hintIndex] : ''
  const expectedAnswers = useMemo(
    () => [exercise.answer, ...(exercise.acceptableAnswers ?? [])].map(normalizeAnswer),
    [exercise.acceptableAnswers, exercise.answer],
  )

  const checkAnswer = () => {
    const userAnswer = normalizeAnswer(value)
    const correct = expectedAnswers.includes(userAnswer)
    const usedHint = hintIndex >= 0

    onResult(exercise, correct, usedHint)
    setFeedback(correct ? 'success' : 'try-again')

    if (correct) {
      setShowSolution(true)
    }
  }

  return (
    <section className={`exercise-card ${isCompleted ? 'is-completed' : ''}`}>
      <header className="exercise-card__head">
        <div>
          <p className="eyebrow">{exercise.title}</p>
          <h3>{exercise.statement}</h3>
          {contextLabel ? <p className="exercise-context">{contextLabel}</p> : null}
        </div>
        <span className="exercise-points">
          Nivel {practiceLevel} · +{exercise.points} pts
        </span>
      </header>

      {exercise.kind === 'choice' && exercise.options ? (
        <div className="choice-list" role="group" aria-label={exercise.title}>
          {exercise.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`choice-button ${value === option.value ? 'is-selected' : ''}`}
              aria-pressed={value === option.value}
              onClick={() => {
                setValue(option.value)
                setFeedback('idle')
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {exercise.kind !== 'choice' ? (
        <label className="answer-input">
          <span>Tu respuesta</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Escribe aquí tu respuesta"
            inputMode="decimal"
          />
        </label>
      ) : (
        <div className="answer-input answer-input--choice">
          <span>Respuesta seleccionada</span>
          <div className="selected-answer">{value || 'Elige una opción arriba'}</div>
        </div>
      )}

      <div className="exercise-actions">
        <button type="button" className="secondary-button" onClick={() => setHintIndex((value) => Math.min(value + 1, exercise.hintSteps.length - 1))}>
          💡 Pista
        </button>
        <button type="button" className="secondary-button" onClick={() => setShowSolution((current) => !current)}>
          ✅ Solución
        </button>
        <button type="button" className="primary-button" onClick={checkAnswer}>
          Comprobar
        </button>
      </div>

      {hint ? (
        <div className="hint-box" aria-live="polite">
          <strong>Pista:</strong> {hint}
        </div>
      ) : null}

      {feedback === 'success' ? (
        <div className="feedback feedback--success" aria-live="polite">
          Bien hecho. Has acertado.
        </div>
      ) : null}

      {feedback === 'try-again' ? (
        <div className="feedback feedback--soft" aria-live="polite">
          Vas por buen camino. Prueba otra vez y mira la pista si te hace falta.
        </div>
      ) : null}

      {showSolution ? (
        <div className="solution-box">
          <div className="solution-box__answer">
            <p>Resultado correcto</p>
            <strong>{exercise.answer}</strong>
          </div>
          <div className="solution-box__steps">
            <p>Explicación paso a paso</p>
            <ol>
              {exercise.solutionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="solution-box__note">{exercise.explanation}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
