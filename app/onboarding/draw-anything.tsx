import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Themed';
import { DrawAnythingCanvas, MagicTransformation } from '@/components/drawing';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';
import { ShapeType, sanitizeShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

export default function DrawAnythingOnboardingScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { updateProgress } = useUserProgress();
  
  const [currentStep, setCurrentStep] = useState(1); // Track which shape we're on
  const [completedShapes, setCompletedShapes] = useState<string[]>([]);
  const [showTransformation, setShowTransformation] = useState(false);
  const [detectedShape, setDetectedShape] = useState<ShapeType>('unknown');
  const [userDrawing, setUserDrawing] = useState<any>(null);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const canvasRef = useRef<any>(null);

  const shapes = [
    { instruction: "Draw a simple circle", emoji: "⭕", expected: "circle" },
    { instruction: "Draw a wavy line like ocean waves", emoji: "🌊", expected: "wave" },
    { instruction: "Draw a triangle - any size!", emoji: "🔺", expected: "triangle" },
  ];

  const currentShape = shapes[currentStep - 1];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShapeDetected = (shape: string) => {
    const validShape = sanitizeShapeType(shape);
    setDetectedShape(validShape);
    setUserDrawing({ shape: validShape, timestamp: Date.now() });
    
    uiHaptics.shapeDetected();
    
    setTimeout(() => {
      setShowTransformation(true);
    }, 500);
  };

  const handleTransformationComplete = () => {
    setShowTransformation(false);
    setCompletedShapes([...completedShapes, detectedShape]);
    
    if (currentStep < 3) {
      // Move to next shape
      setCurrentStep(currentStep + 1);
      handleClear();
    } else {
      // All shapes complete - update progress and move to artist setup
      updateProgress({
        hasCompletedOnboarding: false, // Not done yet!
        currentLevel: 1,
        xp: 150, // Big XP for completing transformation
        streakDays: 1,
        lastActivity: new Date().toISOString(),
      });
      
      uiHaptics.celebration();
      
      // Move to artist setup
      setTimeout(() => {
        router.push('/onboarding/artist-setup');
      }, 1000);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    setDetectedShape('unknown');
    setUserDrawing(null);
    setShowTransformation(false);
    
    uiHaptics.buttonPress();
  };

  if (showTransformation) {
    return (
      <MagicTransformation
        shape={detectedShape}
        userDrawing={userDrawing}
        onComplete={handleTransformationComplete}
      />
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          opacity: fadeAnim 
        }
      ]}
    >
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {shapes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              { backgroundColor: colors.border },
              index < currentStep && { backgroundColor: colors.primary },
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
          Step {currentStep} of 3
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {currentShape.emoji} {currentShape.instruction}
        </Text>
        <Text style={[styles.encouragement, { color: colors.primary }]}>
          {currentStep === 1 
            ? "Don't worry about perfection - just draw!"
            : currentStep === 2 
            ? "You're doing great! Keep going!"
            : "One more - you're almost an artist!"
          }
        </Text>
      </View>

      <View style={[styles.canvasContainer, { backgroundColor: colors.card }]}>
        <DrawAnythingCanvas
          ref={canvasRef}
          style={styles.canvas}
          onShapeDetected={handleShapeDetected}
          showGuides={false}
          enableShapeDetection={true}
        />
      </View>

      <View style={styles.controls}>
        <Button
          title="Clear"
          onPress={handleClear}
          variant="outline"
          size="medium"
          style={styles.clearButton}
        />
      </View>

      {/* Show completed shapes */}
      {completedShapes.length > 0 && (
        <View style={styles.completedContainer}>
          <Text style={[styles.completedText, { color: colors.textSecondary }]}>
            Completed: {completedShapes.map((shape, i) => 
              i === 0 ? '✅ Circle' : i === 1 ? ' ✅ Waves' : ''
            ).join('')}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  encouragement: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  canvasContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  canvas: {
    flex: 1,
  },
  controls: {
    marginBottom: 20,
  },
  clearButton: {
    width: '100%',
  },
  completedContainer: {
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
  },
});