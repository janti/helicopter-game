const en = {
  common: {
    score: 'Score',
    time: 'Time',
    targetType: 'Type',
    found: 'Found',
    difficulty: 'Difficulty',
    endGame: 'End game',
    noTarget: 'No target',
  },
  gameplay: {
    currentTarget: 'Current target',
    foundMessage: 'Found: {name} +{score}',
    targetFoundFallback: 'Target found +{score}',
    skippedMessage: 'Target skipped -{penalty}',
    skipButton: 'Skip (-{penalty})',
    enableHintButton: 'Enable hint arrow (-{penalty})',
    disableHintButton: 'Disable hint arrow',
    hintEnabledPenaltyMessage: 'Hint arrow enabled -{penalty}',
  },
  menu: {
    ready: 'Ready for takeoff',
    title: 'Helicopter Game',
    subtitle:
      'Set flight parameters, choose challenge level and start the geography mission.',
    targetType: 'Target type',
    difficulty: 'Difficulty',
    language: 'Language',
    gameTime: 'Game time',
    showHint: 'Show direction hint arrow',
    excludeTinyStates: 'Hide very small states (countries and cities)',
    startGame: 'Start game',
    loadingData: 'Loading world data...',
  },
  gameOver: {
    title: 'Game over',
    subtitle: 'Time is up - great run.',
    finalScore: 'Final score',
    foundTargets: 'Found targets',
    targetType: 'Target type',
    playAgain: 'Play again',
    backToMenu: 'Back to menu',
  },
  highScores: {
    title: 'High scores',
    empty: 'No saved scores yet.',
    pointsAbbr: 'pts',
  },
  labels: {
    targetType: {
      country: 'Country',
      capital: 'Capital',
      city: 'City',
      mixed: 'Mixed',
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      extreme: 'Extreme',
    },
    nearby: 'nearby',
  },
} as const

export default en
