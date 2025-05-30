module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@': './',
              '@/components': './src/components',
              '@/context': './src/context',
              '@/hooks': './src/hooks',
              '@/utils': './src/utils',
              '@/types': './src/types',
              '@/constants': './src/constants',
              '@/services': './src/services',
              '@/data': './src/data',
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          },
        ],
        'react-native-reanimated/plugin', // Must be last
      ],
    };
  };