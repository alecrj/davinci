import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { ShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

interface DrawingCelebrationProps {
  shapeName: ShapeType;
  onContinue: () => void;
}

export const DrawingCelebration: React.FC<DrawingCelebrationProps> = ({
  shapeName,
  onContinue,
}) => {
  const { theme } = useTheme();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const confettiAnims = useRef(
    Array(20).fill(0).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;
  
  useEffect(() => {
    // Main content animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Confetti animation
    confettiAnims.forEach((anim, index) => {
      const randomX = (Math.random() - 0.5) * width;
      const randomRotate = Math.random() * 720 - 360;
      
      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: randomX,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: height,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: randomRotate,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1500),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);
  
  const getSuccessMessage = () => {
    const messages = {
      circle: "You didn't just draw a circle - you created 5 amazing things!",
      square: "Your square transformed into 5 incredible objects!",
      triangle: "That triangle became 5 wonderful creations!",
      line: "Your simple line turned into 5 beautiful things!",
      squiggle: "Your squiggle transformed into 5 artistic masterpieces!",
      star: "Your star shines in 5 different ways!",
      heart: "Your heart created 5 expressions of beauty!",
      spiral: "Your spiral evolved into 5 fascinating forms!",
      unknown: "Your unique creation became 5 amazing works of art!",
    };
    
    return messages[shapeName] || messages.unknown;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Confetti */}
      {confettiAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: index % 2 ? theme.accent : theme.accentLight,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                { rotate: anim.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
              opacity: anim.opacity,
            },
          ]}
        />
      ))}
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.emoji, { fontSize: 80 }]}>🎉</Text>
        
        <Text style={[styles.title, { color: theme.text }]}>
          Amazing!
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {getSuccessMessage()}
        </Text>
        
        <View style={styles.achievements}>
          <Text style={[styles.achievementTitle, { color: theme.text }]}>
            You just proved you can draw:
          </Text>
          <Text style={[styles.achievementList, { color: theme.textSecondary }]}>
            ✓ Faces that smile{'\n'}
            ✓ Objects that shine{'\n'}
            ✓ Things that move{'\n'}
            ✓ Items we use daily{'\n'}
            ✓ Art that inspires
          </Text>
        </View>
        
        <Text style={[styles.revelation, { color: theme.accent }]}>
          You ARE an artist!
        </Text>
        
        <Button
          title="Discover What Else I Can Do"
          onPress={onContinue}
          size="large"
          style={styles.continueButton}
        />
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
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: -10,
    borderRadius: 5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  achievements: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    width: '100%',
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Semibold',
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementList: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
    lineHeight: 26,
  },
  revelation: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 40,
  },
  continueButton: {
    minWidth: 280,
  },
});