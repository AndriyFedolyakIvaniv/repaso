import { badges as badgeCatalog } from '../data/badges'
import { levels } from '../data/levels'
import { useLevelProgress } from '../hooks/useLevelProgress'
import type { ProgressState, Topic } from '../types/math'

interface ProgressPanelProps {
  progress: ProgressState
  topics: Topic[]
}

export function ProgressPanel({ progress, topics }: ProgressPanelProps) {
  const levelInfo = useLevelProgress(progress.points)
  const completedBadges = badgeCatalog.filter((badge) => progress.badges.includes(badge.id))

  return (
    <aside className="progress-panel" aria-label="Perfil de progreso">
      <div className="profile-card">
        <p className="eyebrow">Tu perfil</p>
        <h2>
          Nivel {progress.level} · {levelInfo.currentLevel.name}
        </h2>
        <p>{progress.points} puntos totales</p>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${levelInfo.percentToNext}%` }} />
        </div>
        <p className="progress-caption">
          {levelInfo.isMaxLevel
            ? 'Has alcanzado el nivel máximo.'
            : `${levelInfo.progressPoints} / ${levelInfo.requiredPoints} para llegar a ${levelInfo.nextLevel.name}`}
        </p>
      </div>

      <div className="profile-card">
        <p className="eyebrow">Medallas</p>
        <div className="badge-list">
          {completedBadges.length > 0 ? (
            completedBadges.map((badge) => (
              <div key={badge.id} className="badge-pill">
                <span aria-hidden="true">{badge.icon}</span>
                <div>
                  <strong>{badge.name}</strong>
                  <p>{badge.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">Todavía no hay medallas. Empieza por fracciones.</p>
          )}
        </div>
      </div>

      <div className="profile-card">
        <p className="eyebrow">Progreso por tema</p>
        <div className="topic-progress-list">
          {topics.map((topic) => {
            const topicProgress = progress.themeCompletion[topic.id]
            const completed = topicProgress?.completed ?? 0
            const total = topicProgress?.total ?? topic.exercises.length
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <div key={topic.id} className="topic-progress-row">
                <div className="topic-progress-row__head">
                  <span>{topic.title}</span>
                  <strong>{percent}%</strong>
                </div>
                <div className="progress-bar progress-bar--small" aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="profile-card">
        <p className="eyebrow">Niveles</p>
        <div className="level-list">
          {levels.map((level) => {
            const isUnlocked = levelInfo.isLevelUnlocked(level.id)

            return (
              <div key={level.id} className={`level-pill ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
                <span aria-hidden="true">{level.icon}</span>
                <div>
                  <strong>
                    Nivel {level.id} · {level.name}
                  </strong>
                  <p>
                    {isUnlocked
                      ? 'Desbloqueado'
                      : `Bloqueado hasta ${level.minPoints} puntos`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="profile-card stats-strip">
        <div>
          <strong>{progress.streak}</strong>
          <span>racha</span>
        </div>
        <div>
          <strong>{progress.bestStreak}</strong>
          <span>mejor racha</span>
        </div>
        <div>
          <strong>{progress.totalAttempts}</strong>
          <span>intentos</span>
        </div>
      </div>
    </aside>
  )
}
