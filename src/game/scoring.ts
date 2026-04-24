import type { DifficultyOption } from '../types/game'

const BASE_SCORE = 100

const difficultyMultiplier: Record<DifficultyOption, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  extreme: 3,
}

export function calculateFindScore(
  difficulty: DifficultyOption,
  timeLeftSeconds: number,
  totalDurationSeconds: number,
): number {
  const difficultyScore = BASE_SCORE * difficultyMultiplier[difficulty]
  const normalizedTime = totalDurationSeconds > 0 ? timeLeftSeconds / totalDurationSeconds : 0
  const clampedTime = Math.max(0, Math.min(1, normalizedTime))
  const speedBonus = BASE_SCORE * 0.6 * clampedTime

  return Math.round(difficultyScore + speedBonus)
}
