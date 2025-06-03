// src/constants/colors.ts - COMPLETE COLOR SYSTEM
export interface ColorPalette {
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textTertiary: string;
  
  // Background colors  
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  
  // Interactive colors
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string; // ✅ ADD MISSING ACCENT
  accentLight: string; // ✅ ADD MISSING ACCENT_LIGHT
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI elements  
  border: string;
  borderSecondary: string;
  shadow: string;
  overlay: string;
  notification: string;
  
  // ✅ ADD NESTED COLORS OBJECT THAT COMPONENTS EXPECT
  colors: {
    text: string;
    textSecondary: string;
    textTertiary: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
    success: string;
    warning: string;
    error: string;
    border: string;
  };
  
  // Drawing specific
  drawing: {
    canvas: string;
    grid: string;
    guideline: string;
    preview: string;
  };
}

// ✅ COMPLETE COLOR DEFINITIONS
const lightColors: ColorPalette = {
  // Text colors
  text: '#000000',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textTertiary: '#D1D5DB',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  card: '#FFFFFF',
  
  // Interactive colors
  primary: '#007AFF',
  secondary: '#5856D6',
  tertiary: '#FF9500',
  accent: '#007AFF', // ✅ ACCENT COLOR
  accentLight: '#E3F2FD', // ✅ ACCENT LIGHT
  
  // Status colors
  success: '#34C759',
  warning: '#FF9500', 
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // UI elements
  border: '#E5E5EA',
  borderSecondary: '#D1D1D6',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  notification: '#FF3B30',
  
  // ✅ NESTED COLORS OBJECT FOR COMPONENT COMPATIBILITY
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
    accent: '#007AFF',
    accentLight: '#E3F2FD',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    border: '#E5E5EA',
  },
  
  // Drawing specific
  drawing: {
    canvas: '#FFFFFF',
    grid: '#F0F0F0',
    guideline: '#E0E0E0',
    preview: '#F5F5F5',
  },
};

const darkColors: ColorPalette = {
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A', 
  textTertiary: '#52525B',
  
  // Background colors
  background: '#000000',
  backgroundSecondary: '#111111',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  card: '#1C1C1E',
  
  // Interactive colors
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  tertiary: '#FF9F0A',
  accent: '#0A84FF', // ✅ ACCENT COLOR
  accentLight: '#1E3A8A', // ✅ ACCENT LIGHT (DARKER IN DARK MODE)
  
  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  
  // UI elements
  border: '#38383A',
  borderSecondary: '#48484A',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  notification: '#FF453A',
  
  // ✅ NESTED COLORS OBJECT FOR COMPONENT COMPATIBILITY
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
    accent: '#0A84FF',
    accentLight: '#1E3A8A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    border: '#38383A',
  },
  
  // Drawing specific
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
    colors: lightColors.colors,
  },
  dark: {
    text: darkColors.text,
    background: darkColors.background,
    tint: darkColors.primary,
    tabIconDefault: darkColors.textMuted,
    tabIconSelected: darkColors.primary,
    colors: darkColors.colors,
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