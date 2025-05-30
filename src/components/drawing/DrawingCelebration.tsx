import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { triggerHaptic } from '@/utils/haptics';
import { ShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

interface DrawingCelebrationProps {
  shapeName: ShapeType;
  onContinue: () => void;
}

// Celebration messages based on detected shape
const celebrationMessages = {
  circle: {
    title: "Perfect Circle Magic! ⭕",
    subtitle: "You just created 5 amazing things from one simple circle!",
    achievement: "Circle Wizard",
  },
  square: {
    title: "Square Success! ⬜",
    subtitle: "Your square transformed into 5 incredible objects!",
    achievement: "Shape Master",
  },
  triangle: {
    title: "Triangle Triumph! 🔺",
    subtitle: "One triangle, five fantastic creations!",
    achievement: "Geometric Genius",
  },
  line: {
    title: "Line Perfection! ➖",
    subtitle: "A simple line became 5 wonderful things!",
    achievement: "Line Artist",
  },
  squiggle: {
    title: "Squiggle Superstar! 〰️",
    subtitle: "Your creative squiggle is pure art!",
    achievement: "Creative Spirit",
  },
  star: {
    title: "Star Power! ⭐",
    subtitle: "You made a star and so much more!",
    achievement: "Star Creator",
  },
  heart: {
    title: "Heart Magic! ❤️",
    subtitle: "Your heart drawing is full of love and potential!",
    achievement: "Heart Artist",
  },
  spiral: {
    title: "Spiral Spectacular! 🌀",
    subtitle: "What an amazing spiral creation!",
    achievement: "Spiral Master",
  },
  unknown: {
    title: "Artistic Genius! 🎨",
    subtitle: "You created something completely unique and wonderful!",
    achievement: "Original Artist",
  },
};

export const DrawingCelebration: React.FC<DrawingCelebrationProps> = ({
  shapeName,
  onContinue,
}) => {
  const { theme } = useTheme();
  
  // Animations
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  const celebration = celebrationMessages[shapeName] || celebrationMessages.unknown;
  
  useEffect(() => {
    // Trigger celebration haptics
    triggerHaptic('success');
    
    // Start celebration animation
    startCelebrationAnimation();
  }, []);
  
  const startCelebrationAnimation = () => {
    // Confetti explosion
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Main content entrance
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Achievement badge bounce
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }, 1000);
  };
  
  const handleContinue = () => {
    triggerHaptic('impact');
    onContinue();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Animated confetti background */}
      <Animated.View
        style={[
          styles.confettiContainer,
          {
            opacity: confettiAnim,
            transform: [
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5],
                }),
              },
            ],
          },
        ]}
      >
        {/* Confetti particles */}
        {Array.from({ length: 20 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confettiParticle,
              {
                backgroundColor: index % 2 === 0 ? theme.accent : theme.success,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: [
                  {
                    rotate: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
      
      {/* Main celebration content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Main celebration text */}
        <Text style={[styles.title, { color: theme.text }]}>
          {celebration.title}
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {celebration.subtitle}
        </Text>
        
        {/* Achievement badge */}
        <Animated.View
          style={[
            styles.achievementBadge,
            {
              backgroundColor: theme.accent,
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.achievementIcon}>🏆</Text>
          <Text style={styles.achievementText}>
            {celebration.achievement}
          </Text>
        </Animated.View>
        
        {/* Key insight message */}
        <View style={[styles.insightContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Text style={[styles.insightTitle, { color: theme.accent }]}>
            🧠 You just proved something amazing:
          </Text>
          <Text style={[styles.insightText, { color: theme.text }]}>
            You <Text style={[styles.boldText, { color: theme.accent }]}>CAN</Text> draw! 
            {'\n'}Everything starts with simple shapes.
          </Text>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>1</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Drawing</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>5</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Objects Created</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>∞</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Possibilities</Text>
          </View>
        </View>
        
        {/* Continue button */}
        <Button
          title="I'm ready to learn more!"
          onPress={handleContinue}
          style={styles.continueButton}
        />
        
        <Text style={[styles.footerText, { color: theme.textTertiary }]}>
          Next: Let's find your perfect learning level
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
  },
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confettiParticle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: width - 48,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Display-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 32,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  achievementText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Bold',
  },
  insightContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    width: '100%',
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Semibold',
    marginBottom: 8,
    textAlign: 'center',
  },
  insightText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  boldText: {
    fontFamily: 'SF-Pro-Text-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'SF-Pro-Text-Medium',
    textAlign: 'center',
    marginTop: 4,
  },
  continueButton: {
    width: '100%',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
  },
});