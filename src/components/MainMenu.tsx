import { useState } from 'react'
import type {
  DifficultyOption,
  GameDurationOption,
  GameSettings,
  LanguageOption,
  TargetTypeOption,
} from '../types/game'
import { getI18n } from '../i18n'

type MainMenuProps = {
  onStart: (settings: GameSettings) => void
  locationsReady?: boolean
}

const targetTypeOptions: { value: TargetTypeOption; label: string }[] = [
  { value: 'country', label: 'Maat' },
  { value: 'capital', label: 'Pääkaupungit' },
  { value: 'city', label: 'Kaupungit' },
  { value: 'mixed', label: 'Sekoitus' },
]

const difficultyOptions: { value: DifficultyOption; label: string }[] = [
  { value: 'easy', label: 'Helppo (Eurooppa)' },
  { value: 'medium', label: 'Keskitaso (Eurooppa + Afrikka + Aasia)' },
  { value: 'hard', label: 'Vaikea (Eurooppa + Afrikka + Aasia + Amerikat)' },
  { value: 'extreme', label: 'Extreme (koko maailma)' },
]

const timeOptions: { value: GameDurationOption; label: string }[] = [
  { value: 60, label: '60 sekuntia' },
  { value: 120, label: '120 sekuntia' },
  { value: 180, label: '180 sekuntia' },
]

const languageOptions: { value: LanguageOption; label: string }[] = [
  { value: 'fi', label: 'Suomi' },
  { value: 'en', label: 'English' },
]

export function MainMenu({ onStart, locationsReady = true }: MainMenuProps) {
  const [targetType, setTargetType] = useState<TargetTypeOption>('mixed')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('easy')
  const [durationSeconds, setDurationSeconds] = useState<GameDurationOption>(120)
  const [language, setLanguage] = useState<LanguageOption>('fi')
  const [showHint, setShowHint] = useState(false)
  const [excludeTinyStates, setExcludeTinyStates] = useState(true)
  const t = getI18n(language)

  const targetTypeOptionsByLanguage: Record<LanguageOption, { value: TargetTypeOption; label: string }[]> = {
    fi: targetTypeOptions,
    en: [
      { value: 'country', label: 'Countries' },
      { value: 'capital', label: 'Capitals' },
      { value: 'city', label: 'Cities' },
      { value: 'mixed', label: 'Mixed' },
    ],
  }

  const difficultyOptionsByLanguage: Record<LanguageOption, { value: DifficultyOption; label: string }[]> = {
    fi: difficultyOptions,
    en: [
      { value: 'easy', label: 'Easy (Europe)' },
      { value: 'medium', label: 'Medium (Europe + Africa + Asia)' },
      { value: 'hard', label: 'Hard (Europe + Africa + Asia + Americas)' },
      { value: 'extreme', label: 'Extreme (whole world)' },
    ],
  }

  const timeOptionsByLanguage: Record<LanguageOption, { value: GameDurationOption; label: string }[]> = {
    fi: timeOptions,
    en: [
      { value: 60, label: '60 seconds' },
      { value: 120, label: '120 seconds' },
      { value: 180, label: '180 seconds' },
    ],
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/85 p-6 shadow-2xl shadow-cyan-900/30 md:p-8">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{t.menu.ready}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          {t.menu.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">{t.menu.subtitle}</p>
      </div>

      <div className="relative mt-7 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3 text-sm text-slate-200">
          {t.menu.targetType}
          <select
            value={targetType}
            onChange={(event) => setTargetType(event.target.value as TargetTypeOption)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400/80"
          >
            {targetTypeOptionsByLanguage[language].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3 text-sm text-slate-200">
          {t.menu.difficulty}
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as DifficultyOption)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400/80"
          >
            {difficultyOptionsByLanguage[language].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3 text-sm text-slate-200">
          {t.menu.language}
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageOption)}
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400/80"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-xl border border-slate-700/70 bg-slate-950/70 p-3 text-sm text-slate-200">
          {t.menu.gameTime}
          <select
            value={durationSeconds}
            onChange={(event) =>
              setDurationSeconds(Number(event.target.value) as GameDurationOption)
            }
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400/80"
          >
            {timeOptionsByLanguage[language].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-700/70 bg-slate-950/60 p-4">
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={showHint}
              onChange={(event) => setShowHint(event.target.checked)}
              className="h-4 w-4 rounded border-slate-500 bg-slate-950"
            />
            {t.menu.showHint}
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={excludeTinyStates}
              onChange={(event) => setExcludeTinyStates(event.target.checked)}
              className="h-4 w-4 rounded border-slate-500 bg-slate-950"
            />
            {t.menu.excludeTinyStates}
          </label>
        </div>

        <button
          type="button"
          disabled={!locationsReady}
          onClick={() =>
            onStart({
              targetType,
              difficulty,
              durationSeconds,
              language,
              showHint,
              excludeTinyStates,
            })
          }
          className="group relative overflow-hidden rounded-lg bg-emerald-500 px-7 py-3 text-lg font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-500 group-hover:translate-x-full" />
          <span className="relative">{locationsReady ? t.menu.startGame : t.menu.loadingData}</span>
        </button>
      </div>
    </div>
  )
}
