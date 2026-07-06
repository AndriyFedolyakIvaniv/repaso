import { useEffect, useMemo, useState } from 'react'

import { getLevelFromPoints } from '../data/levels'
import { badges } from '../data/badges'
import type { ProgressState, Topic, TopicProgress } from '../types/math'

const STORAGE_KEY = 'repaso-matematicas-progress-v1'

const createEmptyTopicProgress = (total: number): TopicProgress => ({
  completed: 0,
  total,
  accuracy: 0,
  correct: 0,
  attempts: 0,
})

const defaultState: ProgressState = {
  points: 0,
  streak: 0,
  bestStreak: 0,
  noHintStreak: 0,
  level: 1,
  themeCompletion: {},
  completedExercises: {},
  badges: [],
  hintsUsed: 0,
  totalAttempts: 0,
}

const uniqueBadges = (ids: string[]) => Array.from(new Set(ids))

const hasBadge = (state: ProgressState, badgeId: string) => state.badges.includes(badgeId)

const getTopicProgress = (
  state: ProgressState,
  topicId: string,
  totalExercises: number,
): TopicProgress => {
  const existing = state.themeCompletion[topicId]

  return existing ?? createEmptyTopicProgress(totalExercises)
}

export const useProgress = (topics: Topic[]) => {
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === 'undefined') {
      return defaultState
    }

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY)
      if (!rawState) {
        return defaultState
      }

      const parsed = JSON.parse(rawState) as Partial<ProgressState>
      return {
        ...defaultState,
        ...parsed,
        level: getLevelFromPoints(parsed.points ?? 0).id,
        themeCompletion: parsed.themeCompletion ?? {},
        completedExercises: parsed.completedExercises ?? {},
        badges: parsed.badges ?? [],
      }
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const topicById = useMemo(
    () => new Map(topics.map((topic) => [topic.id, topic])),
    [topics],
  )

  const getCompletionBadgeId = (topicId: string) => `topic-${topicId}`

  const markExercise = ({
    topicId,
    exerciseId,
    basePoints,
    usedHint,
    correct,
  }: {
    topicId: string
    exerciseId: string
    basePoints: number
    usedHint: boolean
    correct: boolean
  }) => {
    setProgress((current) => {
      const topic = topicById.get(topicId)
      const totalExercises = topic?.exercises.length ?? 0
      const topicProgress = getTopicProgress(current, topicId, totalExercises)
      const exerciseKey = `${topicId}:${exerciseId}`
      const alreadyCompleted = Boolean(current.completedExercises[exerciseKey])

      const updated: ProgressState = {
        ...current,
        totalAttempts: current.totalAttempts + 1,
        streak: correct ? current.streak + 1 : 0,
        bestStreak: correct ? Math.max(current.bestStreak, current.streak + 1) : current.bestStreak,
        noHintStreak: correct && !usedHint ? current.noHintStreak + 1 : 0,
        hintsUsed: usedHint ? current.hintsUsed + 1 : current.hintsUsed,
      }

      if (correct && !alreadyCompleted) {
        const earnedPoints = Math.max(5, Math.round(basePoints * (usedHint ? 0.65 : 1)))
        updated.points = current.points + earnedPoints
        updated.completedExercises = {
          ...current.completedExercises,
          [exerciseKey]: true,
        }
        updated.themeCompletion = {
          ...current.themeCompletion,
          [topicId]: {
            ...topicProgress,
            completed: Math.min(totalExercises, topicProgress.completed + 1),
            total: totalExercises,
            correct: topicProgress.correct + 1,
            attempts: topicProgress.attempts + 1,
            accuracy: Number(
              (((topicProgress.correct + 1) / (topicProgress.attempts + 1)) * 100).toFixed(1),
            ),
          },
        }
      } else {
        updated.themeCompletion = {
          ...current.themeCompletion,
          [topicId]: {
            ...topicProgress,
            total: totalExercises,
            correct: correct ? topicProgress.correct + 1 : topicProgress.correct,
            attempts: topicProgress.attempts + 1,
            accuracy: Number(
              (((correct ? topicProgress.correct + 1 : topicProgress.correct) /
                (topicProgress.attempts + 1)) *
                100).toFixed(1),
            ),
          },
        }
      }

      const currentLevel = getLevelFromPoints(updated.points)
      updated.level = currentLevel.id

      const badgeIds = [...updated.badges]

      if (Object.keys(updated.completedExercises).length >= 1) {
        badgeIds.push('first-solve')
      }

      if (updated.bestStreak >= 3) {
        badgeIds.push('streak-3')
      }

      if (updated.bestStreak >= 5) {
        badgeIds.push('streak-5')
      }

      if (updated.noHintStreak >= 3) {
        badgeIds.push('no-hints-3')
      }

      if (updated.noHintStreak >= 5) {
        badgeIds.push('no-hints-5')
      }

      for (let levelIndex = 1; levelIndex <= currentLevel.id; levelIndex += 1) {
        badgeIds.push(`level-${levelIndex}`)
      }

      topics.forEach((topic) => {
        const topicProgress = updated.themeCompletion[topic.id]
        if (topic.exercises.length > 0 && topicProgress?.completed === topic.exercises.length) {
          badgeIds.push(getCompletionBadgeId(topic.id))
        }
      })

      const fractionsTopic = topicById.get('fracciones')
      const fractionsProgress = fractionsTopic ? updated.themeCompletion[fractionsTopic.id] : undefined
      if (
        fractionsTopic &&
        fractionsProgress &&
        fractionsProgress.completed === fractionsTopic.exercises.length &&
        fractionsProgress.accuracy >= 80
      ) {
        badgeIds.push('fractions-master')
      }

      const initialTopics = topics.filter((topic) => topic.exercises.length > 0).slice(0, 5)
      const blockComplete = initialTopics.every((topic) => {
        const topicProgress = updated.themeCompletion[topic.id]
        return topicProgress?.completed === topic.exercises.length
      })

      if (blockComplete) {
        badgeIds.push('bloque-inicial')
      }

      updated.badges = uniqueBadges(badgeIds)
      return updated
    })
  }

  const resetProgress = () => {
    setProgress(defaultState)
  }

  const addPoints = (pointsToAdd: number) => {
    setProgress((current) => {
      const updated = { ...current, points: current.points + pointsToAdd }
      const currentLevel = getLevelFromPoints(updated.points)
      updated.level = currentLevel.id
      return updated
    })
  }

  const badgesCatalog = badges.filter((badge) => hasBadge(progress, badge.id))

  return {
    progress,
    badgesCatalog,
    markExercise,
    resetProgress,
    addPoints,
  }
}
