export function latLngToWorldXY(
  lat: number,
  lng: number,
  worldWidth: number,
  worldHeight: number,
) {
  const x = ((lng + 180) / 360) * worldWidth
  const y = ((90 - lat) / 180) * worldHeight

  return { x, y }
}
