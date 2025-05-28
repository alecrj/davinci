import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { DrawAnythingCanvas } from '@/components/drawing/DrawAnythingCanvas';
import { MagicTransformation } from '@/components/drawing/MagicTransformation';
import { DrawingCelebration } from '@/components/drawing/DrawingCelebration';
import { Button } from '@/components/ui/Button';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { triggerHaptic } from '@/utils/haptics';
import { ShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

type OnboardingStep = 'intro' | 'drawing' | 'transformation' | 'celebration';

export default function DrawAnythingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { updateProgress } = useUserProgress();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [detectedShape, setDetectedShape] = useState<ShapeType | null>(null);
  const [userDrawing, setUserDrawing] = useState<any>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);
  
  const handleDrawingComplete = (shape: ShapeType, drawing: any) => {
    setDetectedShape(shape);
    setUserDrawing(drawing);
    triggerHaptic('impact');
    
    // Transition to transformation
    setTimeout(() => {
      setCurrentStep('transformation');
    }, 500);
  };
  
  const handleTransformationComplete = () => {
    setCurrentStep('celebration');
    triggerHaptic('success');
  };
  
  const handleContinue = async () => {
    // Update user progress
    await updateProgress({
      hasCompletedOnboarding: true,
      isNewUser: false,
      totalDrawings: 1,
    });
    
    // Navigate to skill assessment
    router.push('/assessment');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Animated.View
            style={[
              styles.introContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.textContainer}>
              <AnimatedText
                style={[styles.title, { color: theme.text }]}
                delay={200}
              >
                Let's try something fun
              </AnimatedText>
              <AnimatedText
                style={[styles.subtitle, { color: theme.textSecondary }]}
                delay={400}
              >
                Draw anything you want
              </AnimatedText>
              <AnimatedText
                style={[styles.description, { color: theme.textTertiary }]}
                delay={600}
              >
                A circle, a line, a squiggle...{'\n'}
                Whatever feels right to you
              </AnimatedText>
            </View>
            
            <Animated.View
              style={[
                styles.exampleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Show subtle examples */}
              <View style={styles.examples}>
                <View style={[styles.exampleShape, styles.circle, { borderColor: theme.accent }]} />
                <View style={[styles.exampleShape, styles.square, { borderColor: theme.accent }]} />
                <View style={[styles.exampleShape, styles.squiggle, { backgroundColor: theme.accent }]} />
              </View>
            </Animated.View>
            
            <Button
              title="I'm ready to draw!"
              onPress={() => setCurrentStep('drawing')}
              style={styles.continueButton}
            />
          </Animated.View>
        );
        
      case 'drawing':
        return (
          <Animated.View
            style={[
              styles.drawingContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={[styles.drawingTitle, { color: theme.text }]}>
              Draw anything you like
            </Text>
            <Text style={[styles.drawingSubtitle, { color: theme.textSecondary }]}>
              Don't think too hard, just draw!
            </Text>
            
            <DrawAnythingCanvas
              onDrawingComplete={handleDrawingComplete}
              width={width - 40}
              height={height * 0.5}
            />
            
            <Text style={[styles.hint, { color: theme.textTertiary }]}>
              Use your finger to draw
            </Text>
          </Animated.View>
        );
        
      case 'transformation':
        return (
          <MagicTransformation
            detectedShape={detectedShape!}
            userDrawing={userDrawing}
            onComplete={handleTransformationComplete}
          />
        );
        
      case 'celebration':
        return (
          <DrawingCelebration
            shapeName={detectedShape!}
            onContinue={handleContinue}
          />
        );
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {renderStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
    lineHeight: 26,
  },
  exampleContainer: {
    marginBottom: 60,
  },
  examples: {
    flexDirection: 'row',
    gap: 30,
  },
  exampleShape: {
    width: 60,
    height: 60,
  },
  circle: {
    borderRadius: 30,
    borderWidth: 3,
  },
  square: {
    borderWidth: 3,
  },
  squiggle: {
    height: 3,
    borderRadius: 2,
  },
  continueButton: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
  },
  drawingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawingTitle: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Display-Semibold',
    marginBottom: 8,
  },
  drawingSubtitle: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Text-Regular',
    marginBottom: 40,
  },
  hint: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
    marginTop: 20,
  },
});