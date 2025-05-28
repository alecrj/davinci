import React, { useEffect, useRef } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface AnimatedTextProps {
  children: string;
  style?: TextStyle;
  delay?: number;
  duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  delay = 0,
  duration = 600,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);
  
  return (
    <Animated.Text
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.Text>
  );
};