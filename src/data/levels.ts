export interface LevelDefinition {
  id: number
  name: string
  minPoints: number
  badgeId: string
  icon: string
}

export const levels: LevelDefinition[] = [
  { id: 1, name: 'Explorador', minPoints: 0, badgeId: 'level-1', icon: '⭐' },
  { id: 2, name: 'Ajustando el rumbo', minPoints: 150, badgeId: 'level-2', icon: '🌟' },
  { id: 3, name: 'Ritmo seguro', minPoints: 350, badgeId: 'level-3', icon: '🚀' },
  { id: 4, name: 'Buen razonador', minPoints: 650, badgeId: 'level-4', icon: '🏆' },
  { id: 5, name: 'Campeón matemático', minPoints: 1000, badgeId: 'level-5', icon: '👑' },
]

export const getLevelFromPoints = (points: number) => {
  const sortedLevels = [...levels].sort((first, second) => second.minPoints - first.minPoints)
  return sortedLevels.find((level) => points >= level.minPoints) ?? levels[0]
}

export const getNextLevel = (points: number) => {
  return levels.find((level) => points < level.minPoints) ?? levels[levels.length - 1]
}

export const getExercisePracticeLevel = (points: number) => {
  if (points <= 15) {
    return 1
  }

  if (points <= 20) {
    return 2
  }

  if (points <= 25) {
    return 3
  }

  if (points <= 30) {
    return 4
  }

  return 5
}

export const getPracticeLevelFromIndex = (index: number, exercisesPerLevel = 15) => Math.min(5, Math.floor(index / exercisesPerLevel) + 1)
