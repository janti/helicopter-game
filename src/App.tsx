import { useCallback, useEffect, useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import type { LocationTarget } from './data/locations'
import { GameOver } from './components/GameOver'
import { MainMenu } from './components/MainMenu'
import { calculateFindScore } from './game/scoring'
import type { GameSettings, GameState } from './types/game'
import { getLocalizedLocationName } from './utils/locationLocalization'
import {
  loadScores,
  saveScore,
  type HighScoreEntry,
} from './utils/localStorageScores'
import { pickRandomTarget } from './utils/randomTarget'
import { loadWorldLocations } from './utils/worldLocations'
import { getI18n } from './i18n'

type VirtualControlsState = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

const defaultSettings: GameSettings = {
  targetType: 'mixed',
  difficulty: 'easy',
  durationSeconds: 120,
  language: 'fi',
  showHint: false,
  excludeTinyStates: true,
}

const SKIP_PENALTY_POINTS = 60
const HINT_TOGGLE_PENALTY_POINTS = 40
const HINT_TOGGLE_PENALTY_STEP = 20
const defaultVirtualControls: VirtualControlsState = {
  up: false,
  down: false,
  left: false,
  right: false,
}

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [currentTarget, setCurrentTarget] = useState<LocationTarget | null>(null)
  const [allLocations, setAllLocations] = useState<LocationTarget[]>([])
  const [locationsReady, setLocationsReady] = useState(false)
  const [previousTargetId, setPreviousTargetId] = useState<string | undefined>()
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    defaultSettings.durationSeconds,
  )
  const [score, setScore] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [highScores, setHighScores] = useState<HighScoreEntry[]>(() => loadScores())
  const [hasSavedCurrentRun, setHasSavedCurrentRun] = useState(false)
  const [hintEnableCount, setHintEnableCount] = useState(0)
  const [virtualControls, setVirtualControls] =
    useState<VirtualControlsState>(defaultVirtualControls)
  const t = getI18n(settings.language)

  useEffect(() => {
    void loadWorldLocations()
      .then((loaded) => {
        setAllLocations(loaded)
        setLocationsReady(true)
      })
      .catch(() => {
        setLocationsReady(false)
      })
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') {
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setGameState('gameOver')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing') {
      return
    }
    setVirtualControls(defaultVirtualControls)
  }, [gameState])

  const chooseNextTarget = useCallback(
    (targetSettings: GameSettings, previousId?: string) => {
      const next = pickRandomTarget(
        allLocations,
        targetSettings.targetType,
        targetSettings.difficulty,
        targetSettings.excludeTinyStates,
        previousId,
      )
      setCurrentTarget(next)
      setPreviousTargetId(next?.id)
    },
    [allLocations],
  )

  const handleTargetFound = useCallback(
    (targetId: string) => {
      const gainedScore = calculateFindScore(
        settings.difficulty,
        timeLeftSeconds,
        settings.durationSeconds,
      )
      setScore((prev) => prev + gainedScore)
      setFoundCount((prev) => prev + 1)
      chooseNextTarget(settings, targetId)
    },
    [chooseNextTarget, settings, timeLeftSeconds],
  )

  const currentTargetName = currentTarget
    ? getLocalizedLocationName(currentTarget, settings.language)
    : null
  const currentTargetDisplayName = currentTargetName
  const currentCountryFlagSvg =
    currentTarget?.type === 'country' ? currentTarget.flagSvgUrl : undefined

  const handleSkipTarget = useCallback(() => {
    if (!currentTarget) {
      return
    }
    setScore((prev) => prev - SKIP_PENALTY_POINTS)
    setSuccessMessage(t.gameplay.skippedMessage.replace('{penalty}', String(SKIP_PENALTY_POINTS)))
    window.setTimeout(() => setSuccessMessage(null), 900)
    chooseNextTarget(settings, currentTarget.id)
  }, [chooseNextTarget, currentTarget, settings, t])

  const handleSaveScore = useCallback(
    (nickname: string) => {
      if (hasSavedCurrentRun) {
        return
      }
      const nextScores = saveScore({
        nickname: nickname.trim() || 'Pelaaja',
        score,
        difficulty: settings.difficulty,
        targetType: settings.targetType,
        foundCount,
        date: new Date().toISOString(),
      })
      setHighScores(nextScores)
      setHasSavedCurrentRun(true)
    },
    [foundCount, hasSavedCurrentRun, score, settings],
  )

  const handleToggleHintDuringGame = useCallback(() => {
    setSettings((prev) => {
      const nextShowHint = !prev.showHint
      if (nextShowHint) {
        const penalty =
          HINT_TOGGLE_PENALTY_POINTS + hintEnableCount * HINT_TOGGLE_PENALTY_STEP
        setScore((currentScore) => currentScore - penalty)
        setHintEnableCount((count) => count + 1)
        setSuccessMessage(
          t.gameplay.hintEnabledPenaltyMessage.replace(
            '{penalty}',
            String(penalty),
          ),
        )
        window.setTimeout(() => setSuccessMessage(null), 1000)
      }
      return {
        ...prev,
        showHint: nextShowHint,
      }
    })
  }, [hintEnableCount, t])

  const setVirtualDirection = useCallback(
    (direction: keyof VirtualControlsState, pressed: boolean) => {
      setVirtualControls((prev) => {
        if (prev[direction] === pressed) {
          return prev
        }
        return {
          ...prev,
          [direction]: pressed,
        }
      })
    },
    [],
  )

  return (
    <main className="h-screen overflow-hidden bg-slate-950 px-2 py-2 text-slate-100 sm:px-3 sm:py-3 md:px-4 md:py-4">
      <div
        className={`mx-auto h-full w-full ${
          gameState === 'playing' ? 'max-w-[min(98vw,2200px)]' : 'max-w-6xl'
        }`}
      >
        {gameState === 'menu' && (
          <MainMenu
            locationsReady={locationsReady}
            onStart={(nextSettings) => {
              if (!locationsReady) {
                return
              }
              setSettings(nextSettings)
              setTimeLeftSeconds(nextSettings.durationSeconds)
              setScore(0)
              setFoundCount(0)
              setHasSavedCurrentRun(false)
              setHintEnableCount(0)
              chooseNextTarget(nextSettings, previousTargetId)
              setGameState('playing')
            }}
          />
        )}

        {gameState === 'playing' && (
          <section className="relative flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1">
              <GameCanvas
                currentTarget={currentTarget}
                targetLabel={currentTargetDisplayName}
                showHint={settings.showHint}
                difficulty={settings.difficulty}
                language={settings.language}
                virtualControls={virtualControls}
                onProximityChange={() => {}}
                onTargetFound={handleTargetFound}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 p-2 sm:p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="pointer-events-auto max-w-[70%] rounded-lg border border-slate-500/60 bg-slate-950/70 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    {t.gameplay.currentTarget}
                  </p>
                  <p className="text-sm font-bold text-white sm:text-lg md:text-xl">
                    <span className="inline-flex items-center gap-2">
                      {currentTargetDisplayName ?? t.common.noTarget}
                      {currentCountryFlagSvg && (
                        <img
                          src={currentCountryFlagSvg}
                          alt=""
                          aria-hidden="true"
                          className="h-4 w-6 rounded-[2px] border border-slate-300/40 object-cover sm:h-5 sm:w-7"
                        />
                      )}
                    </span>
                  </p>
                  <p className="text-xs text-slate-300 sm:text-sm">
                    {t.common.targetType}:{' '}
                    {t.labels.targetType[currentTarget?.type ?? settings.targetType]}
                  </p>
                </div>
                <div className="pointer-events-auto flex gap-2">
                  <div className="rounded-lg border border-emerald-300/50 bg-emerald-500/20 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-emerald-200 sm:text-xs">
                      {t.common.score}
                    </p>
                    <p className="text-lg font-extrabold text-emerald-100 sm:text-2xl">{score}</p>
                  </div>
                  <div className="rounded-lg border border-amber-300/50 bg-amber-500/20 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-wide text-amber-200 sm:text-xs">
                      {t.common.time}
                    </p>
                    <p className="text-lg font-extrabold text-amber-100 sm:text-2xl">
                      {Math.max(0, Math.ceil(timeLeftSeconds))}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 pointer-events-auto sm:bottom-3 sm:left-3">
                <div className="rounded-lg border border-slate-600/60 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 backdrop-blur-sm sm:text-sm">
                  {t.common.found}: {foundCount} | {t.common.difficulty}: {t.labels.difficulty[settings.difficulty]}
                </div>
              </div>

              <div className="absolute bottom-20 left-2 z-40 pointer-events-auto sm:bottom-24 sm:left-3">
                <div className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-cyan-100/90">
                  Touch
                </div>
                <div className="flex select-none flex-col items-center gap-2 rounded-xl border border-cyan-200/60 bg-slate-900/85 p-2 shadow-lg shadow-cyan-900/40 backdrop-blur-sm">
                  <TouchDirectionButton
                    label="▲"
                    onPressChange={(pressed) => setVirtualDirection('up', pressed)}
                  />
                  <div className="flex items-center gap-2">
                    <TouchDirectionButton
                      label="◀"
                      onPressChange={(pressed) => setVirtualDirection('left', pressed)}
                    />
                    <TouchDirectionButton
                      label="▶"
                      onPressChange={(pressed) => setVirtualDirection('right', pressed)}
                    />
                  </div>
                  <TouchDirectionButton
                    label="▼"
                    onPressChange={(pressed) => setVirtualDirection('down', pressed)}
                  />
                </div>
              </div>

              <div className="absolute bottom-2 right-2 pointer-events-auto flex flex-wrap justify-end gap-2 sm:bottom-3 sm:right-3">
                <button
                  type="button"
                  onClick={handleToggleHintDuringGame}
                  className={`rounded border px-3 py-2 text-xs font-semibold backdrop-blur-sm transition sm:text-sm ${
                    settings.showHint
                      ? 'border-cyan-300/60 bg-cyan-500/25 text-cyan-50 hover:bg-cyan-500/35'
                      : 'border-cyan-400/70 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/28'
                  }`}
                >
                  {settings.showHint
                    ? t.gameplay.disableHintButton
                    : t.gameplay.enableHintButton.replace(
                        '{penalty}',
                        String(
                          HINT_TOGGLE_PENALTY_POINTS +
                            hintEnableCount * HINT_TOGGLE_PENALTY_STEP,
                        ),
                      )}
                </button>
                <button
                  type="button"
                  onClick={handleSkipTarget}
                  disabled={!currentTarget}
                  className="rounded border border-amber-400/70 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-100 backdrop-blur-sm transition hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-800/80 disabled:text-slate-400 sm:text-sm"
                >
                  {t.gameplay.skipButton.replace('{penalty}', String(SKIP_PENALTY_POINTS))}
                </button>
                <button
                  type="button"
                  onClick={() => setGameState('gameOver')}
                  className="rounded bg-rose-500/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-rose-400 sm:text-sm"
                >
                  {t.common.endGame}
                </button>
              </div>

              {successMessage && (
                <div className="absolute bottom-16 left-1/2 pointer-events-none -translate-x-1/2 sm:bottom-20">
                  <div className="rounded-lg border border-emerald-300/70 bg-emerald-500/25 px-3 py-2 text-xs font-semibold text-emerald-100 backdrop-blur-sm sm:text-sm">
                    {successMessage}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {gameState === 'gameOver' && (
          <GameOver
            score={score}
            foundCount={foundCount}
            settings={settings}
            highScores={highScores}
            hasSavedScore={hasSavedCurrentRun}
            onSaveScore={handleSaveScore}
            onPlayAgain={() => {
              setTimeLeftSeconds(settings.durationSeconds)
              setScore(0)
              setFoundCount(0)
              setHasSavedCurrentRun(false)
              setHintEnableCount(0)
              chooseNextTarget(settings, previousTargetId)
              setGameState('playing')
            }}
            onBackToMenu={() => setGameState('menu')}
          />
        )}
      </div>
    </main>
  )
}

export default App

type TouchDirectionButtonProps = {
  label: string
  onPressChange: (pressed: boolean) => void
}

function TouchDirectionButton({ label, onPressChange }: TouchDirectionButtonProps) {
  const directionName =
    label === '▲'
      ? 'up'
      : label === '▼'
        ? 'down'
        : label === '◀'
          ? 'left'
          : 'right'

  return (
    <button
      type="button"
      aria-label={`Move ${directionName}`}
      onPointerDown={(event) => {
        event.preventDefault()
        onPressChange(true)
      }}
      onPointerUp={() => onPressChange(false)}
      onPointerCancel={() => onPressChange(false)}
      onPointerLeave={() => onPressChange(false)}
      className="flex h-12 w-12 touch-none items-center justify-center rounded-lg border border-cyan-200/70 bg-cyan-500/35 text-xl font-bold text-white transition active:scale-95 active:bg-cyan-400/65 sm:h-14 sm:w-14"
    >
      {label}
    </button>
  )
}
