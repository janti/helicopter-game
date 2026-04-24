import type { LocationTarget } from '../data/locations'
import type { LanguageOption } from '../types/game'

const finnishNameOverrides: Record<string, string> = {
  // Capitals and major cities (common exonyms in Finnish)
  Athens: 'Ateena',
  Berlin: 'Berliini',
  Brussels: 'Bryssel',
  Copenhagen: 'Kööpenhamina',
  Dublin: 'Dublin',
  Edinburgh: 'Edinburgh',
  Geneva: 'Geneve',
  Hamburg: 'Hampuri',
  Kyiv: 'Kiova',
  Lisbon: 'Lissabon',
  London: 'Lontoo',
  Luxembourg: 'Luxemburg',
  Madrid: 'Madrid',
  Manchester: 'Manchester',
  Milan: 'Milano',
  Minsk: 'Minsk',
  Monaco: 'Monaco',
  Moscow: 'Moskova',
  Munich: 'München',
  Naples: 'Napoli',
  Oslo: 'Oslo',
  Paris: 'Pariisi',
  Prague: 'Praha',
  Reykjavik: 'Reykjavik',
  Riga: 'Riika',
  Rome: 'Rooma',
  Rotterdam: 'Rotterdam',
  Sarajevo: 'Sarajevo',
  Seville: 'Sevilla',
  Skopje: 'Skopje',
  Stockholm: 'Tukholma',
  Tallinn: 'Tallinna',
  Tirana: 'Tirana',
  Valencia: 'Valencia',
  Vienna: 'Wien',
  Vilnius: 'Vilna',
  Warsaw: 'Varsova',
  Zagreb: 'Zagreb',
  'New York City': 'New York',
  Istanbul: 'Istanbul',
  'Ho Chi Minh City': 'Ho Tši Minhin kaupunki',
  Beijing: 'Peking',
  Seoul: 'Soul',
  Tokyo: 'Tokio',
  Cairo: 'Kairo',
  Algiers: 'Alger',
  'United Kingdom': 'Iso Britannia',
  'City of San Marino': 'San Marino',
  'City of Victoria': 'Victoria',
  'Republic of the Congo': 'Kongon tasavalta',
  Bucharest: 'Bukarest',
  Belgrade: 'Belgrad',
  Florence: 'Firenze',
  Venice: 'Venetsia',
  Cologne: 'Köln',
  Nuremberg: 'Nürnberg',
  'Saint Petersburg': 'Pietari',
}

export function getLocalizedLocationName(
  location: LocationTarget,
  language: LanguageOption,
) {
  if (language === 'fi') {
    const sourceName = location.nameEn ?? location.name
    const candidate = finnishNameOverrides[sourceName] ?? location.nameFi ?? sourceName
    return normalizeFinnishName(candidate)
  }
  return location.nameEn ?? location.name
}

function normalizeFinnishName(name: string): string {
  // Drop overly formal "City of ..." prefixes in Finnish UI labels.
  if (name.startsWith('City of ')) {
    return name.replace('City of ', '')
  }
  return name
}
