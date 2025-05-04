module.exports = function (api) {
  api.cache(true);
  return {
    // ÆNDRING: 'babel-preset-expo' er nu inde i et array med et options-objekt
    presets: [
      ['babel-preset-expo', { unstable_transformImportMeta: true }]
    ],
    plugins: [
      // '@babel/plugin-proposal-export-namespace-from', // Denne er deprecated og sandsynligvis fjernet af `expo install --fix`. Lad den være ude, medmindre du specifikt har brug for den og ved, hvad den gør.
      'react-native-reanimated/plugin', // Reanimated skal stadig være den sidste plugin
    ],
  };
};