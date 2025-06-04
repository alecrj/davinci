// src/context/ThemeContext.tsx - COMPLETE FILE WITH AUTO MODE

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ColorPalette } from '@/constants/colors';

// ✅ UPDATED INTERFACE WITH AUTO MODE
export interface ThemeContextType {
  isDark: boolean;
  theme: ColorPalette;
  colors: ColorPalette['colors']; // ✅ NESTED COLORS OBJECT
  mode: 'light' | 'dark' | 'auto'; // ✅ FIXED: Added 'auto' mode
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void; // ✅ FIXED: Added 'auto' mode
}

// ✅ BUTTON VARIANT TYPE FOR UI COMPONENTS
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
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'auto'>('auto');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
          const mode = savedMode as 'light' | 'dark' | 'auto';
          setThemeModeState(mode);
          
          if (mode === 'auto') {
            setIsDark(systemColorScheme === 'dark');
          } else {
            setIsDark(mode === 'dark');
          }
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  // Update theme when system changes in auto mode
  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themeMode]);

  // Save theme preference
  const saveThemeMode = async (mode: 'light' | 'dark' | 'auto') => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const newMode = newTheme ? 'dark' : 'light';
    setThemeModeState(newMode);
    saveThemeMode(newMode);
  };

  const setTheme = (isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    const newMode = isDarkMode ? 'dark' : 'light';
    setThemeModeState(newMode);
    saveThemeMode(newMode);
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'auto') => {
    setThemeModeState(mode);
    saveThemeMode(mode);
    
    if (mode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
  };

  // ✅ GET THEME COLORS BASED ON MODE
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const value: ThemeContextType = {
    isDark,
    theme: themeColors, // ✅ FULL THEME OBJECT
    colors: themeColors.colors, // ✅ NESTED COLORS OBJECT THAT COMPONENTS EXPECT
    mode: themeMode, // ✅ CURRENT MODE (light/dark/auto)
    toggleTheme,
    setTheme,
    setThemeMode, // ✅ SET THEME MODE FUNCTION
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};