// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';

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
  
  // Drawing specific
  drawing: {
    canvas: string;
    grid: string;
    guideline: string;
    preview: string;
  };
}

export interface ThemeContextType {
  isDark: boolean;
  theme: ColorPalette;  // ✅ ADD MISSING THEME PROPERTY
  colors: ColorPalette;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// ✅ ADD MISSING BUTTON VARIANT TYPE
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const saveTheme = async (isDarkMode: boolean) => {
    try {
      await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveTheme(newTheme);
  };

  const setTheme = (isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    saveTheme(isDarkMode);
  };

  const colors = isDark ? COLORS.dark : COLORS.light;

  const value: ThemeContextType = {
    isDark,
    theme: colors,  // ✅ PROVIDE THEME PROPERTY
    colors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};