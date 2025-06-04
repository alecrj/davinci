import { ColorValue } from 'react-native';

// ✅ FIXED: Proper gradient colors type definition
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

/**
 * ✅ FIXED: Properly convert string array to GradientColors tuple with safe type conversion
 * Ensures LinearGradient receives the correct readonly tuple type
 */
export function ensureGradientColors(colors: string[]): GradientColors {
  if (colors.length < 2) {
    // Fallback to default gradient if insufficient colors
    return ['#007AFF', '#5856D6'] as const;
  }
  
  // ✅ FIXED: Use type assertion through unknown to avoid type mismatch error
  return colors as unknown as GradientColors;
}

/**
 * ✅ LEGACY SUPPORT: Keep existing createGradient function for compatibility
 */
export function createGradient(colors: string[]): GradientColors {
  return ensureGradientColors(colors);
}

/**
 * Get predefined gradient by name
 */
export function getGradient(name: string): GradientColors {
  const gradients: Record<string, GradientColors> = {
    primary: ['#007AFF', '#5856D6'] as const,
    success: ['#34C759', '#30D158'] as const,
    warning: ['#FF9500', '#FF9F0A'] as const,
    error: ['#FF3B30', '#FF453A'] as const,
    info: ['#5AC8FA', '#64D2FF'] as const,
    purple: ['#AF52DE', '#BF5AF2'] as const,
    pink: ['#FF2D92', '#FF375F'] as const,
    blue: ['#007AFF', '#0A84FF'] as const,
    green: ['#28CD41', '#32D74B'] as const,
    orange: ['#FF9500', '#FF9F0A'] as const,
    red: ['#FF3B30', '#FF453A'] as const,
    gray: ['#8E8E93', '#98989D'] as const,
    dark: ['#1C1C1E', '#2C2C2E'] as const,
    light: ['#F2F2F7', '#FFFFFF'] as const,
  };

  return gradients[name] || gradients.primary;
}

/**
 * Create a gradient with opacity
 */
export function createGradientWithOpacity(colors: string[], opacity: number = 1): GradientColors {
  const opacityColors = colors.map(color => {
    // Convert hex to rgba if needed
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  });
  
  return ensureGradientColors(opacityColors);
}

/**
 * Create themed gradient based on current theme
 */
export function createThemedGradient(
  lightColors: string[], 
  darkColors: string[], 
  isDark: boolean
): GradientColors {
  return ensureGradientColors(isDark ? darkColors : lightColors);
}

/**
 * Utility gradients for common UI elements
 */
export const commonGradients = {
  primaryButton: ['#007AFF', '#5856D6'] as const,
  successButton: ['#34C759', '#30D158'] as const,
  warningButton: ['#FF9500', '#FF9F0A'] as const,
  errorButton: ['#FF3B30', '#FF453A'] as const,
  cardBackground: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const,
  progressBar: ['#007AFF', '#5856D6'] as const,
  achievement: ['#FFD700', '#FFA500'] as const,
  celebration: ['#FF6B6B', '#4ECDC4'] as const,
  magic: ['#667eea', '#764ba2'] as const,
  transformation: ['#f093fb', '#f5576c'] as const,
} as const;

export default {
  ensureGradientColors,
  createGradient,
  getGradient,
  createGradientWithOpacity,
  createThemedGradient,
  commonGradients,
};