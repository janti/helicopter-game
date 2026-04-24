import type { DifficultyOption, TargetTypeOption } from '../types/game'

const SCORES_KEY = 'helicopter-geo-game-scores'
const MAX_SCORES = 10

export type HighScoreEntry = {
  nickname: string
  score: number
  difficulty: DifficultyOption
  targetType: TargetTypeOption
  foundCount: number
  date: string
}

export function loadScores(): HighScoreEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(SCORES_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as HighScoreEntry[]
    return normalizeScores(parsed)
  } catch {
    return []
  }
}

export function saveScore(entry: HighScoreEntry): HighScoreEntry[] {
  const next = normalizeScores([entry, ...loadScores()]).slice(0, MAX_SCORES)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SCORES_KEY, JSON.stringify(next))
  }
  return next
}

function normalizeScores(scores: HighScoreEntry[]): HighScoreEntry[] {
  return scores
    .filter(
      (score) =>
        typeof score.score === 'number' &&
        typeof score.foundCount === 'number' &&
        typeof score.date === 'string',
    )
    .map((score) => ({
      ...score,
      nickname:
        typeof score.nickname === 'string' && score.nickname.trim().length > 0
          ? score.nickname.trim()
          : 'Pelaaja',
    }))
    .sort((a, b) => b.score - a.score)
}
