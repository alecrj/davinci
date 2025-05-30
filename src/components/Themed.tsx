/**
 * DaVinci Themed Components
 * Theme-aware components for consistent styling
 */

import React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  TextProps,
  ViewProps,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { colors, colorScheme } = useTheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors, colorScheme } = useTheme();
  
  // Determine text color
  const color = lightColor && darkColor 
    ? (colorScheme === 'light' ? lightColor : darkColor)
    : colors.text;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const { colors, colorScheme } = useTheme();
  
  // Determine background color
  const backgroundColor = lightColor && darkColor
    ? (colorScheme === 'light' ? lightColor : darkColor)
    : colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// Import Colors for the theme color function
import { Colors } from '@/constants/colors';