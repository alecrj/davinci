// app/onboarding/draw-anything.tsx - FIXED CONTEXT PROPERTIES
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
  
  const [showTransformation, setShowTransformation] = useState(false);
  const [detectedShape, setDetectedShape] = useState<ShapeType>('unknown');
  const [userDrawing, setUserDrawing] = useState<any>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const canvasRef = useRef<any>(null);

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
    setHasDrawn(true);
    
    uiHaptics.shapeDetected();
    
    setTimeout(() => {
      setShowTransformation(true);
    }, 500);
  };

  const handleTransformationComplete = () => {
    setShowTransformation(false);
    
    // ✅ FIXED: Use correct UserProgress properties
    updateProgress({
      currentLevel: 1,
      xp: 50, // ✅ FIXED: This property now exists in context
      streakDays: 1,
      lastActivity: new Date().toISOString(),
    });
    
    uiHaptics.celebration();
    
    setTimeout(() => {
      router.replace('/');
    }, 1000);
  };

  const handleSkip = () => {
    // ✅ FIXED: Use correct UserProgress properties
    updateProgress({
      currentLevel: 1,
      xp: 10, // ✅ FIXED: This property now exists in context
      streakDays: 1,
      lastActivity: new Date().toISOString(),
    });
    
    router.replace('/');
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    setHasDrawn(false);
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Draw Anything
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Let's see what you can create! Draw anything that comes to mind.
        </Text>
        <Text style={[styles.encouragement, { color: colors.primary }]}>
          There's no right or wrong - just express yourself! ✨
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
        
        {!hasDrawn && (
          <View style={styles.canvasOverlay}>
            <Text style={[styles.overlayText, { color: colors.textSecondary }]}>
              Tap and draw on the canvas
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          {hasDrawn && (
            <Button
              title="Clear"
              onPress={handleClear}
              variant="outline"
              size="medium"
              style={styles.clearButton}
            />
          )}
          
          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="ghost"
            size="medium"
            style={styles.skipButton}
          />
        </View>

        {hasDrawn && (
          <View style={styles.detectionInfo}>
            <Text style={[styles.detectionText, { color: colors.textSecondary }]}>
              🎨 Great work! I can see you're getting creative.
            </Text>
            {detectedShape !== 'unknown' && (
              <Text style={[styles.shapeDetected, { color: colors.primary }]}>
                I detected a {detectedShape}! ✨
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.tips}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Quick Tips:</Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Try drawing simple shapes like circles, squares, or hearts
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Don't worry about perfection - we'll help you improve!
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Have fun and let your creativity flow!
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
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
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
  canvasOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  overlayText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  controls: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  skipButton: {
    flex: 1,
    marginLeft: 10,
  },
  detectionInfo: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
  },
  detectionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  shapeDetected: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tips: {
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
});