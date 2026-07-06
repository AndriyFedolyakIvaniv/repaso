import { useMemo, useState } from 'react'

import 'katex/dist/katex.min.css'

import { ExerciseCard } from './components/ExerciseCard'
import { ProgressPanel } from './components/ProgressPanel'
import { TheorySection } from './components/TheorySection'
import { TopicGrid } from './components/TopicGrid'
import { getExercisesForLevel } from './data/levelPractice'
import { getPracticeLevelFromIndex } from './data/levels'
import { topics } from './data/topics'
import { useLevelProgress } from './hooks/useLevelProgress'
import { useProgress } from './hooks/useProgress'
import TimedExam from './components/TimedExam'
import type { Topic, TopicId, ViewMode } from './types/math'
import './App.css'

const mainTopicId: TopicId = 'fracciones'

const navItems: Array<{ label: string; view: ViewMode }> = [
  { label: 'Inicio', view: 'inicio' },
  { label: 'Explicaciones', view: 'explicaciones' },
  { label: 'Ejercicios', view: 'ejercicios' },
  { label: 'Progreso', view: 'progreso' },
]

const coachMessages = [
  'Hoy toca avanzar paso a paso. Si te atas, usa la pista y vuelve a intentarlo.',
  'Las matemáticas se entrenan como un deporte: poco a poco y con repeticiones cortas.',
  'Si una cuenta parece rara, vuelve a mirar la idea del tema antes de seguir.',
]

const getTopicProgressPercent = (topic: Topic, completed: number) => {
  if (topic.exercises.length === 0) {
    return 0
  }

  return Math.round((completed / topic.exercises.length) * 100)
}

function App() {
  const [view, setView] = useState<ViewMode>('inicio')
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>(mainTopicId)
  const [practiceMode, setPracticeMode] = useState<'topic' | 'level'>('topic')
  const [selectedPracticeLevel, setSelectedPracticeLevel] = useState<number>(1)
  const [practiceLevelFilter, setPracticeLevelFilter] = useState<number | 'all'>('all')
  const { progress, badgesCatalog, markExercise, resetProgress, addPoints } = useProgress(topics)

  const [examActive, setExamActive] = useState(false)
  const [examExercises, setExamExercises] = useState<any[]>([])

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? topics[0],
    [selectedTopicId],
  )

  const selectedTopicProgress = progress.themeCompletion[selectedTopic.id]
  const completedCount = selectedTopicProgress?.completed ?? 0
  const completionPercent = getTopicProgressPercent(selectedTopic, completedCount)
  const solvedExercises = Object.keys(progress.completedExercises).length
  const randomCoachMessage = coachMessages[progress.level % coachMessages.length]
  const levelInfo = useLevelProgress(progress.points)
  const unlockedLevelId = levelInfo.currentLevel.id
  const levelPracticeItems = getExercisesForLevel(selectedPracticeLevel).filter(
    (item) => item.practiceLevel <= unlockedLevelId,
  )

  const topicButtonRow = (
    <div className="topic-tabs" role="tablist" aria-label="Cambiar tema">
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          className={`topic-tab ${topic.id === selectedTopic.id ? 'is-active' : ''}`}
          onClick={() => setSelectedTopicId(topic.id)}
        >
          {topic.title}
        </button>
      ))}
    </div>
  )

  const renderSection = () => {
    if (view === 'inicio') {
      return (
        <>
          <TopicGrid
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onSelectView={setView}
          />

          <section className="highlight-card">
            <div>
              <p className="eyebrow">Tema recomendado</p>
              <h2>{selectedTopic.title}</h2>
              <p>{selectedTopic.summary}</p>
            </div>
            <div className="highlight-card__stats">
              <div>
                <strong>{completionPercent}%</strong>
                <span>completado</span>
              </div>
              <div>
                <strong>{solvedExercises}</strong>
                <span>ejercicios resueltos</span>
              </div>
              <div>
                <strong>{badgesCatalog.length}</strong>
                <span>medallas</span>
              </div>
            </div>
            <div className="highlight-card__actions">
              <button type="button" className="primary-button" onClick={() => setView('explicaciones')}>
                Ver explicación
              </button>
              <button type="button" className="secondary-button" onClick={() => setView('ejercicios')}>
                Ir a ejercicios
              </button>
            </div>
          </section>
        </>
      )
    }

    if (view === 'progreso') {
      return (
        <section className="content-card content-card--stacked">
          <div className="section-head">
            <div>
              <p className="eyebrow">Tu avance</p>
              <h2>Resumen de progreso</h2>
            </div>
            <button type="button" className="secondary-button" onClick={resetProgress}>
              Reiniciar progreso
            </button>
          </div>

          <div className="coach-banner">
            <span aria-hidden="true">🧭</span>
            <p>{randomCoachMessage}</p>
          </div>

          <div className="progress-mosaic">
            <article className="metric-card">
              <strong>{progress.points}</strong>
              <span>Puntos</span>
            </article>
            <article className="metric-card">
              <strong>{progress.level}</strong>
              <span>Nivel</span>
            </article>
            <article className="metric-card">
              <strong>{progress.streak}</strong>
              <span>Racha actual</span>
            </article>
            <article className="metric-card">
              <strong>{progress.bestStreak}</strong>
              <span>Mejor racha</span>
            </article>
          </div>

          <div className="badge-grid">
            {badgesCatalog.length > 0 ? (
              badgesCatalog.map((badge) => (
                <article key={badge.id} className="badge-card">
                  <span aria-hidden="true">{badge.icon}</span>
                  <div>
                    <strong>{badge.name}</strong>
                    <p>{badge.description}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="muted">Empieza por fracciones para desbloquear tus primeras medallas.</p>
            )}
          </div>
        </section>
      )
    }

    if (view === 'explicaciones') {
      return (
        <section className="content-card content-card--stacked">
          <div className="section-head">
            <div>
              <p className="eyebrow">📖 Explicaciones</p>
              <h2>{selectedTopic.title}</h2>
              <p>{selectedTopic.subtitle}</p>
            </div>
          </div>

          {topicButtonRow}

          {selectedTopic.theory.length > 0 ? (
            <div className="theory-grid">
              {selectedTopic.theory.map((section) => (
                <TheorySection key={`${selectedTopic.id}-${section.title}`} section={section} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Contenido en preparación</h3>
              <p>Este módulo ya está preparado en la arquitectura. Solo queda añadir su teoría y ejercicios.</p>
            </div>
          )}
        </section>
      )
    }

    return (
      <section className="content-card content-card--stacked">
        <div className="section-head">
          <div>
            <p className="eyebrow">✏️ Ejercicios</p>
            <h2>{selectedTopic.title}</h2>
            <p>Hazlos a tu ritmo. Las pistas se desbloquean poco a poco.</p>
          </div>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Modo de práctica">
          <button
            type="button"
            className={`topic-tab ${practiceMode === 'topic' ? 'is-active' : ''}`}
            onClick={() => setPracticeMode('topic')}
          >
            Por tema
          </button>
          <button
            type="button"
            className={`topic-tab ${practiceMode === 'level' ? 'is-active' : ''}`}
            onClick={() => setPracticeMode('level')}
          >
            Por nivel
          </button>
        </div>

        {examActive ? (
          <div className="exam-container">
            <TimedExam
              exercises={examExercises}
              durationSeconds={300}
              onFinish={(results) => {
                addPoints(results.pointsEarned)
                setExamActive(false)
              }}
              onCancel={() => setExamActive(false)}
            />
          </div>
        ) : null}

        {practiceMode === 'topic' ? topicButtonRow : null}

        {practiceMode === 'topic' ? (
          <>
            <div className="topic-tabs topic-tabs--compact" role="tablist" aria-label="Filtrar por nivel">
              <button
                type="button"
                className={`topic-tab ${practiceLevelFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setPracticeLevelFilter('all')}
              >
                Todos
              </button>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`topic-tab ${practiceLevelFilter === level ? 'is-active' : ''}`}
                  disabled={!levelInfo.isLevelUnlocked(level)}
                  onClick={() => setPracticeLevelFilter(level)}
                >
                  Nivel {level}{!levelInfo.isLevelUnlocked(level) ? ' 🔒' : ''}
                </button>
              ))}
            </div>

            <div style={{ margin: '12px 0' }}>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  // start mini-exam for the selected topic and selected level filter
                  const desiredLevel = practiceLevelFilter === 'all' ? 1 : practiceLevelFilter
                  const examList = selectedTopic.exercises
                    .map((exercise, index) => ({ exercise, practiceLevel: getPracticeLevelFromIndex(index) }))
                    .filter(({ practiceLevel }) => practiceLevel === desiredLevel)
                    .slice(0, 15)
                    .map(({ exercise }) => exercise)
                  setExamExercises(examList)
                  setExamActive(true)
                }}
              >
                Mini-examen (tema)
              </button>
            </div>

            {selectedTopic.exercises.filter((exercise, index) => {
              const practiceLevel = getPracticeLevelFromIndex(index)
              if (practiceLevel > unlockedLevelId) {
                return false
              }

              if (practiceLevelFilter === 'all') {
                return true
              }

              return practiceLevel === practiceLevelFilter
            }).length > 0 ? (
              <div className="exercise-list">
                {selectedTopic.exercises
                  .map((exercise, index) => ({
                    exercise,
                    practiceLevel: getPracticeLevelFromIndex(index),
                  }))
                  .filter(({ practiceLevel }) => practiceLevel <= unlockedLevelId)
                  .filter(({ practiceLevel }) => {
                    if (practiceLevelFilter === 'all') {
                      return true
                    }

                    return practiceLevel === practiceLevelFilter
                  })
                  .map(({ exercise, practiceLevel }) => {
                    const key = `${selectedTopic.id}:${exercise.id}`
                    return (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        practiceLevel={practiceLevel}
                        isCompleted={Boolean(progress.completedExercises[key])}
                        onResult={(currentExercise, correct, usedHint) =>
                          markExercise({
                            topicId: selectedTopic.id,
                            exerciseId: currentExercise.id,
                            basePoints: currentExercise.points,
                            usedHint,
                            correct,
                          })
                        }
                      />
                    )
                  })}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Sin ejercicios en este nivel</h3>
                <p>Prueba con otro nivel o cambia de tema para ver más práctica disponible.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="topic-tabs topic-tabs--compact" role="tablist" aria-label="Nivel de práctica">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`topic-tab ${selectedPracticeLevel === level ? 'is-active' : ''}`}
                  disabled={!levelInfo.isLevelUnlocked(level)}
                  onClick={() => setSelectedPracticeLevel(level)}
                >
                  Nivel {level}{!levelInfo.isLevelUnlocked(level) ? ' 🔒' : ''}
                </button>
              ))}
            </div>

            <div style={{ margin: '12px 0' }}>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  const examList = getExercisesForLevel(selectedPracticeLevel)
                    .filter((it) => it.practiceLevel === selectedPracticeLevel)
                    .slice(0, 15)
                    .map((it) => it.exercise)
                  setExamExercises(examList)
                  setExamActive(true)
                }}
              >
                Mini-examen (nivel)
              </button>
            </div>

            {levelPracticeItems.length > 0 ? (
              <div className="exercise-list">
                {levelPracticeItems.map(({ exercise, topicId, topicTitle, practiceLevel }) => {
                  const key = `${topicId}:${exercise.id}`
                  return (
                    <ExerciseCard
                      key={key}
                      exercise={exercise}
                      practiceLevel={practiceLevel}
                      contextLabel={topicTitle}
                      isCompleted={Boolean(progress.completedExercises[key])}
                      onResult={(currentExercise, correct, usedHint) =>
                        markExercise({
                          topicId,
                          exerciseId: currentExercise.id,
                          basePoints: currentExercise.points,
                          usedHint,
                          correct,
                        })
                      }
                    />
                  )
                })}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Nivel bloqueado</h3>
                <p>Consigue más puntos para desbloquear este nivel y ver sus 15 ejercicios.</p>
              </div>
            )}
          </>
        )}
      </section>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Repaso de Matemáticas · 1º ESO</p>
          <h1>Aprender matemáticas sin aburrirse</h1>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              className={`nav-button ${view === item.view ? 'is-active' : ''}`}
              onClick={() => setView(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-grid">
        <section className="main-column">
          <section className="hero-card">
            <div className="hero-copy">
              <p className="eyebrow">Mascota guía: Nova</p>
              <h2>Te acompaño tema a tema con pistas cortas, ejemplos reales y feedback amable.</h2>
              <p>
                En esta versión tienes el bloque de fracciones completo y la base preparada para
                naturales, divisibilidad, decimales, potencias, álgebra, geometría y proporcionalidad.
              </p>
            </div>
            <div className="hero-panel">
              <span className="hero-panel__mascot" aria-hidden="true">
                ✨
              </span>
              <p>{randomCoachMessage}</p>
              <div className="hero-panel__chips">
                <span>{progress.points} pts</span>
                <span>Nivel {progress.level} · {levelInfo.currentLevel.name}</span>
                <span>{badgesCatalog.length} medallas</span>
              </div>
            </div>
          </section>

          {renderSection()}
        </section>

        <ProgressPanel progress={progress} topics={topics} />
      </main>
    </div>
  )
}

export default App
