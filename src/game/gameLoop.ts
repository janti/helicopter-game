export type FrameInfo = {
  deltaTime: number
  elapsedTime: number
}

type FrameCallback = (frame: FrameInfo) => void

export function createGameLoop(onFrame: FrameCallback) {
  let animationId: number | null = null
  let previousTime = 0
  let elapsedTime = 0
  const maxDeltaTime = 0.05 // clamp to avoid huge jumps after tab switch

  const frame = (timestamp: number) => {
    if (previousTime === 0) {
      previousTime = timestamp
    }

    const rawDelta = (timestamp - previousTime) / 1000
    const deltaTime = Math.min(rawDelta, maxDeltaTime)
    previousTime = timestamp
    elapsedTime += deltaTime

    onFrame({ deltaTime, elapsedTime })
    animationId = requestAnimationFrame(frame)
  }

  return {
    start() {
      if (animationId !== null) {
        return
      }

      previousTime = 0
      elapsedTime = 0
      animationId = requestAnimationFrame(frame)
    },
    stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },
  }
}
