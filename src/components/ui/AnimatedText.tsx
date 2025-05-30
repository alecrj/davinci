import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Text,
  TextStyle,
} from 'react-native';

interface AnimatedTextProps {
  children: string;
  style?: TextStyle;
  delay?: number;
  duration?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'scale' | 'fadeInUp';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  delay = 0,
  duration = 800,
  animationType = 'fadeInUp',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    const animations = [];
    
    switch (animationType) {
      case 'fadeIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        break;
        
      case 'slideUp':
        animations.push(
          Animated.timing(slideAnim, {
            toValue: 0,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        break;
        
      case 'scale':
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            delay,
            useNativeDriver: true,
          })
        );
        break;
        
      case 'fadeInUp':
      default:
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        break;
    }
    
    Animated.parallel(animations).start();
  }, [delay, duration, animationType]);
  
  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fadeIn':
        return {
          opacity: fadeAnim,
        };
        
      case 'slideUp':
        return {
          transform: [{ translateY: slideAnim }],
        };
        
      case 'scale':
        return {
          transform: [{ scale: scaleAnim }],
        };
        
      case 'fadeInUp':
      default:
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
    }
  };
  
  return (
    <Animated.Text style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.Text>
  );
};