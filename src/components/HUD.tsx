import type { GameSettings, TargetProximityState } from '../types/game'

type HudProps = {
  onEndGame: () => void
  settings: GameSettings
  currentTargetName: string | null
  currentTargetType: string | null
  timeLeftSeconds: number
  score: number
  foundCount: number
  proximityState: TargetProximityState
  targetDistance: number | null
  successMessage: string | null
  hidePrimaryBar?: boolean
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

const proximityLabel: Record<TargetProximityState, string> = {
  far: 'Kaukana',
  hint: 'Vihjealueella',
  marker: 'Lähellä markeria',
  success: 'Löydetty',
}

export function HUD({
  onEndGame,
  settings,
  currentTargetName,
  currentTargetType,
  timeLeftSeconds,
  score,
  foundCount,
  proximityState,
  targetDistance,
  successMessage,
  hidePrimaryBar = false,
}: HudProps) {
  return (
    <div className="mt-4 space-y-3">
      {!hidePrimaryBar && (
        <div className="grid gap-3 rounded-xl border border-slate-700 bg-slate-900/90 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Etsittävä kohde</p>
            <p className="text-xl font-bold text-white md:text-2xl">
              {currentTargetName ?? 'Ei kohdetta'}
            </p>
          </div>
          <div className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-4 py-2 text-center">
            <p className="text-xs uppercase tracking-wide text-amber-200">Aikaa</p>
            <p className="text-2xl font-extrabold text-amber-100">
              {Math.max(0, Math.ceil(timeLeftSeconds))}s
            </p>
          </div>
          <button
            type="button"
            onClick={onEndGame}
            className="rounded bg-rose-500 px-3 py-2 font-semibold text-white transition hover:bg-rose-400"
          >
            Lopeta peli
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200">
          {successMessage}
        </div>
      )}
      <details className="rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-200">
        <summary className="cursor-pointer select-none font-semibold text-slate-100">
          Lisätiedot
        </summary>
        <div className="mt-3 grid gap-x-6 gap-y-1 md:grid-cols-3">
          <span>
            Tyyppi:{' '}
            {currentTargetType ? targetTypeLabel[currentTargetType as GameSettings['targetType']] : targetTypeLabel[settings.targetType]}
          </span>
          <span>Pisteet: {score}</span>
          <span>Löydetyt: {foundCount}</span>
          <span>Vaikeus: {difficultyLabel[settings.difficulty]}</span>
          <span>Etäisyys: {targetDistance === null ? '-' : Math.round(targetDistance)}</span>
          <span>Tila: {proximityLabel[proximityState]}</span>
        </div>
      </details>
    </div>
  )
}
