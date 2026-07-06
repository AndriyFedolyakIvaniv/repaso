export type TopicId =
  | 'naturales-enteros'
  | 'divisibilidad'
  | 'fracciones'
  | 'decimales'
  | 'potencias-raices'
  | 'algebra'
  | 'geometria'
  | 'proporcionalidad'

export type ViewMode = 'inicio' | 'explicaciones' | 'ejercicios' | 'progreso'

export type ExerciseKind = 'text' | 'number' | 'choice'

export interface TheorySection {
  title: string
  summary: string
  bullets: string[]
  formula?: string
  example?: string
}

export interface ExerciseOption {
  label: string
  value: string
}

export interface Exercise {
  id: string
  title: string
  statement: string
  kind: ExerciseKind
  answer: string
  points: number
  hintSteps: string[]
  solutionSteps: string[]
  explanation: string
  options?: ExerciseOption[]
  acceptableAnswers?: string[]
}

export interface Topic {
  id: TopicId
  title: string
  icon: string
  subtitle: string
  summary: string
  theory: TheorySection[]
  exercises: Exercise[]
  unlocked?: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface TopicProgress {
  completed: number
  total: number
  accuracy: number
  correct: number
  attempts: number
}

export interface ProgressState {
  points: number
  streak: number
  bestStreak: number
  noHintStreak: number
  level: number
  themeCompletion: Record<string, TopicProgress>
  completedExercises: Record<string, boolean>
  badges: string[]
  hintsUsed: number
  totalAttempts: number
}
