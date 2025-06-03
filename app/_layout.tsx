// app/_layout.tsx - ENABLE USER PROGRESS PROVIDER
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
import { UserProgressProvider } from '@/context/UserProgressContext'; // ✅ RE-ENABLE

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProgressProvider> {/* ✅ RE-ENABLE USER PROGRESS PROVIDER */}
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
        </UserProgressProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// src/components/ui/AnimatedText.tsx - ADD MISSING ANIMATIONS
import React, { useEffect } from 'react';
import { TextProps, StyleProp, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export type AnimationType = 
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInDown' // ✅ ADD MISSING ANIMATION
  | 'bounceIn'
  | 'scaleIn'
  | 'none';

interface AnimatedTextProps extends Omit<TextProps, 'style'> {
  children?: React.ReactNode;
  text?: string;
  style?: StyleProp<TextStyle>;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  text,
  style,
  animation = 'none',
  delay = 0,
  duration = 300,
  ...textProps
}) => {
  // Animation values
  const opacity = useSharedValue(animation === 'none' ? 1 : 0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(animation === 'none' ? 1 : 0);

  useEffect(() => {
    if (animation === 'none') return;

    const startAnimation = () => {
      switch (animation) {
        case 'fadeIn':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          break;

        case 'fadeInUp':
          translateY.value = 20;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateY.value = withDelay(delay, withTiming(0, { duration }));
          break;

        case 'fadeInDown':
          translateY.value = -20;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateY.value = withDelay(delay, withTiming(0, { duration }));
          break;

        case 'slideInLeft':
          translateX.value = -50;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateX.value = withDelay(delay, withTiming(0, { 
            duration, 
            easing: Easing.out(Easing.quad) 
          }));
          break;

        case 'slideInRight':
          translateX.value = 50;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateX.value = withDelay(delay, withTiming(0, { duration }));
          break;

        case 'slideInDown': // ✅ ADD MISSING ANIMATION TYPE
          translateY.value = -30;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateY.value = withDelay(delay, withTiming(0, { 
            duration, 
            easing: Easing.out(Easing.quad) 
          }));
          break;

        case 'bounceIn':
          scale.value = 0;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration: duration / 2 }));
          scale.value = withDelay(delay, withSequence(
            withTiming(1.2, { duration: duration / 2 }),
            withSpring(1, { damping: 8, stiffness: 100 })
          ));
          break;

        case 'scaleIn':
          scale.value = 0;
          opacity.value = 0;
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          scale.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 100 }));
          break;
      }
    };

    startAnimation();
  }, [animation, delay, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.Text 
      style={[animatedStyle, style]} 
      {...textProps}
    >
      {text || children}
    </Animated.Text>
  );
};