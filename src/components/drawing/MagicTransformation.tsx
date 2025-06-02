// src/components/drawing/MagicTransformation.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { ShapeType, DrawingPath } from '@/types/drawing';
import { hapticFeedback } from '@/utils/platform/haptics';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { createGradient } from '@/utils/colors/gradientHelper';

export interface MagicTransformationProps {
  // ✅ ADD MISSING PROPS
  shape: ShapeType;
  detectedShape?: ShapeType;
  userDrawing?: any;
  onComplete?: () => void;
  
  // Optional props
  visible?: boolean;
  duration?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MagicTransformation: React.FC<MagicTransformationProps> = ({
  shape,
  detectedShape,
  userDrawing,
  onComplete,
  visible = true,
  duration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      startTransformation();
    }
  }, [visible, shape]);

  const startTransformation = async () => {
    // Success haptic feedback
    await hapticFeedback.success();

    // Start animation sequence
    scale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 200, easing: Easing.in(Easing.quad) })
    );

    opacity.value = withTiming(1, { duration: 300 });
    
    rotation.value = withSequence(
      withTiming(360, { duration: 800, easing: Easing.out(Easing.quad) }),
      withTiming(720, { duration: 400, easing: Easing.in(Easing.quad) })
    );

    sparkleOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 600 })
    );

    // Auto-complete after animation
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const getShapeEmoji = (shapeType: ShapeType): string => {
    switch (shapeType) {
      case 'circle': return '⭕';
      case 'square': return '⬜';
      case 'triangle': return '🔺';
      case 'rectangle': return '▭';
      case 'star': return '⭐';
      case 'heart': return '❤️';
      case 'line': return '➖';
      case 'arrow': return '➡️';
      default: return '✨';
    }
  };

  const getShapeName = (shapeType: ShapeType): string => {
    return shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
  };

  const getSuccessMessage = (shapeType: ShapeType): string => {
    const messages = {
      circle: "Perfect Circle! 🎯",
      square: "Amazing Square! 📐",
      triangle: "Brilliant Triangle! 📐",
      rectangle: "Great Rectangle! 📏",
      star: "Stunning Star! ⭐",
      heart: "Beautiful Heart! 💕",
      line: "Straight Line! 📏",
      arrow: "Sharp Arrow! 🎯",
      unknown: "Creative Shape! ✨"
    };
    return messages[shapeType] || messages.unknown;
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={createGradient(['rgba(0, 122, 255, 0.1)', 'rgba(88, 86, 214, 0.1)'])}
        style={styles.background}
      />
      
      <Animated.View style={[styles.transformationContainer, containerStyle]}>
        {/* Main shape display */}
        <View style={styles.shapeContainer}>
          <LinearGradient
            colors={createGradient(['#007AFF', '#5856D6'])}
            style={styles.shapeBackground}
          >
            <AnimatedText
              style={styles.shapeEmoji}
              animation="bounceIn"
            >
              {getShapeEmoji(shape)}
            </AnimatedText>
          </LinearGradient>
        </View>

        {/* Success message */}
        <AnimatedText
          style={styles.successText}
          animation="fadeInUp"
        >
          {getSuccessMessage(shape)}
        </AnimatedText>

        <AnimatedText
          style={styles.encouragementText}
          animation="fadeIn"
        >
          You're becoming an artist! 🎨
        </AnimatedText>
      </Animated.View>

      {/* Sparkle effects */}
      <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.sparkle,
              {
                top: Math.random() * screenHeight * 0.6 + screenHeight * 0.2,
                left: Math.random() * screenWidth * 0.6 + screenWidth * 0.2,
              }
            ]}
          >
            <AnimatedText style={styles.sparkleText}>✨</AnimatedText>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  transformationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeContainer: {
    marginBottom: 20,
  },
  shapeBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shapeEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#007AFF',
  },
  encouragementText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#5856D6',
    fontWeight: '600',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 20,
  },
});