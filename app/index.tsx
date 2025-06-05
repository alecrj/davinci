import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUserProgress } from '@/context/UserProgressContext';
import { useTheme } from '@/context/ThemeContext';

export default function Index() {
  const { progress } = useUserProgress();
  const { colors } = useTheme();

  useEffect(() => {
    // Check if user has completed onboarding
    if (progress.hasCompletedOnboarding) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/onboarding/welcome');
    }
  }, [progress.hasCompletedOnboarding]);

  // Show loading indicator while checking
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}