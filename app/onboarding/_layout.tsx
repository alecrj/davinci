import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function OnboardingLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="draw-anything" />
      <Stack.Screen name="artist-setup" />
      <Stack.Screen name="first-lesson-preview" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}