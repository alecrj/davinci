const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for @/ path aliases in Metro
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/context': path.resolve(__dirname, 'src/context'),
  '@/constants': path.resolve(__dirname, 'src/constants'),
  '@/types': path.resolve(__dirname, 'src/types'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/data': path.resolve(__dirname, 'src/data'),
  '@/app': path.resolve(__dirname, 'app'),
};

// Ensure all extensions are supported
config.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js');

module.exports = config;