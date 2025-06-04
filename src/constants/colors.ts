// src/constants/colors.ts - COMPLETE FILE WITH ACCENT PROPERTIES

export interface ColorPalette {
  // ✅ COMPLETE NESTED COLORS OBJECT (what components access via colors.property)
  colors: {
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    
    // Background colors
    background: string;
    backgroundSecondary: string;
    surface: string;
    card: string;
    
    // Brand colors
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string; // ✅ FIXED: Added for colors.accent
    accentLight: string; // ✅ FIXED: Added for colors.accentLight
    
    // Semantic colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // UI colors
    border: string;
    borderSecondary: string;
    shadow: string;
    overlay: string;
    notification: string;
  };
  
  // ✅ TOP-LEVEL PROPERTIES (for theme.property access)
  text: string;
  textSecondary: string;
  textMuted: string;
  textTertiary: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  accentLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  borderSecondary: string;
  shadow: string;
  overlay: string;
  notification: string;
  
  // Drawing specific
  drawing: {
    canvas: string;
    grid: string;
    guideline: string;
    preview: string;
  };
}

// ✅ LIGHT THEME COLORS - Complete implementation
const lightColors: ColorPalette = {
  // ✅ NESTED COLORS OBJECT (accessed via colors.property)
  colors: {
    text: '#000000',
    textSecondary: '#6B7280',
    textTertiary: '#D1D5DB',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#FF9500',
    accent: '#007AFF', // ✅ FIXED: Now available as colors.accent
    accentLight: '#E3F2FD', // ✅ FIXED: Now available as colors.accentLight
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    border: '#E5E5EA',
    borderSecondary: '#D1D1D6',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF3B30',
  },
  
  // ✅ TOP-LEVEL PROPERTIES (same values, accessed via theme.property)
  text: '#000000',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textTertiary: '#D1D5DB',
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  card: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#5856D6',
  tertiary: '#FF9500',
  accent: '#007AFF',
  accentLight: '#E3F2FD',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  border: '#E5E5EA',
  borderSecondary: '#D1D1D6',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  notification: '#FF3B30',
  
  drawing: {
    canvas: '#FFFFFF',
    grid: '#F0F0F0',
    guideline: '#E0E0E0',
    preview: '#F5F5F5',
  },
};

// ✅ DARK THEME COLORS - Complete implementation
const darkColors: ColorPalette = {
  // ✅ NESTED COLORS OBJECT (accessed via colors.property)
  colors: {
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#52525B',
    background: '#000000',
    backgroundSecondary: '#111111',
    surface: '#1C1C1E',
    card: '#1C1C1E',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    tertiary: '#FF9F0A',
    accent: '#0A84FF', // ✅ FIXED: Now available as colors.accent
    accentLight: '#1E3A8A', // ✅ FIXED: Now available as colors.accentLight
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
    border: '#38383A',
    borderSecondary: '#48484A',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    notification: '#FF453A',
  },
  
  // ✅ TOP-LEVEL PROPERTIES (same values, accessed via theme.property)
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textTertiary: '#52525B',
  background: '#000000',
  backgroundSecondary: '#111111',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  card: '#1C1C1E',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  tertiary: '#FF9F0A',
  accent: '#0A84FF',
  accentLight: '#1E3A8A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  border: '#38383A',
  borderSecondary: '#48484A',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  notification: '#FF453A',
  
  drawing: {
    canvas: '#1C1C1E',
    grid: '#2C2C2E',
    guideline: '#38383A',
    preview: '#2C2C2E',
  },
};

// ✅ EXPORT COLORS AS EXPECTED BY THEME CONTEXT
export const COLORS = {
  light: lightColors,
  dark: darkColors,
};

// ✅ LEGACY COLORS EXPORT FOR BACKWARD COMPATIBILITY
export const Colors = {
  light: {
    text: lightColors.text,
    background: lightColors.background,
    tint: lightColors.primary,
    tabIconDefault: lightColors.textMuted,
    tabIconSelected: lightColors.primary,
  },
  dark: {
    text: darkColors.text,
    background: darkColors.background,
    tint: darkColors.primary,
    tabIconDefault: darkColors.textMuted,
    tabIconSelected: darkColors.primary,
  },
};

// ✅ DRAWING COLORS FOR DRAWING CONTEXT
export const DrawingColors = {
  default: lightColors.primary,
  black: '#000000',
  red: '#FF3B30',
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
  pink: '#FF2D92',
  yellow: '#FFCC00',
};