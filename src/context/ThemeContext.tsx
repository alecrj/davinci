// src/context/ThemeContext.tsx - FIXED TO MATCH COMPONENT USAGE
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ColorPalette } from '@/constants/colors';

// ✅ UPDATED INTERFACE TO MATCH COMPONENT EXPECTATIONS
export interface ThemeContextType {
  isDark: boolean;
  theme: ColorPalette;
  colors: ColorPalette['colors']; // ✅ NESTED COLORS OBJECT
  mode: 'light' | 'dark'; // ✅ ADD MISSING MODE PROPERTY
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  setThemeMode: (mode: 'light' | 'dark') => void; // ✅ ADD MISSING FUNCTION
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

  const setThemeMode = (mode: 'light' | 'dark') => {
    const isDarkMode = mode === 'dark';
    setIsDark(isDarkMode);
    saveTheme(isDarkMode);
  };

  // ✅ GET THEME COLORS BASED ON MODE
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const mode: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const value: ThemeContextType = {
    isDark,
    theme: themeColors, // ✅ FULL THEME OBJECT
    colors: themeColors.colors, // ✅ NESTED COLORS OBJECT THAT COMPONENTS EXPECT
    mode, // ✅ MODE PROPERTY
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