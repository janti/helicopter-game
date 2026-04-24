import { useEffect, useRef } from 'react'
import type { Geometry, MultiLineString } from 'geojson'
import type { LocationTarget } from '../data/locations'
import { createCamera, updateCamera } from '../game/camera'
import { createGameLoop } from '../game/gameLoop'
import { clamp } from '../game/collision'
import { createHelicopter, updateHelicopter } from '../game/helicopter'
import type { DifficultyOption, LanguageOption, TargetProximityState } from '../types/game'
import { latLngToWorldXY } from '../utils/geoProjection'
import { mesh } from 'topojson-client'

const VIEWPORT_WIDTH = 1600
const VIEWPORT_HEIGHT = 767
const WORLD_WIDTH = 4096
const WORLD_HEIGHT = 2048
const CAMERA_ZOOM = 2.8
const proximityByDifficulty: Record<
  DifficultyOption,
  { hintDistance: number; markerDistance: number; successDistance: number }
> = {
  easy: { hintDistance: 520, markerDistance: 290, successDistance: 18 },
  medium: { hintDistance: 420, markerDistance: 250, successDistance: 12 },
  hard: { hintDistance: 340, markerDistance: 210, successDistance: 10 },
  extreme: { hintDistance: 260, markerDistance: 170, successDistance: 8 },
}

type GameCanvasProps = {
  currentTarget: LocationTarget | null
  targetLabel: string | null
  showHint: boolean
  difficulty: DifficultyOption
  language: LanguageOption
  virtualControls: {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
  }
  onProximityChange: (state: TargetProximityState, distance: number | null) => void
  onTargetFound: (targetId: string) => void
}

type BorderRing = Array<{ x: number; y: number }>

export function GameCanvas({
  currentTarget,
  targetLabel,
  showHint,
  difficulty,
  language,
  virtualControls,
  onProximityChange,
  onTargetFound,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const foundTargetRef = useRef<string | null>(null)
  const currentTargetRef = useRef<LocationTarget | null>(currentTarget)
  const targetLabelRef = useRef<string | null>(targetLabel)
  const showHintRef = useRef(showHint)
  const difficultyRef = useRef<DifficultyOption>(difficulty)
  const languageRef = useRef<LanguageOption>(language)
  const virtualControlsRef = useRef(virtualControls)
  const onProximityChangeRef = useRef(onProximityChange)
  const onTargetFoundRef = useRef(onTargetFound)
  const countryBordersRef = useRef<BorderRing[]>([])

  useEffect(() => {
    currentTargetRef.current = currentTarget
  }, [currentTarget])

  useEffect(() => {
    targetLabelRef.current = targetLabel
  }, [targetLabel])

  useEffect(() => {
    showHintRef.current = showHint
  }, [showHint])

  useEffect(() => {
    difficultyRef.current = difficulty
  }, [difficulty])

  useEffect(() => {
    languageRef.current = language
  }, [language])

  useEffect(() => {
    virtualControlsRef.current = virtualControls
  }, [virtualControls])

  useEffect(() => {
    onProximityChangeRef.current = onProximityChange
  }, [onProximityChange])

  useEffect(() => {
    onTargetFoundRef.current = onTargetFound
  }, [onTargetFound])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    canvas.width = VIEWPORT_WIDTH
    canvas.height = VIEWPORT_HEIGHT

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    const worldMapImage = new Image()
    worldMapImage.src = '/world-satellite-clean.jpg'
    let isDisposed = false

    void loadCountryBorders().then((rings) => {
      if (!isDisposed) {
        countryBordersRef.current = rings
      }
    })

    const helicopter = createHelicopter()
    let helicopterFacing: 1 | -1 = 1
    helicopter.x = WORLD_WIDTH * 0.5
    helicopter.y = WORLD_HEIGHT * 0.5
    const camera = createCamera(VIEWPORT_WIDTH / CAMERA_ZOOM, VIEWPORT_HEIGHT / CAMERA_ZOOM)
    updateCamera(
      camera,
      helicopter.x,
      helicopter.y,
      WORLD_WIDTH,
      WORLD_HEIGHT,
      1,
    )

    const keys: Record<string, boolean> = {}
    const onKeyDown = (event: KeyboardEvent) => {
      keys[event.key] = true
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys[event.key] = false
    }
    const clearKeys = () => {
      for (const key of Object.keys(keys)) {
        keys[key] = false
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearKeys)

    const draw = (deltaTime: number, elapsedTime: number) => {
      updateHelicopter(
        helicopter,
        {
          up: Boolean(keys.w || keys.W || keys.ArrowUp || virtualControlsRef.current.up),
          down: Boolean(keys.s || keys.S || keys.ArrowDown || virtualControlsRef.current.down),
          left: Boolean(keys.a || keys.A || keys.ArrowLeft || virtualControlsRef.current.left),
          right: Boolean(
            keys.d || keys.D || keys.ArrowRight || virtualControlsRef.current.right,
          ),
        },
        deltaTime,
      )

      // Side-view helicopter should stay upright; only mirror left/right facing.
      if (Math.abs(helicopter.vx) > 6) {
        helicopterFacing = helicopter.vx >= 0 ? 1 : -1
      }

      if (helicopter.x < 0) {
        helicopter.x += WORLD_WIDTH
      } else if (helicopter.x > WORLD_WIDTH) {
        helicopter.x -= WORLD_WIDTH
      }
      helicopter.y = clamp(helicopter.y, 0, WORLD_HEIGHT)
      if (helicopter.y === 0 || helicopter.y === WORLD_HEIGHT) {
        helicopter.vy = 0
      }

      updateCamera(
        camera,
        helicopter.x,
        helicopter.y,
        WORLD_WIDTH,
        WORLD_HEIGHT,
        deltaTime,
      )

      context.fillStyle = '#0f172a'
      context.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT)
      drawWorldMap(context, camera, worldMapImage, countryBordersRef.current)

      const mainRotorAngle = elapsedTime * 38
      const tailRotorAngle = elapsedTime * 75
      const helicopterScreen = worldToViewport(helicopter.x, helicopter.y, camera)

      let targetDistance: number | null = null
      let proximityState: TargetProximityState = 'far'
      const proximity = proximityByDifficulty[difficultyRef.current]
      const activeTarget = currentTargetRef.current
      if (activeTarget) {
        const targetWorld = latLngToWorldXY(
          activeTarget.lat,
          activeTarget.lng,
          WORLD_WIDTH,
          WORLD_HEIGHT,
        )
        const targetScreen = worldToViewport(targetWorld.x, targetWorld.y, camera)
        targetDistance = Math.hypot(
          helicopter.x - targetWorld.x,
          helicopter.y - targetWorld.y,
        )

        if (targetDistance < proximity.successDistance) {
          proximityState = 'success'
          if (foundTargetRef.current !== activeTarget.id) {
            foundTargetRef.current = activeTarget.id
            onTargetFoundRef.current(activeTarget.id)
          }
        } else if (targetDistance < proximity.markerDistance) {
          proximityState = 'marker'
        } else if (showHintRef.current && targetDistance < proximity.hintDistance) {
          proximityState = 'hint'
        }

        if (proximityState === 'hint') {
          drawDirectionArrow(
            context,
            helicopterScreen.x,
            helicopterScreen.y,
            targetScreen.x,
            targetScreen.y,
          )
        } else if (proximityState === 'marker' || proximityState === 'success') {
          drawTargetFlag(
            context,
            targetScreen.x,
            targetScreen.y,
            targetLabelRef.current ?? activeTarget.name,
            elapsedTime,
          )
        }
      } else {
        foundTargetRef.current = null
      }

      onProximityChangeRef.current(proximityState, targetDistance)
      drawHelicopter(
        context,
        helicopterScreen.x,
        helicopterScreen.y,
        helicopterFacing,
        mainRotorAngle,
        tailRotorAngle,
      )
    }

    const loop = createGameLoop(({ deltaTime, elapsedTime }) => {
      draw(deltaTime, elapsedTime)
    })

    loop.start()
    return () => {
      isDisposed = true
      loop.stop()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearKeys)
    }
  }, [])

  return (
    <div className="mx-auto flex h-full w-full min-h-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 p-1 sm:p-2">
      <canvas
        ref={canvasRef}
        className="block aspect-[1600/767] h-full max-h-full w-auto max-w-full rounded-md bg-slate-900"
        aria-label="Pelikenttä"
      />
    </div>
  )
}

function drawWorldMap(
  context: CanvasRenderingContext2D,
  camera: { x: number; y: number },
  worldMapImage: HTMLImageElement,
  countryBorders: BorderRing[],
) {
  context.save()
  context.beginPath()
  context.rect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT)
  context.clip()
  context.setTransform(
    CAMERA_ZOOM,
    0,
    0,
    CAMERA_ZOOM,
    -camera.x * CAMERA_ZOOM,
    -camera.y * CAMERA_ZOOM,
  )

  context.fillStyle = '#0a2f3f'
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

  if (worldMapImage.complete) {
    const srcWidth = worldMapImage.naturalWidth || worldMapImage.width
    const srcHeight = worldMapImage.naturalHeight || worldMapImage.height
    context.filter = 'saturate(1.18) contrast(1.22) brightness(1.01)'
    context.globalAlpha = 1
    context.drawImage(
      worldMapImage,
      0,
      0,
      srcWidth,
      srcHeight,
      0,
      0,
      WORLD_WIDTH,
      WORLD_HEIGHT,
    )
    context.filter = 'none'
    context.globalAlpha = 1

    // Keep color grading subtle to avoid soft-looking map texture.
    context.fillStyle = 'rgba(6, 28, 46, 0.1)'
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    const atmosphereGradient = context.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    atmosphereGradient.addColorStop(0, 'rgba(56, 189, 248, 0.06)')
    atmosphereGradient.addColorStop(0.45, 'rgba(14, 116, 144, 0.03)')
    atmosphereGradient.addColorStop(1, 'rgba(2, 6, 23, 0.08)')
    context.fillStyle = atmosphereGradient
    context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
  }

  drawCountryBorders(context, countryBorders)
  context.restore()

  // Very light vignette keeps edge focus without softening map details.
  const vignette = context.createRadialGradient(
    VIEWPORT_WIDTH * 0.5,
    VIEWPORT_HEIGHT * 0.5,
    VIEWPORT_HEIGHT * 0.2,
    VIEWPORT_WIDTH * 0.5,
    VIEWPORT_HEIGHT * 0.5,
    VIEWPORT_WIDTH * 0.75,
  )
  vignette.addColorStop(0, 'rgba(15, 23, 42, 0)')
  vignette.addColorStop(1, 'rgba(15, 23, 42, 0.16)')
  context.fillStyle = vignette
  context.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT)
}

function drawCountryBorders(context: CanvasRenderingContext2D, borders: BorderRing[]) {
  if (borders.length === 0) {
    return
  }

  context.strokeStyle = 'rgba(203, 213, 225, 0.58)'
  context.lineWidth = 1
  context.beginPath()
  for (const ring of borders) {
    if (ring.length < 2) {
      continue
    }
    context.moveTo(ring[0].x, ring[0].y)
    for (let i = 1; i < ring.length; i += 1) {
      context.lineTo(ring[i].x, ring[i].y)
    }
  }
  context.stroke()
}

async function loadCountryBorders(): Promise<BorderRing[]> {
  const response = await fetch('/countries-110m.json')
  const topo = (await response.json()) as {
    objects: { countries: unknown }
  }
  const borders = mesh(
    topo as never,
    topo.objects.countries as never,
    (a: unknown, b: unknown) => a !== b,
  ) as Geometry

  if (borders.type !== 'MultiLineString') {
    return []
  }

  return projectBorderLines(borders)
}

function projectBorderLines(geometry: MultiLineString): BorderRing[] {
  return geometry.coordinates.map((line: number[][]) =>
    line.map(([lng, lat]: number[]) => latLngToWorldXY(lat, lng, WORLD_WIDTH, WORLD_HEIGHT)),
  )
}

function worldToViewport(
  worldX: number,
  worldY: number,
  camera: { x: number; y: number },
) {
  return {
    x: (worldX - camera.x) * CAMERA_ZOOM,
    y: (worldY - camera.y) * CAMERA_ZOOM,
  }
}

function drawTargetFlag(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  targetName: string,
  elapsedTime: number,
) {
  const pulse = 1 + Math.sin(elapsedTime * 6) * 0.18

  context.save()
  context.strokeStyle = 'rgba(250, 204, 21, 0.8)'
  context.lineWidth = 2
  context.beginPath()
  context.arc(x, y, 18 * pulse, 0, Math.PI * 2)
  context.stroke()

  context.fillStyle = '#facc15'
  context.beginPath()
  context.arc(x, y, 8, 0, Math.PI * 2)
  context.fill()

  context.strokeStyle = '#0f172a'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(x - 12, y)
  context.lineTo(x + 12, y)
  context.moveTo(x, y - 12)
  context.lineTo(x, y + 12)
  context.stroke()

  context.font = 'bold 16px Segoe UI, sans-serif'
  const textWidth = context.measureText(targetName).width
  const boxWidth = Math.max(140, textWidth + 26)
  const boxHeight = 28
  const boxX = x - boxWidth * 0.5
  const boxY = y - 48
  context.fillStyle = 'rgba(15, 23, 42, 0.9)'
  context.fillRect(boxX, boxY, boxWidth, boxHeight)
  context.strokeStyle = 'rgba(148, 163, 184, 0.7)'
  context.lineWidth = 1
  context.strokeRect(boxX, boxY, boxWidth, boxHeight)
  context.fillStyle = '#f8fafc'
  context.textAlign = 'center'
  context.fillText(targetName, x, boxY + 19)
  context.restore()
}

function drawDirectionArrow(
  context: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
) {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)

  const edgePadding = 56
  const centerX = VIEWPORT_WIDTH * 0.5
  const centerY = VIEWPORT_HEIGHT * 0.5
  const maxRadiusX = centerX - edgePadding
  const maxRadiusY = centerY - edgePadding
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  const scale = Math.min(
    Math.abs(maxRadiusX / (cosA === 0 ? 0.0001 : cosA)),
    Math.abs(maxRadiusY / (sinA === 0 ? 0.0001 : sinA)),
  )

  const arrowX = centerX + cosA * scale
  const arrowY = centerY + sinA * scale

  context.save()
  context.translate(arrowX, arrowY)
  context.rotate(angle)

  context.shadowColor = 'rgba(250, 204, 21, 0.6)'
  context.shadowBlur = 16
  context.fillStyle = '#fde047'
  context.strokeStyle = '#020617'
  context.lineWidth = 3
  context.beginPath()
  context.moveTo(22, 0)
  context.lineTo(-16, -12)
  context.lineTo(-5, 0)
  context.lineTo(-16, 12)
  context.closePath()
  context.fill()
  context.stroke()

  context.restore()
}

function drawHelicopter(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 1 | -1,
  mainRotorAngle: number,
  tailRotorAngle: number,
) {
  context.save()
  context.translate(x, y)
  context.scale(1.2 * facing, 1.2)

  // Layered shadow keeps helicopter visible on mixed terrain.
  context.shadowColor = 'rgba(0, 0, 0, 0.45)'
  context.shadowBlur = 9
  context.shadowOffsetX = 0
  context.shadowOffsetY = 3

  // Tail boom
  context.strokeStyle = '#1f2937'
  context.lineWidth = 4.5
  context.beginPath()
  context.moveTo(-6, 0)
  context.lineTo(-25, 0)
  context.stroke()

  // Tail fin
  const finGradient = context.createLinearGradient(-30, -6, -18, 6)
  finGradient.addColorStop(0, '#334155')
  finGradient.addColorStop(1, '#0f172a')
  context.fillStyle = finGradient
  context.beginPath()
  context.moveTo(-28, 0)
  context.lineTo(-22, -6)
  context.lineTo(-18, 0)
  context.lineTo(-22, 6)
  context.closePath()
  context.fill()

  // Skid rails
  context.strokeStyle = 'rgba(226, 232, 240, 0.88)'
  context.lineWidth = 1.9
  context.beginPath()
  context.moveTo(-11, 10)
  context.lineTo(12, 10)
  context.moveTo(-11, -10)
  context.lineTo(12, -10)
  context.stroke()

  // Fuselage
  const bodyGradient = context.createLinearGradient(-14, -10, 22, 10)
  bodyGradient.addColorStop(0, '#fb923c')
  bodyGradient.addColorStop(0.55, '#f97316')
  bodyGradient.addColorStop(1, '#c2410c')
  context.fillStyle = bodyGradient
  context.beginPath()
  context.moveTo(22, 0)
  context.quadraticCurveTo(12, -9, 0, -9)
  context.quadraticCurveTo(-13, -8, -16, 0)
  context.quadraticCurveTo(-13, 8, 0, 9)
  context.quadraticCurveTo(12, 9, 22, 0)
  context.closePath()
  context.fill()

  // Body highlight stripe
  const stripeGradient = context.createLinearGradient(-8, -2, 20, 2)
  stripeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
  stripeGradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.8)')
  stripeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.28)')
  context.fillStyle = stripeGradient
  context.beginPath()
  context.moveTo(-5, -1.2)
  context.quadraticCurveTo(8, -2.8, 18, -0.8)
  context.quadraticCurveTo(8, 1.1, -4, 0.7)
  context.closePath()
  context.fill()

  // Rescue stripe
  context.fillStyle = '#f8fafc'
  context.beginPath()
  context.moveTo(-10, 4.8)
  context.quadraticCurveTo(6, 3.7, 19, 5.1)
  context.quadraticCurveTo(6, 6.8, -9.2, 6.3)
  context.closePath()
  context.fill()

  // Red cross badge
  context.fillStyle = '#ef4444'
  context.fillRect(-4.2, -2.3, 5.2, 1.8)
  context.fillRect(-2.5, -4, 1.8, 5.2)

  // Cockpit glass
  const cockpitGradient = context.createLinearGradient(4, -6, 18, 6)
  cockpitGradient.addColorStop(0, 'rgba(224, 242, 254, 0.95)')
  cockpitGradient.addColorStop(1, 'rgba(56, 189, 248, 0.55)')
  context.fillStyle = cockpitGradient
  context.beginPath()
  context.moveTo(16, 0)
  context.quadraticCurveTo(10, -5.8, 2.5, -4.2)
  context.quadraticCurveTo(5, 0, 2.5, 4.2)
  context.quadraticCurveTo(10, 5.8, 16, 0)
  context.closePath()
  context.fill()

  // Cockpit reflection
  context.fillStyle = 'rgba(255, 255, 255, 0.35)'
  context.beginPath()
  context.ellipse(10.5, -2.4, 3.3, 1.5, -0.45, 0, Math.PI * 2)
  context.fill()

  // Crisp outline for readability.
  context.strokeStyle = '#111827'
  context.lineWidth = 1.8
  context.stroke()

  // Door line and rivet dots
  context.strokeStyle = 'rgba(15, 23, 42, 0.65)'
  context.lineWidth = 0.9
  context.beginPath()
  context.moveTo(-1, -7.2)
  context.lineTo(-1, 7.2)
  context.stroke()
  context.fillStyle = 'rgba(15, 23, 42, 0.45)'
  context.beginPath()
  context.arc(-8, -3, 0.9, 0, Math.PI * 2)
  context.arc(-5, 3, 0.9, 0, Math.PI * 2)
  context.arc(2, -3.5, 0.9, 0, Math.PI * 2)
  context.fill()

  // Rotor mast and hub
  context.fillStyle = '#e5e7eb'
  context.fillRect(-1.5, -11, 3, 8)
  context.beginPath()
  context.arc(0, -11, 2.5, 0, Math.PI * 2)
  context.fill()

  // Main rotor blur strip in side profile.
  context.save()
  context.translate(0, -11)
  context.fillStyle = 'rgba(15, 23, 42, 0.3)'
  context.beginPath()
  context.ellipse(0, 0, 24, 3.6, 0, 0, Math.PI * 2)
  context.fill()
  context.strokeStyle = 'rgba(203, 213, 225, 0.42)'
  context.lineWidth = 0.8
  context.stroke()

  // Rotor highlights as stretched streaks.
  context.rotate(mainRotorAngle)
  context.strokeStyle = 'rgba(248, 250, 252, 0.68)'
  context.lineWidth = 1
  context.beginPath()
  context.ellipse(0, 0, 20, 2.1, 0, -0.2, 0.2)
  context.ellipse(0, 0, 20, 2.1, 0, Math.PI - 0.2, Math.PI + 0.2)
  context.stroke()
  context.restore()

  // Tail rotor blur
  context.save()
  context.translate(-25, 0)
  context.fillStyle = 'rgba(15, 23, 42, 0.33)'
  context.beginPath()
  context.arc(0, 0, 4.5, 0, Math.PI * 2)
  context.fill()
  context.strokeStyle = 'rgba(203, 213, 225, 0.42)'
  context.lineWidth = 0.7
  context.stroke()

  context.rotate(tailRotorAngle)
  context.strokeStyle = 'rgba(248, 250, 252, 0.7)'
  context.lineWidth = 0.9
  context.beginPath()
  context.arc(0, 0, 3.5, -0.45, 0.45)
  context.arc(0, 0, 3.5, Math.PI - 0.45, Math.PI + 0.45)
  context.stroke()
  context.restore()

  // Navigation lights and underglow candy.
  const blink = 0.55 + 0.45 * Math.sin(mainRotorAngle * 0.12)
  context.shadowBlur = 10
  context.shadowOffsetX = 0
  context.shadowOffsetY = 0

  context.shadowColor = `rgba(239, 68, 68, ${0.55 * blink})`
  context.fillStyle = '#ef4444'
  context.beginPath()
  context.arc(20, -1.5, 1.6, 0, Math.PI * 2)
  context.fill()

  context.shadowColor = `rgba(34, 197, 94, ${0.55 * (1 - blink + 0.25)})`
  context.fillStyle = '#22c55e'
  context.beginPath()
  context.arc(-15, 1.5, 1.5, 0, Math.PI * 2)
  context.fill()

  context.shadowColor = 'rgba(56, 189, 248, 0.45)'
  const underGlow = context.createRadialGradient(1, 8, 0.5, 1, 8, 10)
  underGlow.addColorStop(0, 'rgba(125, 211, 252, 0.25)')
  underGlow.addColorStop(1, 'rgba(125, 211, 252, 0)')
  context.fillStyle = underGlow
  context.beginPath()
  context.ellipse(1, 8, 12, 3.5, 0, 0, Math.PI * 2)
  context.fill()

  context.restore()
}

