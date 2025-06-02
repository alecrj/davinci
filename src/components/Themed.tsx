// src/components/Themed.tsx
import React from 'react';
import { Text as DefaultText, View as DefaultView, TextProps, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export type TextStyle = TextProps['style'];
export type ViewStyle = ViewProps['style'];

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
}

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { isDark, colors } = useTheme();
  const colorFromProps = props[isDark ? 'dark' : 'light'];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[colorName];
  }
}

export function Text(props: ThemedTextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors } = useTheme();
  const color = lightColor || darkColor ? 
    useThemeColor({ light: lightColor, dark: darkColor }, 'text') : 
    colors.text;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors } = useTheme();
  const backgroundColor = lightColor || darkColor ? 
    useThemeColor({ light: lightColor, dark: darkColor }, 'background') : 
    colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// Dummy Colors object for compatibility (uses theme context instead)
const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    primary: '#007AFF',
  },
  dark: {
    text: '#fff', 
    background: '#000',
    primary: '#0A84FF',
  },
};