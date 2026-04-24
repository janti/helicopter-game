export type GameState = 'menu' | 'playing' | 'gameOver'

export type TargetTypeOption =
  | 'country'
  | 'capital'
  | 'city'
  | 'mixed'

export type DifficultyOption = 'easy' | 'medium' | 'hard' | 'extreme'

export type GameDurationOption = 60 | 120 | 180

export type LanguageOption = 'fi' | 'en'

export type GameSettings = {
  targetType: TargetTypeOption
  difficulty: DifficultyOption
  durationSeconds: GameDurationOption
  language: LanguageOption
  showHint: boolean
  excludeTinyStates: boolean
}

export type TargetProximityState = 'far' | 'hint' | 'marker' | 'success'
