// CRITICAL FIX 1: src/context/ThemeContext.tsx
// The issue is that ThemeType is resolving to string "light" instead of full theme object

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

// FIXED: Proper ThemeMode type
export type ThemeMode = 'light' | 'dark' | 'auto';

// FIXED: Complete theme colors interface
export interface ColorPalette {
  readonly text: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly textTertiary: string;
  readonly background: string;
  readonly backgroundSecondary: string;
  readonly border: string;
  readonly card: string;
  readonly notification: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly accentLight: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
  readonly surface: string;
  readonly surfaceSecondary: string;
  readonly overlay: string;
  readonly shadow: string;
  readonly drawing: {
    readonly canvas: string;
    readonly grid: string;
  };
}

// FIXED: Proper theme object interface
export interface ThemeContextType {
  mode: ThemeMode;
  colors: ColorPalette;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        setMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setThemeMode = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme', newMode);
      setMode(newMode);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // FIXED: Return proper color palette based on mode
  const colors = mode === 'dark' ? Colors.dark : Colors.light;

  const value: ThemeContextType = {
    mode,
    colors,
    setThemeMode,
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