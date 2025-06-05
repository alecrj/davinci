// app/index.tsx - FIXED MAIN INDEX WITH ALL PROPERTIES
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';

export default function Index() {
  const { theme } = useTheme();
  const { colors } = theme;
  // ✅ FIXED: Use correct properties from context
  const { progress, isLoading } = useUserProgress();

  useEffect(() => {
    // Initialize any app-level logic here
  }, []);

  // ✅ FIXED: Check for proper onboarding completion
  useEffect(() => {
    if (!isLoading && !progress.hasCompletedOnboarding) {
      // User needs to complete onboarding
    }
  }, [isLoading, progress.hasCompletedOnboarding, progress.hasCompletedAssessment]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading DaVinci...
        </Text>
      </View>
    );
  }

  // Check onboarding completion
  if (!progress.hasCompletedOnboarding) {
    return <Redirect href="/onboarding/enhanced-assessment" />;
  }

  // Check assessment completion
  if (!progress.hasCompletedAssessment) {
    return <Redirect href="/assessment" />;
  }

  // Default to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});