import { getPracticeLevelFromIndex } from './levels'
import { topics } from './topics'
import type { Exercise, TopicId } from '../types/math'

export interface LevelPracticeItem {
  topicId: TopicId
  topicTitle: string
  practiceLevel: number
  exercise: Exercise
}

export const getExercisesForLevel = (levelId: number): LevelPracticeItem[] => {
  return topics.flatMap((topic) =>
    topic.exercises
      .map((exercise, index) => ({
        topicId: topic.id,
        topicTitle: topic.title,
        practiceLevel: getPracticeLevelFromIndex(index),
        exercise,
      }))
      .filter((item) => item.practiceLevel === levelId),
  )
}

export const getLevelExerciseCounts = () =>
  [1, 2, 3, 4, 5].map((levelId) => ({
    levelId,
    total: getExercisesForLevel(levelId).length,
  }))
