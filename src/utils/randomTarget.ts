import type { LocationTarget } from '../data/locations'
import type { DifficultyOption, TargetTypeOption } from '../types/game'

const difficultyRegions: Record<DifficultyOption, LocationTarget['region'][]> = {
  easy: ['europe'],
  medium: ['europe', 'africa', 'asia'],
  hard: ['europe', 'africa', 'asia', 'northAmerica', 'southAmerica'],
  extreme: [
    'europe',
    'africa',
    'asia',
    'northAmerica',
    'southAmerica',
    'oceania',
  ],
}

const tinyStateNames = new Set([
  'Andorra',
  'Liechtenstein',
  'Monaco',
  'San Marino',
  'Vatican City',
  'Malta',
  'Nauru',
  'Tuvalu',
  'Palau',
  'Marshall Islands',
  'Saint Kitts and Nevis',
  'Dominica',
  'Antigua and Barbuda',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Grenada',
  'Seychelles',
])

function isTinyStateTarget(location: LocationTarget): boolean {
  if (location.type !== 'country' && location.type !== 'city') {
    return false
  }
  const name = (location.nameEn ?? location.name).toLowerCase()
  return Array.from(tinyStateNames).some((tinyName) => tinyName.toLowerCase() === name)
}

export function pickRandomTarget(
  allLocations: LocationTarget[],
  targetType: TargetTypeOption,
  difficulty: DifficultyOption,
  excludeTinyStates: boolean,
  previousTargetId?: string,
): LocationTarget | null {
  const regions = new Set(difficultyRegions[difficulty])
  const filteredByRegion = allLocations.filter((location) =>
    regions.has(location.region),
  )

  const filteredByType =
    targetType === 'mixed'
      ? filteredByRegion
      : filteredByRegion.filter((location) => location.type === targetType)

  const filteredBySize = excludeTinyStates
    ? filteredByType.filter((location) => !isTinyStateTarget(location))
    : filteredByType

  if (filteredBySize.length === 0) {
    return null
  }

  const withoutPrevious = previousTargetId
    ? filteredBySize.filter((location) => location.id !== previousTargetId)
    : filteredBySize

  const pool = withoutPrevious.length > 0 ? withoutPrevious : filteredBySize
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}
