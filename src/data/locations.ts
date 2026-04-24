export type LocationTarget = {
  id: string
  name: string
  nameFi?: string
  nameEn?: string
  flagEmoji?: string
  flagSvgUrl?: string
  type: 'country' | 'capital' | 'city'
  region:
    | 'europe'
    | 'africa'
    | 'asia'
    | 'northAmerica'
    | 'southAmerica'
    | 'oceania'
  lat: number
  lng: number
}
