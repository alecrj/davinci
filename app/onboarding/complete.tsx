import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingCompleteScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { updateProgress } = useUserProgress();
  
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Mark onboarding as complete
    updateProgress({
      hasCompletedOnboarding: true,
    });

    // Celebration animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Celebrate!
    uiHaptics.celebration();

    // Auto-navigate to home after 3 seconds
    setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 3000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(0, 122, 255, 0.1)', 'rgba(88, 86, 214, 0.1)']}
        style={styles.backgroundGradient}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Text style={[styles.emoji, { fontSize: 100 }]}>🎉</Text>
        
        <Text style={[styles.title, { color: colors.primary }]}>
          Day 1 Complete!
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text }]}>
          You're officially an artist now
        </Text>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statEmoji, { fontSize: 48 }]}>🔥</Text>
          <Text style={[styles.statNumber, { color: colors.text }]}>1</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak Started!
          </Text>
        </View>
        
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          See you tomorrow for your first real lesson.{'\n'}
          We'll send you a reminder!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
  },
  statCard: {
    paddingHorizontal: 60,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  statEmoji: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});