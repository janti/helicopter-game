export type Helicopter = {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  acceleration: number
  maxSpeed: number
  friction: number
}

export function createHelicopter(): Helicopter {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    acceleration: 760,
    maxSpeed: 320,
    friction: 3.8,
  }
}

export function updateHelicopter(
  helicopter: Helicopter,
  input: { up: boolean; down: boolean; left: boolean; right: boolean },
  deltaTime: number,
) {
  let dirX = 0
  let dirY = 0

  if (input.left) {
    dirX -= 1
  }
  if (input.right) {
    dirX += 1
  }
  if (input.up) {
    dirY -= 1
  }
  if (input.down) {
    dirY += 1
  }

  const length = Math.hypot(dirX, dirY)
  if (length > 0) {
    const normalX = dirX / length
    const normalY = dirY / length
    helicopter.vx += normalX * helicopter.acceleration * deltaTime
    helicopter.vy += normalY * helicopter.acceleration * deltaTime
  }

  const speed = Math.hypot(helicopter.vx, helicopter.vy)
  if (speed > helicopter.maxSpeed) {
    const ratio = helicopter.maxSpeed / speed
    helicopter.vx *= ratio
    helicopter.vy *= ratio
  }

  const frictionFactor = Math.max(0, 1 - helicopter.friction * deltaTime)
  helicopter.vx *= frictionFactor
  helicopter.vy *= frictionFactor

  // Prevent endless micro-drift from floating-point leftovers.
  if (Math.abs(helicopter.vx) < 0.5) {
    helicopter.vx = 0
  }
  if (Math.abs(helicopter.vy) < 0.5) {
    helicopter.vy = 0
  }

  helicopter.x += helicopter.vx * deltaTime
  helicopter.y += helicopter.vy * deltaTime

  if (Math.abs(helicopter.vx) > 0.01 || Math.abs(helicopter.vy) > 0.01) {
    helicopter.rotation = Math.atan2(helicopter.vy, helicopter.vx)
  }
}
