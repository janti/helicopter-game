import type { HighScoreEntry } from '../utils/localStorageScores'
import type { LanguageOption } from '../types/game'

type HighScoreListProps = {
  scores: HighScoreEntry[]
  language: LanguageOption
}

export function HighScoreList({ scores, language }: HighScoreListProps) {
  const targetTypeLabel = {
    fi: { country: 'Maa', capital: 'Pääkaupunki', city: 'Kaupunki', mixed: 'Sekoitus' },
    en: { country: 'Country', capital: 'Capital', city: 'City', mixed: 'Mixed' },
  } as const

  const difficultyLabel = {
    fi: { easy: 'Helppo', medium: 'Keskitaso', hard: 'Vaikea', extreme: 'Extreme' },
    en: { easy: 'Easy', medium: 'Medium', hard: 'Hard', extreme: 'Extreme' },
  } as const

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">
        {language === 'fi' ? 'Parhaat pisteet' : 'High scores'}
      </h3>
      {scores.length === 0 && (
        <p className="text-sm text-slate-400">
          {language === 'fi' ? 'Ei tallennettuja tuloksia vielä.' : 'No saved scores yet.'}
        </p>
      )}
      <ol className="space-y-2 text-sm text-slate-300">
        {scores.map((entry, index) => (
          <li
            key={`${entry.date}-${entry.score}-${index}`}
            className="flex items-center justify-between rounded bg-slate-800/70 px-3 py-2"
          >
            <span>
              #{index + 1} {entry.nickname} - {targetTypeLabel[language][entry.targetType]} /{' '}
              {difficultyLabel[language][entry.difficulty]}
            </span>
            <span>
              {entry.score} {language === 'fi' ? 'p' : 'pts'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
