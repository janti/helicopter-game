export type Camera = {
  x: number
  y: number
  width: number
  height: number
}

export function createCamera(width: number, height: number): Camera {
  return {
    x: 0,
    y: 0,
    width,
    height,
  }
}

export function updateCamera(
  camera: Camera,
  targetX: number,
  targetY: number,
  worldWidth: number,
  worldHeight: number,
  deltaTime: number,
) {
  const desiredX = clamp(targetX - camera.width * 0.5, 0, worldWidth - camera.width)
  const desiredY = clamp(targetY - camera.height * 0.5, 0, worldHeight - camera.height)

  const followSharpness = 7
  const alpha = 1 - Math.exp(-followSharpness * deltaTime)
  camera.x += (desiredX - camera.x) * alpha
  camera.y += (desiredY - camera.y) * alpha
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera,
) {
  return {
    screenX: worldX - camera.x,
    screenY: worldY - camera.y,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}
