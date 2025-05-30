module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              // Main source directory
              '@': './src',
              
              // Specific directory aliases for better resolution
              '@/components': './src/components',
              '@/context': './src/context',
              '@/constants': './src/constants',
              '@/types': './src/types',
              '@/utils': './src/utils',
              '@/hooks': './src/hooks',
              '@/services': './src/services',
              '@/data': './src/data',
              
              // App directory for navigation
              '@/app': './app',
            },
            extensions: [
              '.ios.ts',
              '.android.ts',
              '.native.ts',
              '.ts',
              '.ios.tsx',
              '.android.tsx',
              '.native.tsx',
              '.tsx',
              '.ios.js',
              '.android.js',
              '.native.js',
              '.js',
              '.jsx',
              '.json',
            ],
          },
        ],
      ],
    };
  };