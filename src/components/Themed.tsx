/**
 * Theme-aware components for consistent styling across the app
 * Uses ThemeContext to automatically apply light/dark theme colors
 */

import React from 'react';
import { Text as DefaultText, View as DefaultView, TextProps, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

// Enhanced Text component with theme support
export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
}

export const Text: React.FC<ThemedTextProps> = ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...otherProps
}) => {
  const { colors, isDark } = useTheme();
  
  const color = isDark ? darkColor : lightColor;
  const themeColor = color || colors.text;

  // Typography styles based on type
  const getTypeStyle = () => {
    switch (type) {
      case 'title':
        return { fontSize: 28, fontWeight: '600' as const };
      case 'defaultSemiBold':
        return { fontSize: 16, fontWeight: '600' as const };
      case 'subtitle':
        return { fontSize: 20, fontWeight: '500' as const };
      case 'link':
        return { fontSize: 16, color: colors.tint };
      default:
        return { fontSize: 16, fontWeight: '400' as const };
    }
  };

  return (
    <DefaultText
      style={[
        { color: themeColor },
        getTypeStyle(),
        style,
      ]}
      {...otherProps}
    />
  );
};

// Enhanced View component with theme support
export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export const View: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const { colors, isDark } = useTheme();
  
  const color = isDark ? darkColor : lightColor;
  const backgroundColor = color || colors.background;

  return (
    <DefaultView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
};

// Additional themed components for common UI patterns

export interface ThemedSurfaceProps extends ViewProps {
  elevated?: boolean;
}

export const Surface: React.FC<ThemedSurfaceProps> = ({
  style,
  elevated = false,
  ...otherProps
}) => {
  const { colors, isDark } = useTheme();
  
  const surfaceStyle = {
    backgroundColor: colors.surface,
    ...(elevated && {
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  };

  return (
    <DefaultView
      style={[surfaceStyle, style]}
      {...otherProps}
    />
  );
};

export interface ThemedBorderProps extends ViewProps {
  width?: number;
}

export const Border: React.FC<ThemedBorderProps> = ({
  style,
  width = 1,
  ...otherProps
}) => {
  const { colors } = useTheme();
  
  return (
    <DefaultView
      style={[
        {
          borderColor: colors.border,
          borderWidth: width,
        },
        style,
      ]}
      {...otherProps}
    />
  );
};