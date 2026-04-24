# Helicopter Game

Selainpeli, jossa lennät helikopterilla maailmankartan päällä ja etsit annettuja kohteita aikaa vastaan.

## Projektin kuvaus

Pelaaja saa aina yhden kohteen kerrallaan (maa, pääkaupunki, kaupunki tai sekoitus) ja yrittää löytää sen kartalta mahdollisimman nopeasti. Kierros päättyy, kun aika loppuu tai pelaaja lopettaa pelin.

## Ominaisuudet

- reaaliaikainen heli-ohjaus kartalla (`WASD` tai nuolinäppäimet)
- kohteet: maat, pääkaupungit, kaupungit tai sekoitus
- vaikeustasot: `easy`, `medium`, `hard`, `extreme`
- peliaika valittavissa: 60 / 120 / 180 sekuntia
- kielivalinta: suomi / englanti
- vihjejärjestelmä (nuolivihje + kohdemerkki lähellä kohdetta)
- pisteytys, skip-rangaistus ja vihjeen käytön pistemenetys
- highscore-lista `localStorage`-tallennuksella

## Ohjaimet

- liiku: `W` `A` `S` `D` tai nuolinäppäimet
- valikosta valitaan asetukset ennen kierrosta
- pelin aikana voi:
  - ottaa vihjeen päälle / pois
  - skipata nykyisen kohteen
  - lopettaa kierroksen heti

## Teknologiat

- React + Vite + TypeScript
- HTML5 Canvas
- Tailwind CSS
- topojson-client (valtiorajojen piirto)
- localStorage (highscores)

## Projektin rakenne (oleellisimmat)

- `src/components/` - UI-näkymä, valikko, pelinäkymä ja game over
- `src/game/` - pelilooppi, kamera, helikopterin fysiikka ja pisteytys
- `src/utils/` - datan lataus, projektiot ja apufunktiot
- `src/i18n/` - kielitekstit (fi/en)
- `public/world-locations.json` - kohdedata
- `public/countries-110m.json` - valtionrajojen geometria

## Kartta-aineistojen lataus

Karttatiedostoja ei pideta gitissa. Lataa ne paikallisesti `public/`-kansioon.

Pakolliset tiedostot:

- `public/countries-110m.json`
  - lataus: [world-atlas countries-110m.json](https://unpkg.com/world-atlas@2/countries-110m.json)
- `public/world-locations.json`
  - voit luoda tiedoston skriptilla:
    1. lataa REST Countries -data tiedostoon `tmp-restcountries.json` osoitteesta [restcountries.com/v3.1/all](https://restcountries.com/v3.1/all)
    2. aja `node scripts/generate-world-locations.mjs`

Taustakartta:

- `public/world-satellite-clean.jpg` on pelin kayttama taustakartta.
- vaihtoehtoiset karttakuvat (esim. `world-satellite-no-grid.png`, `world-equirectangular-hq.jpg`) voi ladata vapaasti valitsemastasi lahteesta, kunhan nimet vastaavat projektin odottamia tiedostonimia.

## Kehitys lokaalisti

```bash
npm install
npm run dev
```

## Skriptit

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run build` tuottaa tuotantoversion `dist`-hakemistoon.

## Julkaisun tarkistuslista

- `npm run lint` menee läpi ilman virheitä
- `npm run build` onnistuu
- peli toimii selaimessa build-versiona (`npm run preview`)

---

## English

Browser game where you fly a helicopter over a world map and find given targets against the clock.

## Project Overview

The player gets one target at a time (country, capital, city, or mixed) and tries to locate it on the map as quickly as possible. A run ends when the timer reaches zero or the player ends the game manually.

## Features

- real-time helicopter controls on the map (`WASD` or arrow keys)
- target types: countries, capitals, cities, or mixed
- difficulty levels: `easy`, `medium`, `hard`, `extreme`
- selectable game time: 60 / 120 / 180 seconds
- language selection: Finnish / English
- hint system (direction arrow + target marker near the target)
- scoring, skip penalty, and hint-use score penalty
- high score list persisted in `localStorage`

## Controls

- move: `W` `A` `S` `D` or arrow keys
- game settings are selected from the main menu before each run
- during gameplay you can:
  - toggle hint on / off
  - skip the current target
  - end the run immediately

## Technologies

- React + Vite + TypeScript
- HTML5 Canvas
- Tailwind CSS
- topojson-client (country border rendering)
- localStorage (high scores)

## Project Structure (Key Parts)

- `src/components/` - UI views, main menu, gameplay view, and game over screen
- `src/game/` - game loop, camera, helicopter physics, and scoring
- `src/utils/` - data loading, projection utilities, and helper functions
- `src/i18n/` - translations (fi/en)
- `public/world-locations.json` - target dataset
- `public/countries-110m.json` - country border geometry

## Downloading Map Assets

Map assets are not stored in git. Download them locally into `public/`.

Required files:

- `public/countries-110m.json`
  - source: [world-atlas countries-110m.json](https://unpkg.com/world-atlas@2/countries-110m.json)
- `public/world-locations.json`
  - you can generate this file with the script:
    1. download REST Countries data into `tmp-restcountries.json` from [restcountries.com/v3.1/all](https://restcountries.com/v3.1/all)
    2. run `node scripts/generate-world-locations.mjs`

Background map:

- `public/world-satellite-clean.jpg` is the active in-game background.
- optional map images (for example `world-satellite-no-grid.png`, `world-equirectangular-hq.jpg`) can be downloaded from your preferred source, as long as the filenames match what the project expects.

## Local Development

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run build` outputs the production build into the `dist` directory.

## Release Checklist

- `npm run lint` passes without errors
- `npm run build` succeeds
- game works in production preview (`npm run preview`)
