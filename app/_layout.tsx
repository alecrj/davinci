/**
 * Root layout for the DaVinci app
 * Sets up global providers and navigation structure
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context providers
import { ThemeProvider } from '@/context/ThemeContext';
// Note: Import other contexts after ThemeContext is working
// import { UserProgressProvider } from '@/context/UserProgressContext';
// import { DrawingProvider } from '@/context/DrawingContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* Temporarily comment out other providers until ThemeContext is working */}
        {/* <UserProgressProvider>
          <DrawingProvider> */}
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="assessment" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="lessons" />
              <Stack.Screen name="social" />
              <Stack.Screen name="subscription" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          {/* </DrawingProvider>
        </UserProgressProvider> */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}