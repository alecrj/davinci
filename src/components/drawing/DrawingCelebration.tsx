import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { ensureGradientColors } from '@/utils/colors/gradientHelper';
import { ShapeType, sanitizeShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

interface DrawingCelebrationProps {
  shapeName: string | ShapeType;
  onComplete: () => void;
  userArtwork?: any;
}

export const DrawingCelebration: React.FC<DrawingCelebrationProps> = ({ 
  shapeName, 
  onComplete, 
  userArtwork 
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [celebrationStage, setCelebrationStage] = useState<'appearing' | 'celebrating' | 'complete'>('appearing');
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));

  // ✅ FIXED: Safely convert shapeName to valid ShapeType
  const validShapeType = sanitizeShapeType(typeof shapeName === 'string' ? shapeName : shapeName);

  // ✅ FIXED: Complete celebration messages covering all shape types
  const celebrationMessages: Record<ShapeType, { title: string; subtitle: string; achievement: string }> = {
    circle: {
      title: "Perfect Circle! 🎯",
      subtitle: "Your circle drawing shows excellent control and confidence!",
      achievement: "Circle Master"
    },
    square: {
      title: "Amazing Square! 📐",
      subtitle: "Your square demonstrates great precision and steady hands!",
      achievement: "Shape Builder"
    },
    triangle: {
      title: "Fantastic Triangle! 🔺",
      subtitle: "Your triangle shows wonderful geometric understanding!",
      achievement: "Angle Master"
    },
    rectangle: {
      title: "Excellent Rectangle! ▭",
      subtitle: "Your rectangle displays perfect proportional thinking!",
      achievement: "Structure Expert"
    },
    star: {
      title: "Brilliant Star! ⭐",
      subtitle: "Your star shows creative flair and artistic expression!",
      achievement: "Star Creator"
    },
    heart: {
      title: "Beautiful Heart! 💖",
      subtitle: "Your heart shape shows artistic sensitivity and style!",
      achievement: "Heart Artist"
    },
    line: {
      title: "Confident Line! ➡️",
      subtitle: "Your line demonstrates excellent control and purpose!",
      achievement: "Line Master"
    },
    arrow: {
      title: "Sharp Arrow! ➡️",
      subtitle: "Your arrow shows directional clarity and precision!",
      achievement: "Direction Expert"
    },
    spiral: {
      title: "Flowing Spiral! 🌀",
      subtitle: "Your spiral demonstrates fluid motion and rhythm!",
      achievement: "Flow Master"
    },
    squiggle: {
      title: "Creative Squiggle! 〰️",
      subtitle: "Your squiggle shows free expression and creativity!",
      achievement: "Free Spirit"
    },
    unknown: {
      title: "Creative Expression! 🎨",
      subtitle: "Your unique shape shows artistic creativity and imagination!",
      achievement: "Creative Explorer"
    }
  };

  const celebration = celebrationMessages[validShapeType]; // ✅ FIXED: Safe property access

  useEffect(() => {
    startCelebrationAnimation();
  }, []);

  const startCelebrationAnimation = () => {
    // Stage 1: Appear (500ms)
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCelebrationStage('celebrating');
    });

    // Stage 2: Celebrate (1.5 seconds)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setCelebrationStage('complete');
      });
    }, 500);
  };

  const handleContinue = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounceInterpolation = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={ensureGradientColors(['rgba(255, 107, 107, 0.1)', 'rgba(78, 205, 196, 0.1)'])}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View 
        style={[
          styles.celebrationContent,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolation }
            ],
            opacity: opacityAnim,
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.achievementBadge,
            {
              transform: [{ scale: bounceInterpolation }]
            }
          ]}
        >
          <LinearGradient
            colors={ensureGradientColors(['#FFD700', '#FFA500'])}
            style={styles.badgeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.achievementText}>{celebration.achievement}</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={[styles.celebrationTitle, { color: colors.primary }]}>
          {celebration.title}
        </Text>

        <Text style={[styles.celebrationSubtitle, { color: colors.text }]}>
          {celebration.subtitle}
        </Text>

        {userArtwork && (
          <View style={[styles.artworkContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.artworkLabel, { color: colors.textSecondary }]}>
              Your Amazing Creation:
            </Text>
            {/* User artwork would be rendered here */}
          </View>
        )}

        <View style={styles.encouragementContainer}>
          <Text style={[styles.encouragementText, { color: colors.textSecondary }]}>
            ✨ You're becoming a confident artist! ✨
          </Text>
          <Text style={[styles.progressText, { color: colors.primary }]}>
            Keep practicing to unlock more shapes and techniques!
          </Text>
        </View>

        {celebrationStage === 'complete' && (
          <Button
            title="Continue Learning"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueButton}
          />
        )}
      </Animated.View>

      {/* Floating celebration particles effect */}
      <View style={styles.particlesContainer}>
        <Animated.Text style={[styles.particle, { 
          opacity: opacityAnim,
          transform: [{ rotate: rotateInterpolation }]
        }]}>
          🎉
        </Animated.Text>
        <Animated.Text style={[styles.particle, styles.particle2, { 
          opacity: opacityAnim,
          transform: [{ rotate: rotateInterpolation }]
        }]}>
          ⭐
        </Animated.Text>
        <Animated.Text style={[styles.particle, styles.particle3, { 
          opacity: opacityAnim,
          transform: [{ rotate: rotateInterpolation }]
        }]}>
          🎨
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  celebrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
  },
  achievementBadge: {
    marginBottom: 30,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  badgeGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  celebrationSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  artworkContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  artworkLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  encouragementContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  encouragementText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  continueButton: {
    paddingHorizontal: 40,
    minWidth: 200,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    fontSize: 30,
    top: '20%',
    left: '20%',
  },
  particle2: {
    top: '30%',
    right: '20%',
    left: 'auto',
  },
  particle3: {
    bottom: '30%',
    left: '50%',
    top: 'auto',
  },
});

export default DrawingCelebration;