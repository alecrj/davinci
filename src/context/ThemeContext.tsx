import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Theme interface based on actual usage in components
export interface Theme {
  // Background colors
  background: string;
  backgroundSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Accent and interactive colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // UI elements
  border: string;
  borderLight: string;
  
  // Drawing specific
  drawingCanvas: string;
  drawingStroke: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Overlay and shadows
  overlay: string;
  shadow: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Light theme - optimized for confidence and creativity
const lightTheme: Theme = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  
  // Text
  text: '#1D1D1F',
  textSecondary: '#515154',
  textTertiary: '#8E8E93',
  
  // Accents - DaVinci inspired purple-blue
  accent: '#6366F1',
  accentLight: '#A5B4FC',
  accentDark: '#4338CA',
  
  // Borders
  border: '#E5E5E7',
  borderLight: '#F2F2F7',
  
  // Drawing
  drawingCanvas: '#FEFEFE',
  drawingStroke: '#6366F1',
  
  // Status
  success: '#34D399',
  warning: '#FBBF24',
  error: '#EF4444',
  
  // Effects
  overlay: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark theme - elegant and comfortable for extended use
const darkTheme: Theme = {
  // Backgrounds
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  
  // Accents - Brighter for dark mode
  accent: '#818CF8',
  accentLight: '#C7D2FE',
  accentDark: '#6366F1',
  
  // Borders
  border: '#38383A',
  borderLight: '#2C2C2E',
  
  // Drawing
  drawingCanvas: '#1C1C1E',
  drawingStroke: '#818CF8',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  
  // Effects
  overlay: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  
  // Determine if we should use dark theme
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  
  // Select theme based on mode
  const theme = isDark ? darkTheme : lightTheme;
  
  const contextValue: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export theme objects for testing/development
export { lightTheme, darkTheme };