import { useEffect, useState } from 'react'
import type { Exercise } from '../types/math'

type TimedExamProps = {
  exercises: Exercise[]
  durationSeconds?: number
  onFinish: (results: { correct: number; total: number; pointsEarned: number }) => void
  onCancel?: () => void
}

export function TimedExam({ exercises, durationSeconds = 300, onFinish, onCancel }: TimedExamProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const current = exercises[index]

  useEffect(() => {
    if (timeLeft <= 0) {
      setDone(true)
      return
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  useEffect(() => {
    if (done) {
      const points = correctCount * 10
      onFinish({ correct: correctCount, total: exercises.length, pointsEarned: points })
    }
  }, [done])

  const onAnswer = (answer: string) => {
    if (!current) return
    const isCorrect = String(current.answer).trim().toLowerCase() === String(answer).trim().toLowerCase()
    if (isCorrect) setCorrectCount((c) => c + 1)
    if (index + 1 >= exercises.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleCancel = () => {
    // cancel without awarding points
    if (onCancel) onCancel()
  }

  if (done) {
    return (
      <div className="timed-exam-summary">
        <h3>Examen terminado</h3>
        <p>
          Correctas: {correctCount} / {exercises.length}
        </p>
        <p>Puntos ganados: {correctCount * 10}</p>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="primary-button" onClick={() => onFinish({ correct: correctCount, total: exercises.length, pointsEarned: correctCount * 10 })}>
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-overlay" role="dialog" aria-modal="true">
      <div className="exam-modal">
        <div className="exam-header">
          <div>
            <strong>Tiempo:</strong> <span>{timeLeft}s</span>
          </div>
          <div>
            <strong>
              Pregunta: {index + 1} / {exercises.length}
            </strong>
          </div>
          <button type="button" className="secondary-button" onClick={handleCancel} aria-label="Cerrar examen">
            ✖
          </button>
        </div>

        <div className="exam-card">
          <h4>{current?.title}</h4>
          <p>{current?.statement}</p>
          {current?.kind === 'choice' && (
            <div className="choice-row">
              {current.options?.map((opt) => (
                <button key={opt.value} type="button" className="choice-button" onClick={() => onAnswer(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {current?.kind === 'text' && (
            <div className="answer-input">
              <input aria-label="Respuesta" type="text" id="timed-answer" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    const el = document.getElementById('timed-answer') as HTMLInputElement | null
                    if (!el) return
                    onAnswer(el.value)
                    el.value = ''
                  }}
                >
                  Enviar
                </button>
                <button type="button" className="secondary-button" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimedExam
