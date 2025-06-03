// src/components/ui/AnimatedText.tsx - SUPPORTS BOTH text AND children
import React, { useEffect, useRef } from 'react';
import { Text, TextStyle, Animated } from 'react-native';
import { AnimationType } from '@/types/navigation';

export interface AnimatedTextProps {
  text?: string; // ✅ OPTIONAL text prop
  children?: React.ReactNode; // ✅ SUPPORT children prop
  style?: TextStyle | TextStyle[]; // ✅ SUPPORT STYLE ARRAYS
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  children,
  style,
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  onAnimationComplete,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // ✅ USE text prop OR children - whatever is provided
  const displayContent = text || children;

  useEffect(() => {
    // Reset values
    animatedValue.setValue(0);
    translateY.setValue(0);
    translateX.setValue(0);
    scale.setValue(1);

    // Set initial values based on animation type
    switch (animation) {
      case 'fadeInUp':
        translateY.setValue(30);
        break;
      case 'fadeInDown':
      case 'slideInDown':
        translateY.setValue(-30);
        break;
      case 'fadeInLeft':
      case 'slideInLeft':
        translateX.setValue(-30);
        break;
      case 'fadeInRight':
      case 'slideInRight':
        translateX.setValue(30);
        break;
      case 'slideInUp':
        translateY.setValue(30);
        break;
      case 'zoomIn':
        scale.setValue(0.5);
        break;
      case 'bounceIn':
        scale.setValue(0);
        break;
    }

    // Start animation after delay
    const timer = setTimeout(() => {
      const animations: Animated.CompositeAnimation[] = [];

      // Fade animations
      if (animation.includes('fade') || animation.includes('slide') || animation === 'zoomIn' || animation === 'bounceIn') {
        animations.push(
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
      }

      // Transform animations
      if (animation.includes('Up') || animation.includes('Down')) {
        animations.push(
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
      }

      if (animation.includes('Left') || animation.includes('Right')) {
        animations.push(
          Animated.timing(translateX, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          })
        );
      }

      if (animation === 'zoomIn' || animation === 'bounceIn') {
        animations.push(
          Animated.timing(scale, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
      }

      // Special animations
      if (animation === 'pulse') {
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnimation.start();
        return;
      }

      if (animation === 'shake') {
        const shakeAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        );
        shakeAnimation.start(onAnimationComplete);
        return;
      }

      // Run parallel animations
      Animated.parallel(animations).start(onAnimationComplete);
    }, delay);

    return () => clearTimeout(timer);
  }, [displayContent, animation, duration, delay]);

  const animatedStyle = {
    opacity: animation === 'pulse' || animation === 'shake' ? 1 : animatedValue,
    transform: [
      { translateY },
      { translateX },
      { scale },
    ],
  };

  // ✅ HANDLE STYLE ARRAYS
  const flatStyle = Array.isArray(style) ? style : [style];

  return (
    <Animated.Text style={[...flatStyle, animatedStyle]}>
      {displayContent}
    </Animated.Text>
  );
};