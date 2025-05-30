import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { progress } = useUserProgress();

  useEffect(() => {
    // Wait a moment for contexts to load
    const timer = setTimeout(() => {
      routeUser();
    }, 500);

    return () => clearTimeout(timer);
  }, [progress]);

  const routeUser = () => {
    // First time users - go to onboarding
    if (progress.isNewUser || !progress.hasCompletedOnboarding) {
      router.replace('/onboarding/draw-anything');
      return;
    }

    // Completed onboarding but not assessment - go to assessment
    if (!progress.hasCompletedAssessment) {
      router.replace('/assessment');
      return;
    }

    // Fully onboarded users - go to main app
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});