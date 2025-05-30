// src/components/drawing/MagicTransformation.tsx - COMPLETE FILE REPLACEMENT
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ShapeType } from '@/types/drawing';
import { hapticFeedback } from '@/utils/platform/haptics';

// FIXED: Added missing 'shape' property
export interface MagicTransformationProps {
  shape: string;  // ADDED: Missing shape property
  onClose: () => void;
  visible?: boolean;
}

interface Transformation {
  emoji: string;
  name: string;
  description: string;
}

const transformations: Record<ShapeType, Transformation[]> = {
  circle: [
    { emoji: '☀️', name: 'Sun', description: 'Bright and warm!' },
    { emoji: '🌕', name: 'Moon', description: 'Peaceful night light' },
    { emoji: '⚽', name: 'Soccer Ball', description: 'Ready to play!' },
    { emoji: '🍕', name: 'Pizza', description: 'Delicious slice!' },
  ],
  square: [
    { emoji: '📦', name: 'Box', description: 'Perfect container!' },
    { emoji: '🎁', name: 'Gift', description: 'Special surprise!' },
    { emoji: '🏠', name: 'House', description: 'Cozy home!' },
    { emoji: '📱', name: 'Phone', description: 'Stay connected!' },
  ],
  triangle: [
    { emoji: '⛰️', name: 'Mountain', description: 'Reach new heights!' },
    { emoji: '🍕', name: 'Pizza Slice', description: 'Triangular treat!' },
    { emoji: '🎪', name: 'Tent', description: 'Adventure awaits!' },
    { emoji: '🔺', name: 'Arrow Up', description: 'Going up!' },
  ],
  rectangle: [
    { emoji: '📱', name: 'Phone', description: 'Smart device!' },
    { emoji: '💳', name: 'Card', description: 'Important document!' },
    { emoji: '📚', name: 'Book', description: 'Knowledge inside!' },
    { emoji: '🚪', name: 'Door', description: 'New opportunities!' },
  ],
  line: [
    { emoji: '🌈', name: 'Rainbow', description: 'Colorful arc!' },
    { emoji: '⚡', name: 'Lightning', description: 'Electric energy!' },
    { emoji: '🏹', name: 'Arrow', description: 'Straight and true!' },
    { emoji: '📏', name: 'Ruler', description: 'Measure twice!' },
  ],
  star: [
    { emoji: '⭐', name: 'Star', description: 'Shine bright!' },
    { emoji: '✨', name: 'Sparkles', description: 'Magical moments!' },
    { emoji: '🌟', name: 'Glowing Star', description: 'You\'re amazing!' },
    { emoji: '⚡', name: 'Power', description: 'Full of energy!' },
  ],
  heart: [
    { emoji: '❤️', name: 'Love', description: 'Full of heart!' },
    { emoji: '💖', name: 'Sparkling Heart', description: 'Pure joy!' },
    { emoji: '🎈', name: 'Balloon', description: 'Light and happy!' },
    { emoji: '🌹', name: 'Rose', description: 'Beautiful bloom!' },
  ],
  squiggle: [
    { emoji: '🌊', name: 'Wave', description: 'Ocean rhythm!' },
    { emoji: '🐍', name: 'Snake', description: 'Slithery friend!' },
    { emoji: '💫', name: 'Dizzy', description: 'Whirling motion!' },
    { emoji: '🎭', name: 'Art', description: 'Creative expression!' },
  ],
  spiral: [
    { emoji: '🌀', name: 'Spiral', description: 'Endless motion!' },
    { emoji: '🍥', name: 'Fish Cake', description: 'Swirled delight!' },
    { emoji: '🌪️', name: 'Tornado', description: 'Powerful spin!' },
    { emoji: '🐚', name: 'Shell', description: 'Ocean treasure!' },
  ],
  unknown: [
    { emoji: '🎨', name: 'Art', description: 'Creative masterpiece!' },
    { emoji: '✨', name: 'Magic', description: 'Something wonderful!' },
    { emoji: '🌟', name: 'Special', description: 'One of a kind!' },
    { emoji: '💫', name: 'Unique', description: 'Beautifully different!' },
  ],
};

export const MagicTransformation: React.FC<MagicTransformationProps> = ({
  shape,
  onClose,
  visible = true,
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const detectedShape = shape as ShapeType;
  const shapeTransformations = transformations[detectedShape] || transformations.unknown;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-advance transformations
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex < shapeTransformations.length - 1 ? prevIndex + 1 : 0
        );
      }, 2000);

      // Auto-close after showing all transformations
      const timeout = setTimeout(() => {
        handleClose();
      }, shapeTransformations.length * 2000 + 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [visible, shapeTransformations.length]);

  const handleClose = () => {
    hapticFeedback('light');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const currentTransformation = shapeTransformations[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.magicText, { color: theme.colors.primary }]}>
            ✨ Magic! ✨
          </Text>
          <Text style={[styles.detectionText, { color: theme.colors.text }]}>
            Your {detectedShape} became...
          </Text>
          <Text style={[styles.transformText, { color: theme.colors.textSecondary }]}>
            Something amazing!
          </Text>
        </View>

        <View style={styles.transformationContainer}>
          <TouchableOpacity
            style={[
              styles.transformationCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={handleClose}
            activeOpacity={0.9}
          >
            <Text style={styles.emoji}>{currentTransformation.emoji}</Text>
            <Text style={[styles.transformationName, { color: theme.colors.text }]}>
              {currentTransformation.name}
            </Text>
            <Text style={[styles.transformationDescription, { color: theme.colors.textSecondary }]}>
              {currentTransformation.description}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressIndicator}>
          {shapeTransformations.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentIndex ? theme.colors.primary : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>
          Tap to continue your creative journey!
        </Text>
      </Animated.View>
    </View>
  );
};

const { width } = Dimensions.get('window');

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
  content: {
    width: width * 0.85,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  magicText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detectionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  transformText: {
    fontSize: 16,
    textAlign: 'center',
  },
  transformationContainer: {
    marginBottom: 24,
  },
  transformationCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 200,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  transformationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transformationDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomText: {
    fontSize: 14,
    textAlign: 'center',
  },
});