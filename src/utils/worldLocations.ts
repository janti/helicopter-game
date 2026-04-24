import type { LocationTarget } from '../data/locations'

let cache: LocationTarget[] | null = null

export async function loadWorldLocations(): Promise<LocationTarget[]> {
  if (cache) {
    return cache
  }

  const response = await fetch('/world-locations.json')
  if (!response.ok) {
    throw new Error(`Failed to load world locations (${response.status})`)
  }

  const raw = (await response.json()) as unknown
  if (!Array.isArray(raw)) {
    throw new Error('Invalid world locations payload')
  }

  const filtered = raw.filter(isLocationTarget)
  cache = filtered
  return filtered
}

function isLocationTarget(value: unknown): value is LocationTarget {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<LocationTarget>
  const validType = candidate.type === 'country' || candidate.type === 'capital' || candidate.type === 'city'
  const validRegion =
    candidate.region === 'europe' ||
    candidate.region === 'africa' ||
    candidate.region === 'asia' ||
    candidate.region === 'northAmerica' ||
    candidate.region === 'southAmerica' ||
    candidate.region === 'oceania'

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    validType &&
    validRegion &&
    typeof candidate.lat === 'number' &&
    typeof candidate.lng === 'number'
  )
}
