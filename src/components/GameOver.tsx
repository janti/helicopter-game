import { useState } from 'react'
import type { GameSettings } from '../types/game'
import type { HighScoreEntry } from '../utils/localStorageScores'
import { HighScoreList } from './HighScoreList'

type GameOverProps = {
  onPlayAgain: () => void
  onBackToMenu: () => void
  score: number
  foundCount: number
  settings: GameSettings
  highScores: HighScoreEntry[]
  hasSavedScore: boolean
  onSaveScore: (nickname: string) => void
}

const difficultyLabel: Record<GameSettings['difficulty'], string> = {
  easy: 'Helppo',
  medium: 'Keskitaso',
  hard: 'Vaikea',
  extreme: 'Extreme',
}

const targetTypeLabel: Record<GameSettings['targetType'], string> = {
  country: 'Maa',
  capital: 'Pääkaupunki',
  city: 'Kaupunki',
  mixed: 'Sekoitus',
}

export function GameOver({
  onPlayAgain,
  onBackToMenu,
  score,
  foundCount,
  settings,
  highScores,
  hasSavedScore,
  onSaveScore,
}: GameOverProps) {
  const [nickname, setNickname] = useState('')
  const lang = settings.language
  const difficultyLabelByLang = {
    fi: difficultyLabel,
    en: { easy: 'Easy', medium: 'Medium', hard: 'Hard', extreme: 'Extreme' },
  } as const
  const targetTypeLabelByLang = {
    fi: targetTypeLabel,
    en: { country: 'Country', capital: 'Capital', city: 'City', mixed: 'Mixed' },
  } as const

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-slate-700 bg-slate-900/80 p-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
          {lang === 'fi' ? 'Peli päättyi' : 'Game over'}
        </h2>
        <p className="mt-2 text-slate-300">
          {lang === 'fi' ? 'Aika loppui - hieno kierros.' : 'Time is up - great run.'}
        </p>
      </div>
      <div className="grid gap-3 rounded-lg bg-slate-800/60 p-4 text-slate-200 md:grid-cols-2">
        <span>{lang === 'fi' ? 'Loppupisteet' : 'Final score'}: {score}</span>
        <span>{lang === 'fi' ? 'Löydetyt kohteet' : 'Found targets'}: {foundCount}</span>
        <span>
          {lang === 'fi' ? 'Vaikeus' : 'Difficulty'}:{' '}
          {difficultyLabelByLang[lang][settings.difficulty]}
        </span>
        <span>
          {lang === 'fi' ? 'Kohdetyyppi' : 'Target type'}:{' '}
          {targetTypeLabelByLang[lang][settings.targetType]}
        </span>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
        <label className="mb-2 block text-sm font-semibold text-slate-100">
          {lang === 'fi' ? 'Nimimerkki' : 'Nickname'}
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            disabled={hasSavedScore}
            placeholder={lang === 'fi' ? 'Kirjoita nimimerkki' : 'Enter nickname'}
            className="min-w-[220px] flex-1 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => onSaveScore(nickname)}
            disabled={hasSavedScore}
            className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {hasSavedScore
              ? lang === 'fi'
                ? 'Tallennettu'
                : 'Saved'
              : lang === 'fi'
                ? 'Tallenna tulos'
                : 'Save score'}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {lang === 'fi' ? 'Pelaa uudelleen' : 'Play again'}
        </button>
        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-slate-500 px-5 py-2 font-semibold text-slate-100 transition hover:border-slate-300"
        >
          {lang === 'fi' ? 'Takaisin valikkoon' : 'Back to menu'}
        </button>
      </div>
      <HighScoreList scores={highScores} language={lang} />
    </div>
  )
}
