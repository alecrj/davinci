import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress } = useUserProgress();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Check if user already completed onboarding
    if (progress.hasCompletedOnboarding) {
      router.replace('/(tabs)/home');
      return;
    }

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    uiHaptics.buttonPress();
    router.push('/onboarding/draw-anything');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(0, 122, 255, 0.05)', 'rgba(88, 86, 214, 0.05)']}
        style={styles.backgroundGradient}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.emoji, { fontSize: 80 }]}>🎨</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to DaVinci
          </Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>
            Where Everyone Becomes an Artist
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.promise, { color: colors.text }]}>
            In the next 60 seconds, you'll discover{'\n'}
            something amazing about yourself:
          </Text>
          
          <View style={[styles.factCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.factTitle, { color: colors.primary }]}>
              ✨ You can create beautiful art
            </Text>
            <Text style={[styles.factText, { color: colors.textSecondary }]}>
              No experience needed. Just trust the process.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Discover My Inner Artist"
            onPress={handleStart}
            variant="primary"
            size="large"
            style={styles.startButton}
          />
          
          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            Free forever • No credit card • Just magic
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  emoji: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promise: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
  },
  factCard: {
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  factTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  factText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
  },
  startButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    textAlign: 'center',
  },
});