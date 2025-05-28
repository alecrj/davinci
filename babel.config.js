module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'expo-router/babel',
        'react-native-reanimated/plugin',
        [
          'module-resolver',
          {
            alias: {
              '@': './src',
              '@components': './src/components',
              '@hooks': './src/hooks',
              '@utils': './src/utils',
              '@types': './src/types',
              '@constants': './src/constants',
              '@services': './src/services',
              '@context': './src/context',
              '@assets': './assets',
            },
          },
        ],
      ],
    };
  };