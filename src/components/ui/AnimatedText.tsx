/**
 * DaVinci AnimatedText Component
 * Beautiful text animations for confidence building
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';

export type AnimationType = 
  | 'fadeIn'
  | 'slideInUp'
  | 'slideInDown'
  | 'scaleIn'
  | 'bounce'
  | 'typewriter'
  | 'glow'
  | 'shake';

export interface AnimatedTextProps {
  children: string;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  onAnimationComplete?: () => void;
  repeat?: boolean;
  reverse?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  style,
  containerStyle,
  onAnimationComplete,
  repeat = false,
  reverse = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current; // For complex animations
  
  const getInitialValue = (): number => {
    switch (animation) {
      case 'fadeIn':
        return 0;
      case 'slideInUp':
        return 50;
      case 'slideInDown':
        return -50;
      case 'scaleIn':
        return 0;
      case 'bounce':
        return 0;
      case 'typewriter':
        return 0;
      case 'glow':
        return 0;
      case 'shake':
        return 0;
      default:
        return 0;
    }
  };

  const getFinalValue = (): number => {
    switch (animation) {
      case 'fadeIn':
        return 1;
      case 'slideInUp':
      case 'slideInDown':
        return 0;
      case 'scaleIn':
        return 1;
      case 'bounce':
        return 1;
      case 'typewriter':
        return children.length;
      case 'glow':
        return 1;
      case 'shake':
        return 0;
      default:
        return 1;
    }
  };

  useEffect(() => {
    // Reset animation value
    animatedValue.setValue(getInitialValue());
    
    const startAnimation = () => {
      switch (animation) {
        case 'fadeIn':
          Animated.timing(animatedValue, {
            toValue: getFinalValue(),
            duration,
            useNativeDriver: true,
          }).start(onAnimationComplete);
          break;
          
        case 'slideInUp':
        case 'slideInDown':
          Animated.timing(animatedValue, {
            toValue: getFinalValue(),
            duration,
            useNativeDriver: true,
          }).start(onAnimationComplete);
          break;
          
        case 'scaleIn':
          Animated.spring(animatedValue, {
            toValue: getFinalValue(),
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start(onAnimationComplete);
          break;
          
        case 'bounce':
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1.2,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
            Animated.spring(animatedValue, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start(onAnimationComplete);
          break;
          
        case 'typewriter':
          Animated.timing(animatedValue, {
            toValue: getFinalValue(),
            duration,
            useNativeDriver: false, // Can't use native driver for text length
          }).start(onAnimationComplete);
          break;
          
        case 'glow':
          const glowAnimation = Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: false,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: false,
            }),
          ]);
          
          if (repeat) {
            Animated.loop(glowAnimation).start();
          } else {
            glowAnimation.start(onAnimationComplete);
          }
          break;
          
        case 'shake':
          const shakeAnimation = Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]);
          
          shakeAnimation.start(onAnimationComplete);
          break;
          
        default:
          Animated.timing(animatedValue, {
            toValue: getFinalValue(),
            duration,
            useNativeDriver: true,
          }).start(onAnimationComplete);
      }
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [animation, duration, delay, children.length, repeat]);

  const getAnimatedStyle = (): any => {
    switch (animation) {
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
        
      case 'slideInUp':
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 50],
              outputRange: [50, 0],
              extrapolate: 'clamp',
            }),
          }],
        };
        
      case 'slideInDown':
        return {
          opacity: animatedValue.interpolate({
            inputRange: [-50, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [-50, 0],
              outputRange: [-50, 0],
              extrapolate: 'clamp',
            }),
          }],
        };
        
      case 'scaleIn':
        return {
          opacity: animatedValue,
          transform: [{ scale: animatedValue }],
        };
        
      case 'bounce':
        return {
          transform: [{ scale: animatedValue }],
        };
        
      case 'glow':
        return {
          shadowColor: Colors.light.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
          }),
          shadowRadius: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10],
          }),
        };
        
      case 'shake':
        return {
          transform: [{
            translateX: animatedValue,
          }],
        };
        
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  const getDisplayText = (): string => {
    if (animation === 'typewriter') {
      const visibleLength = Math.floor(animatedValue._value);
      return children.substring(0, visibleLength);
    }
    return children;
  };

  return (
    <Animated.View style={[containerStyle, getAnimatedStyle()]}>
      <Text style={[styles.text, style]}>
        {getDisplayText()}
      </Text>
    </Animated.View>
  );
};

const styles = {
  text: {
    fontSize: 16,
    color: Colors.light.text,
  } as TextStyle,
};