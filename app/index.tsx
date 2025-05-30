/**
 * DaVinci App Router
 * Smart routing based on user progress and onboarding state
 */

import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUserProgress } from '@/context/UserProgressContext';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/Themed';

export default function AppRouter() {
  const { progress, isLoading } = useUserProgress();
  const { colors } = useTheme();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for progress to load
    }

    // Route users based on their progress
    if (!progress.hasCompletedOnboarding) {
      // First time users go to onboarding
      router.replace('/onboarding/draw-anything');
    } else if (!progress.hasCompletedAssessment) {
      // Users who completed onboarding but not assessment
      router.replace('/assessment');
    } else {
      // Existing users go directly to main app
      router.replace('/(tabs)');
    }
  }, [isLoading, progress.hasCompletedOnboarding, progress.hasCompletedAssessment]);

  // Show loading screen while determining route
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    }}>
      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
      />
      <Text style={{
        marginTop: 20,
        fontSize: 18,
        fontWeight: '500',
        color: colors.textSecondary,
      }}>
        Loading DaVinci...
      </Text>
    </View>
  );
}