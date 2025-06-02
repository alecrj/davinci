// src/utils/colors/gradientHelper.ts
import { ColorValue } from 'react-native';

/**
 * Type-safe helper to convert string arrays to LinearGradient-compatible readonly arrays
 */
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

export const createGradient = (colors: string[]): GradientColors => {
  if (colors.length < 2) {
    throw new Error('Gradient must have at least 2 colors');
  }
  return colors as GradientColors;
};

/**
 * Common gradient color combinations for the app
 */
export const GRADIENTS = {
  primary: createGradient(['#007AFF', '#5856D6']),
  secondary: createGradient(['#FF9500', '#FF6B35']),
  success: createGradient(['#34C759', '#30D158']),
  warning: createGradient(['#FF9500', '#FFD60A']),
  error: createGradient(['#FF3B30', '#FF6961']),
  
  // Skill level gradients
  beginner: createGradient(['#34C759', '#30D158']),
  intermediate: createGradient(['#FF9500', '#FFD60A']),
  advanced: createGradient(['#FF3B30', '#FF6961']),
  
  // Theme-aware gradients
  light: {
    card: createGradient(['#FFFFFF', '#F2F2F7']),
    surface: createGradient(['#F2F2F7', '#E5E5EA']),
  },
  dark: {
    card: createGradient(['#1C1C1E', '#2C2C2E']),
    surface: createGradient(['#2C2C2E', '#3A3A3C']),
  },
} as const;

/**
 * Helper to get theme-aware gradient colors
 */
export const getThemeGradient = (isDark: boolean, type: 'card' | 'surface'): GradientColors => {
  return isDark ? GRADIENTS.dark[type] : GRADIENTS.light[type];
};

/**
 * Helper to safely convert any color array to gradient format
 */
export const safeGradient = (colors: string[] | readonly string[]): GradientColors => {
  const colorArray = Array.isArray(colors) ? colors : [colors[0], colors[1]];
  if (colorArray.length < 2) {
    return createGradient(['#007AFF', '#5856D6']); // fallback gradient
  }
  return createGradient(colorArray);
};