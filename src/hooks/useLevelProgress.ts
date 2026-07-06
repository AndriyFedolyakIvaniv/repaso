import { getLevelFromPoints, getNextLevel, levels } from '../data/levels'

export const useLevelProgress = (points: number) => {
  const currentLevel = getLevelFromPoints(points)
  const nextLevel = getNextLevel(points)
  const nextThreshold = nextLevel.minPoints
  const currentThreshold = currentLevel.minPoints
  const progressPoints = Math.max(0, points - currentThreshold)
  const requiredPoints = Math.max(1, nextThreshold - currentThreshold)
  const percentToNext =
    currentLevel.id === levels[levels.length - 1].id
      ? 100
      : Math.min(100, Math.round((progressPoints / requiredPoints) * 100))

  return {
    currentLevel,
    nextLevel,
    percentToNext,
    progressPoints,
    requiredPoints,
    isMaxLevel: currentLevel.id === levels[levels.length - 1].id,
    unlockedLevels: levels.filter((level) => points >= level.minPoints),
    isLevelUnlocked: (levelId: number) => points >= (levels.find((level) => level.id === levelId)?.minPoints ?? 0),
  }
}
