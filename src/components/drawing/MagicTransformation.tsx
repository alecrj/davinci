import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ShapeType } from '@/types/drawing';

const { width } = Dimensions.get('window');

interface MagicTransformationProps {
  detectedShape: ShapeType;
  userDrawing: any;
  onComplete: () => void;
}

// Magic transformations - each shape becomes 5 amazing things!
const transformations = {
  circle: [
    { emoji: '😊', name: 'Happy Face', description: 'A cheerful smile!' },
    { emoji: '☀️', name: 'Sun', description: 'Bright and warm!' },
    { emoji: '🍕', name: 'Pizza', description: 'Delicious slice!' },
    { emoji: '⚽', name: 'Soccer Ball', description: 'Ready to play!' },
    { emoji: '🌕', name: 'Full Moon', description: 'Beautiful and bright!' },
  ],
  square: [
    { emoji: '🏠', name: 'House', description: 'A cozy home!' },
    { emoji: '📦', name: 'Gift Box', description: 'Full of surprises!' },
    { emoji: '🖼️', name: 'Picture Frame', description: 'Art on the wall!' },
    { emoji: '🧀', name: 'Cheese', description: 'Tasty and yellow!' },
    { emoji: '📱', name: 'Phone', description: 'Stay connected!' },
  ],
  triangle: [
    { emoji: '🏔️', name: 'Mountain', description: 'Tall and majestic!' },
    { emoji: '🌲', name: 'Pine Tree', description: 'Green and tall!' },
    { emoji: '🍕', name: 'Pizza Slice', description: 'Triangle shaped!' },
    { emoji: '⛵', name: 'Sailboat', description: 'Sailing away!' },
    { emoji: '🔺', name: 'Warning Sign', description: 'Pay attention!' },
  ],
  line: [
    { emoji: '🏏', name: 'Cricket Bat', description: 'Ready for sport!' },
    { emoji: '✏️', name: 'Pencil', description: 'For more drawing!' },
    { emoji: '🚂', name: 'Train Track', description: 'Going places!' },
    { emoji: '🌈', name: 'Rainbow', description: 'Colorful and bright!' },
    { emoji: '📏', name: 'Ruler', description: 'Perfectly straight!' },
  ],
  squiggle: [
    { emoji: '🐍', name: 'Snake', description: 'Slithering along!' },
    { emoji: '🌊', name: 'Ocean Wave', description: 'Peaceful water!' },
    { emoji: '🍜', name: 'Noodles', description: 'Delicious pasta!' },
    { emoji: '🧬', name: 'DNA', description: 'Life itself!' },
    { emoji: '💫', name: 'Shooting Star', description: 'Make a wish!' },
  ],
  star: [
    { emoji: '⭐', name: 'Star', description: 'Shining bright!' },
    { emoji: '✨', name: 'Sparkles', description: 'Magical dust!' },
    { emoji: '🏆', name: 'Trophy', description: 'You won!' },
    { emoji: '⚡', name: 'Lightning', description: 'Electric energy!' },
    { emoji: '🎆', name: 'Fireworks', description: 'Celebration time!' },
  ],
  heart: [
    { emoji: '❤️', name: 'Love Heart', description: 'Full of love!' },
    { emoji: '🍓', name: 'Strawberry', description: 'Sweet and red!' },
    { emoji: '💝', name: 'Gift with Bow', description: 'Given with love!' },
    { emoji: '🌹', name: 'Rose', description: 'Beautiful flower!' },
    { emoji: '💖', name: 'Sparkling Heart', description: 'Extra special!' },
  ],
  spiral: [
    { emoji: '🌀', name: 'Cyclone', description: 'Spinning around!' },
    { emoji: '🐚', name: 'Seashell', description: 'Ocean treasure!' },
    { emoji: '🍭', name: 'Lollipop', description: 'Sweet spiral!' },
    { emoji: '🌺', name: 'Hibiscus', description: 'Tropical flower!' },
    { emoji: '🕳️', name: 'Hole', description: 'Deep and mysterious!' },
  ],
  unknown: [
    { emoji: '🎨', name: 'Masterpiece', description: 'Unique art!' },
    { emoji: '👑', name: 'Crown', description: 'Fit for royalty!' },
    { emoji: '🦄', name: 'Unicorn', description: 'Magical creature!' },
    { emoji: '🌟', name: 'Special Star', description: 'One of a kind!' },
    { emoji: '💎', name: 'Diamond', description: 'Precious gem!' },
  ],
};

export const MagicTransformation: React.FC<MagicTransformationProps> = ({
  detectedShape,
  userDrawing,
  onComplete,
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTransformations, setShowTransformations] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const shapeTransformations = transformations[detectedShape] || transformations.unknown;
  
  useEffect(() => {
    // Initial entrance animation
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Start showing transformations after entrance
      setTimeout(() => {
        setShowTransformations(true);
        startTransformationCycle();
      }, 1000);
    });
  }, []);
  
  const startTransformationCycle = () => {
    const cycleTransformations = () => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % shapeTransformations.length;
        
        // Animation for each transformation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        return next;
      });
    };
    
    // Cycle through transformations
    const intervals = [1000, 1200, 1400, 1600, 1800]; // Varying speeds for interest
    
    let cycleCount = 0;
    const cycle = () => {
      if (cycleCount < shapeTransformations.length - 1) {
        setTimeout(() => {
          cycleTransformations();
          cycleCount++;
          cycle();
        }, intervals[cycleCount % intervals.length]);
      } else {
        // Complete after showing all transformations
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    };
    
    cycle();
  };
  
  const currentTransformation = shapeTransformations[currentIndex];
  const shapeName = detectedShape.charAt(0).toUpperCase() + detectedShape.slice(1);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Magic reveal text */}
        <Text style={[styles.magicText, { color: theme.accent }]}>
          ✨ Magic! ✨
        </Text>
        
        <Text style={[styles.detectionText, { color: theme.text }]}>
          You drew a {shapeName}!
        </Text>
        
        <Text style={[styles.transformText, { color: theme.textSecondary }]}>
          Look what it can become:
        </Text>
        
        {/* Transformation display */}
        {showTransformations && (
          <Animated.View
            style={[
              styles.transformationContainer,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.emoji}>
              {currentTransformation.emoji}
            </Text>
            <Text style={[styles.transformationName, { color: theme.text }]}>
              {currentTransformation.name}
            </Text>
            <Text style={[styles.transformationDescription, { color: theme.textSecondary }]}>
              {currentTransformation.description}
            </Text>
          </Animated.View>
        )}
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {shapeTransformations.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentIndex ? theme.accent : theme.border,
                },
              ]}
            />
          ))}
        </View>
        
        <Text style={[styles.bottomText, { color: theme.textTertiary }]}>
          Your {shapeName} is already 5 different things! 🎉
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  magicText: {
    fontSize: 32,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detectionText: {
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Semibold',
    marginBottom: 8,
    textAlign: 'center',
  },
  transformText: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Regular',
    marginBottom: 40,
    textAlign: 'center',
  },
  transformationContainer: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 32,
    minWidth: width - 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  transformationName: {
    fontSize: 22,
    fontFamily: 'SF-Pro-Text-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  transformationDescription: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Medium',
    textAlign: 'center',
    marginTop: 16,
  },
});