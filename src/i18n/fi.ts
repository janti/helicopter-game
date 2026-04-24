const fi = {
  common: {
    score: 'Pisteet',
    time: 'Aikaa',
    targetType: 'Tyyppi',
    found: 'Löydetyt',
    difficulty: 'Vaikeus',
    endGame: 'Lopeta peli',
    noTarget: 'Ei kohdetta',
  },
  gameplay: {
    currentTarget: 'Etsittävä kohde',
    foundMessage: 'Löydetty: {name} +{score}',
    targetFoundFallback: 'Kohde löydetty +{score}',
    skippedMessage: 'Kohde skipattu -{penalty}',
    skipButton: 'Skippaa (-{penalty})',
    enableHintButton: 'Apunuoli päälle (-{penalty})',
    disableHintButton: 'Apunuoli pois',
    hintEnabledPenaltyMessage: 'Apunuoli otettu käyttöön -{penalty}',
  },
  menu: {
    ready: 'Valmis lentoon',
    title: 'Helikopteripeli',
    subtitle:
      'Aseta lennon parametrit, valitse haastetaso ja aloita maantieteen etsintätehtävä.',
    targetType: 'Kohdetyyppi',
    difficulty: 'Vaikeustaso',
    language: 'Kieli',
    gameTime: 'Peliaika',
    showHint: 'Näytä hint-suuntanuoli',
    excludeTinyStates: 'Piilota todella pienet valtiot (maat ja kaupungit)',
    startGame: 'Aloita peli',
    loadingData: 'Ladataan maailmandataa...',
  },
  gameOver: {
    title: 'Peli päättyi',
    subtitle: 'Aika loppui - hieno kierros.',
    finalScore: 'Loppupisteet',
    foundTargets: 'Löydetyt kohteet',
    targetType: 'Kohdetyyppi',
    playAgain: 'Pelaa uudelleen',
    backToMenu: 'Takaisin valikkoon',
  },
  highScores: {
    title: 'Parhaat pisteet',
    empty: 'Ei tallennettuja tuloksia vielä.',
    pointsAbbr: 'p',
  },
  labels: {
    targetType: {
      country: 'Maa',
      capital: 'Pääkaupunki',
      city: 'Kaupunki',
      mixed: 'Sekoitus',
    },
    difficulty: {
      easy: 'Helppo',
      medium: 'Keskitaso',
      hard: 'Vaikea',
      extreme: 'Extreme',
    },
    nearby: 'lähellä',
  },
} as const

export default fi
