// src/utils/colors/gradientHelper.ts - FIXED GRADIENT TYPE CONVERSION

import { ColorValue } from 'react-native';
import { GradientColors } from '@/types/drawing';

// ✅ SAFE GRADIENT COLOR CONVERSION
export const createGradientColors = (colors: string[]): GradientColors => {
  // Ensure we have at least 2 colors
  if (colors.length < 2) {
    return ['#007AFF', '#5856D6'] as const;
  }
  
  // Convert to readonly tuple type
  return [colors[0] as ColorValue, colors[1] as ColorValue, ...colors.slice(2) as ColorValue[]] as const;
};

// ✅ SAFE CONVERSION FROM ANY ARRAY
export const ensureGradientColors = (colors: any): GradientColors => {
  if (Array.isArray(colors) && colors.length >= 2) {
    return createGradientColors(colors.map(c => String(c)));
  }
  
  // Default gradient
  return ['#007AFF', '#5856D6'] as const;
};

// ✅ PREDEFINED GRADIENT SETS
export const gradientPresets = {
  primary: ['#007AFF', '#5856D6'] as const,
  success: ['#34C759', '#30D158'] as const,
  warning: ['#FF9500', '#FF9F0A'] as const,
  error: ['#FF3B30', '#FF453A'] as const,
  purple: ['#5856D6', '#5E5CE6'] as const,
  blue: ['#007AFF', '#0A84FF'] as const,
  red: ['#FF3B30', '#FF453A'] as const,
  green: ['#34C759', '#30D158'] as const,
  orange: ['#FF9500', '#FF9F0A'] as const,
  pink: ['#FF2D92', '#FF6EC7'] as const,
} as const;

// ✅ HELPER TO GET GRADIENT BY NAME
export const getGradient = (name: keyof typeof gradientPresets): GradientColors => {
  return gradientPresets[name];
};