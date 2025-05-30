// src/components/ui/AnimatedText.tsx - COMPLETE FILE REPLACEMENT
import React, { useEffect, useRef } from 'react';
import { Animated, TextStyle, StyleProp } from 'react-native';

// FIXED: Proper animation type definition
export type AnimationType = 
  | 'fadeIn'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp' 
  | 'slideInDown'
  | 'bounceIn'
  | 'scaleIn'
  | 'typewriter';

export interface AnimatedTextProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  // FIXED: Accept style arrays like regular Text component
  style?: StyleProp<TextStyle>;
  onAnimationComplete?: () => void;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(new Animated.Value(-50)).current;
  const translateYValue = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (animation) {
        case 'fadeIn':
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }).start(onAnimationComplete);
          break;

        case 'slideInLeft':
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateXValue, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'slideInRight':
          translateXValue.setValue(50);
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateXValue, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'slideInUp':
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'slideInDown':
          translateYValue.setValue(-30);
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(translateYValue, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'bounceIn':
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration * 0.6,
              useNativeDriver: true,
            }),
            Animated.spring(scaleValue, {
              toValue: 1,
              friction: 4,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'scaleIn':
          Animated.parallel([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.spring(scaleValue, {
              toValue: 1,
              friction: 6,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;

        case 'typewriter':
          // Simple fade for typewriter effect
          Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }).start(onAnimationComplete);
          break;

        default:
          animatedValue.setValue(1);
          onAnimationComplete?.();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animation, duration, delay]);

  const getAnimatedStyle = () => {
    const baseStyle = {
      opacity: animatedValue,
    };

    switch (animation) {
      case 'slideInLeft':
      case 'slideInRight':
        return {
          ...baseStyle,
          transform: [{ translateX: translateXValue }],
        };
      case 'slideInUp':
      case 'slideInDown':
        return {
          ...baseStyle,
          transform: [{ translateY: translateYValue }],
        };
      case 'bounceIn':
      case 'scaleIn':
        return {
          ...baseStyle,
          transform: [{ scale: scaleValue }],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.Text 
      style={[
        getAnimatedStyle(),
        style
      ]}
    >
      {children}
    </Animated.Text>
  );
};