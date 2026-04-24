import fs from 'node:fs'

const inputPath = 'tmp-restcountries.json'
const outputPath = 'public/world-locations.json'

const restCountries = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

const majorCities = [
  { name: 'Shanghai', region: 'asia', lat: 31.2304, lng: 121.4737 },
  { name: 'Chongqing', region: 'asia', lat: 29.563, lng: 106.5516 },
  { name: 'Guangzhou', region: 'asia', lat: 23.1291, lng: 113.2644 },
  { name: 'Shenzhen', region: 'asia', lat: 22.5431, lng: 114.0579 },
  { name: 'Mumbai', region: 'asia', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', region: 'asia', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', region: 'asia', lat: 12.9716, lng: 77.5946 },
  { name: 'Karachi', region: 'asia', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', region: 'asia', lat: 31.5497, lng: 74.3436 },
  { name: 'Istanbul', region: 'asia', lat: 41.0082, lng: 28.9784 },
  { name: 'Osaka', region: 'asia', lat: 34.6937, lng: 135.5023 },
  { name: 'Yokohama', region: 'asia', lat: 35.4437, lng: 139.638 },
  { name: 'Busan', region: 'asia', lat: 35.1796, lng: 129.0756 },
  { name: 'Bangkok', region: 'asia', lat: 13.7563, lng: 100.5018 },
  { name: 'Ho Chi Minh City', region: 'asia', lat: 10.8231, lng: 106.6297 },
  { name: 'Dhaka', region: 'asia', lat: 23.8103, lng: 90.4125 },
  { name: 'Jakarta', region: 'asia', lat: -6.2088, lng: 106.8456 },
  { name: 'Manila', region: 'asia', lat: 14.5995, lng: 120.9842 },
  { name: 'Kolkata', region: 'asia', lat: 22.5726, lng: 88.3639 },
  { name: 'Chennai', region: 'asia', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', region: 'asia', lat: 17.385, lng: 78.4867 },
  { name: 'Tianjin', region: 'asia', lat: 39.3434, lng: 117.3616 },
  { name: 'Wuhan', region: 'asia', lat: 30.5928, lng: 114.3055 },
  { name: 'Chengdu', region: 'asia', lat: 30.5728, lng: 104.0668 },
  { name: 'Nanjing', region: 'asia', lat: 32.0603, lng: 118.7969 },
  { name: 'Sao Paulo', region: 'southAmerica', lat: -23.5558, lng: -46.6396 },
  { name: 'Rio de Janeiro', region: 'southAmerica', lat: -22.9068, lng: -43.1729 },
  { name: 'Belo Horizonte', region: 'southAmerica', lat: -19.9167, lng: -43.9345 },
  { name: 'Curitiba', region: 'southAmerica', lat: -25.4284, lng: -49.2733 },
  { name: 'Guayaquil', region: 'southAmerica', lat: -2.1709, lng: -79.9224 },
  { name: 'Medellin', region: 'southAmerica', lat: 6.2442, lng: -75.5812 },
  { name: 'Cali', region: 'southAmerica', lat: 3.4516, lng: -76.532 },
  { name: 'Santa Cruz de la Sierra', region: 'southAmerica', lat: -17.8146, lng: -63.1561 },
  { name: 'Rosario', region: 'southAmerica', lat: -32.9442, lng: -60.6505 },
  { name: 'Cordoba', region: 'southAmerica', lat: -31.4201, lng: -64.1888 },
  { name: 'Santiago', region: 'southAmerica', lat: -33.4489, lng: -70.6693 },
  { name: 'Valparaiso', region: 'southAmerica', lat: -33.0472, lng: -71.6127 },
  { name: 'New York City', region: 'northAmerica', lat: 40.7128, lng: -74.006 },
  { name: 'Los Angeles', region: 'northAmerica', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', region: 'northAmerica', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', region: 'northAmerica', lat: 29.7604, lng: -95.3698 },
  { name: 'Toronto', region: 'northAmerica', lat: 43.6532, lng: -79.3832 },
  { name: 'Montreal', region: 'northAmerica', lat: 45.5017, lng: -73.5673 },
  { name: 'Vancouver', region: 'northAmerica', lat: 49.2827, lng: -123.1207 },
  { name: 'Monterrey', region: 'northAmerica', lat: 25.6866, lng: -100.3161 },
  { name: 'Guadalajara', region: 'northAmerica', lat: 20.6597, lng: -103.3496 },
  { name: 'Tijuana', region: 'northAmerica', lat: 32.5149, lng: -117.0382 },
  { name: 'Leon', region: 'northAmerica', lat: 21.122, lng: -101.684 },
  { name: 'Paris', region: 'europe', lat: 48.8566, lng: 2.3522 },
  { name: 'London', region: 'europe', lat: 51.5074, lng: -0.1278 },
  { name: 'Berlin', region: 'europe', lat: 52.52, lng: 13.405 },
  { name: 'Madrid', region: 'europe', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', region: 'europe', lat: 41.3874, lng: 2.1686 },
  { name: 'Milan', region: 'europe', lat: 45.4642, lng: 9.19 },
  { name: 'Naples', region: 'europe', lat: 40.8518, lng: 14.2681 },
  { name: 'Hamburg', region: 'europe', lat: 53.5511, lng: 9.9937 },
  { name: 'Munich', region: 'europe', lat: 48.1351, lng: 11.582 },
  { name: 'Lyon', region: 'europe', lat: 45.764, lng: 4.8357 },
  { name: 'Manchester', region: 'europe', lat: 53.4808, lng: -2.2426 },
  { name: 'Birmingham', region: 'europe', lat: 52.4862, lng: -1.8904 },
  { name: 'St Petersburg', region: 'europe', lat: 59.9311, lng: 30.3609 },
  { name: 'Moscow', region: 'europe', lat: 55.7558, lng: 37.6173 },
  { name: 'Warsaw', region: 'europe', lat: 52.2297, lng: 21.0122 },
  { name: 'Bucharest', region: 'europe', lat: 44.4268, lng: 26.1025 },
  { name: 'Lagos', region: 'africa', lat: 6.5244, lng: 3.3792 },
  { name: 'Kinshasa', region: 'africa', lat: -4.4419, lng: 15.2663 },
  { name: 'Johannesburg', region: 'africa', lat: -26.2041, lng: 28.0473 },
  { name: 'Cape Town', region: 'africa', lat: -33.9249, lng: 18.4241 },
  { name: 'Casablanca', region: 'africa', lat: 33.5731, lng: -7.5898 },
  { name: 'Alexandria', region: 'africa', lat: 31.2001, lng: 29.9187 },
  { name: 'Kano', region: 'africa', lat: 12.0022, lng: 8.592 },
  { name: 'Ibadan', region: 'africa', lat: 7.3775, lng: 3.947 },
  { name: 'Dar es Salaam', region: 'africa', lat: -6.7924, lng: 39.2083 },
  { name: 'Luanda', region: 'africa', lat: -8.8383, lng: 13.2344 },
  { name: 'Nairobi', region: 'africa', lat: -1.2921, lng: 36.8219 },
  { name: 'Addis Ababa', region: 'africa', lat: 8.9806, lng: 38.7578 },
  { name: 'Abidjan', region: 'africa', lat: 5.36, lng: -4.0083 },
  { name: 'Accra', region: 'africa', lat: 5.6037, lng: -0.187 },
  { name: 'Khartoum', region: 'africa', lat: 15.5007, lng: 32.5599 },
  { name: 'Sydney', region: 'oceania', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', region: 'oceania', lat: -37.8136, lng: 144.9631 },
  { name: 'Brisbane', region: 'oceania', lat: -27.4698, lng: 153.0251 },
  { name: 'Perth', region: 'oceania', lat: -31.9505, lng: 115.8605 },
  { name: 'Auckland', region: 'oceania', lat: -36.8509, lng: 174.7645 },
  { name: 'Adelaide', region: 'oceania', lat: -34.9285, lng: 138.6007 },
]

function mapRegion(region, subregion) {
  if (region === 'Europe') return 'europe'
  if (region === 'Africa') return 'africa'
  if (region === 'Asia') return 'asia'
  if (region === 'Oceania') return 'oceania'
  if (region === 'Americas') return subregion?.includes('South') ? 'southAmerica' : 'northAmerica'
  return null
}

function safeSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const countries = []
const capitals = []

for (const country of restCountries) {
  const region = mapRegion(country.region, country.subregion)
  const code = country.cca3?.toLowerCase()
  const name = country.name?.common
  const latlng = country.latlng
  if (!region || !code || !name || !Array.isArray(latlng) || latlng.length < 2) {
    continue
  }

  countries.push({
    id: `country-${code}`,
    name,
    nameEn: name,
    nameFi: country.translations?.fin?.common ?? name,
    flagEmoji: country.flag,
    flagSvgUrl: country.flags?.svg,
    type: 'country',
    region,
    lat: latlng[0],
    lng: latlng[1],
  })

  const capital = country.capital?.[0]
  const capitalLatLng = country.capitalInfo?.latlng
  if (capital && Array.isArray(capitalLatLng) && capitalLatLng.length >= 2) {
    capitals.push({
      id: `capital-${code}-${safeSlug(capital)}`,
      name: capital,
      nameEn: capital,
      nameFi: capital,
      type: 'capital',
      region,
      lat: capitalLatLng[0],
      lng: capitalLatLng[1],
    })
  }
}

const capitalNames = new Set(capitals.map((item) => item.name.toLowerCase()))
const cityTargets = majorCities
  .filter((city) => !capitalNames.has(city.name.toLowerCase()))
  .map((city) => ({
    id: `city-${safeSlug(city.name)}`,
    name: city.name,
    nameEn: city.name,
    nameFi: city.name,
    type: 'city',
    region: city.region,
    lat: city.lat,
    lng: city.lng,
  }))

const all = [...countries, ...capitals, ...cityTargets]
all.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))

fs.writeFileSync(outputPath, JSON.stringify(all, null, 2))
console.log(`Wrote ${all.length} locations to ${outputPath}`)
