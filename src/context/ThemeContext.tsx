import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define complete color palette
const Colors = {
  light: {
    // Text colors
    text: '#11181C',
    textSecondary: '#687076',
    textMuted: '#8E8E93',
    textTertiary: '#8E8E93',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    surface: '#F2F2F7',
    card: '#FFFFFF',
    
    // Interactive colors
    tint: '#007AFF',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#007AFF',
    accentLight: '#007AFF20',
    
    // Status colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Navigation colors
    tabIconDefault: '#687076',
    tabIconSelected: '#007AFF',
    tabBarBackground: '#FFFFFF',
    
    // Border and separator colors
    border: '#C6C6C8',
    separator: '#E5E5EA',
    
    // Drawing specific
    drawingCanvas: '#FFFFFF',
    
    // Drawing colors (nested object)
    drawing: {
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      canvas: '#FFFFFF',
      grid: '#F2F2F7',
    },
  },
  
  dark: {
    // Text colors
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textMuted: '#636366',
    textTertiary: '#636366',
    
    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    surface: '#1C1C1E',
    card: '#1C1C1E',
    
    // Interactive colors
    tint: '#0A84FF',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#0A84FF',
    accentLight: '#0A84FF20',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Navigation colors
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#0A84FF',
    tabBarBackground: '#000000',
    
    // Border and separator colors
    border: '#38383A',
    separator: '#2C2C2E',
    
    // Drawing specific
    drawingCanvas: '#1C1C1E',
    
    // Drawing colors (nested object)
    drawing: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      success: '#30D158',
      canvas: '#1C1C1E',
      grid: '#2C2C2E',
    },
  },
} as const;

export type ThemeType = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';
export type ColorPalette = typeof Colors.light;

export interface ThemeContextType {
  theme: ThemeType;
  colorScheme: ColorScheme;
  colors: ColorPalette;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  // Additional properties that components expect
  mode: ThemeType;
  setThemeMode: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  // Calculate effective color scheme
  const colorScheme: ColorScheme = 
    theme === 'system' 
      ? (systemColorScheme ?? 'light')
      : theme as ColorScheme;

  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    colorScheme,
    colors,
    setTheme,
    isDark,
    // Aliases for compatibility
    mode: theme,
    setThemeMode: setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;