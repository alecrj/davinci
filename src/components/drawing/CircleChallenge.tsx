import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text } from '@/components/Themed';
import { TouchDrawingCanvas, MagicTransformation } from '@/components/drawing';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { uiHaptics } from '@/utils/haptics';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { Point, ShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

interface CircleChallengeProps {
  onComplete: (result: { accuracy: number; timeSpent: number }) => void;
}

export const CircleChallenge: React.FC<CircleChallengeProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPath, setDrawnPath] = useState<Point[]>([]);
  const [showTransformation, setShowTransformation] = useState(false);
  const [startTime] = useState(Date.now());
  const [challengeComplete, setChallengeComplete] = useState(false);
  
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  // Calculate canvas dimensions for iPad optimization
  const canvasWidth = Math.min(width - 40, 600); // Max 600px for iPad optimization
  const canvasHeight = Math.min(height * 0.6, 400); // Responsive height

  useEffect(() => {
    // Start challenge animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDrawingComplete = (path: Point[]) => {
    setDrawnPath(path);
    setIsDrawing(false);
    
    if (path.length > 5) {
      // Analyze the drawn shape
      const detectedShape = detectShape(path);
      
      if (detectedShape && detectedShape.type === 'circle') {
        // Good circle detected
        uiHaptics.actionSuccess();
        handleTransformationComplete();
      } else {
        // Not quite a circle, show transformation
        setShowTransformation(true);
      }
    }
  };

  const handleTransformationComplete = () => {
    setShowTransformation(false);
    setChallengeComplete(true);
    
    const timeSpent = Date.now() - startTime;
    const accuracy = calculateCircleAccuracy(drawnPath);
    
    // Fade out and complete
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onComplete({ accuracy, timeSpent });
    });
  };

  const calculateCircleAccuracy = (path: Point[]): number => {
    if (path.length < 5) return 0;
    
    // Simple circle accuracy calculation
    const detectedShape = detectShape(path);
    if (detectedShape && detectedShape.type === 'circle') {
      return Math.min(detectedShape.confidence * 100, 100);
    }
    
    return Math.max(30, Math.random() * 40 + 30); // Minimum 30% for effort
  };

  const handleRetry = () => {
    setDrawnPath([]);
    setIsDrawing(false);
    setShowTransformation(false);
    setChallengeComplete(false);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (showTransformation) {
    return (
      <MagicTransformation
        shape="circle"
        userDrawing={drawnPath}
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
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Circle Challenge
        </Text>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Draw a circle on the canvas below. Try to make it as round as possible!
        </Text>
      </View>

      <View style={[styles.canvasContainer, { backgroundColor: colors.card }]}>
        <View style={styles.targetGuide}>
          <View style={[styles.guideLine, { borderColor: colors.primary + '40' }]} />
          <Text style={[styles.guideText, { color: colors.textSecondary }]}>
            Try to draw a circle here
          </Text>
        </View>
        
        <TouchDrawingCanvas
          onDrawingComplete={handleDrawingComplete}
          style={[styles.canvas, { 
            width: canvasWidth, 
            height: canvasHeight,
            backgroundColor: colors.card 
          }]}
        />
      </View>

      <View style={styles.controls}>
        {drawnPath.length > 0 && !challengeComplete && (
          <Button
            title="Try Again"
            onPress={handleRetry}
            variant="outline"
            size="medium"
            style={styles.retryButton}
          />
        )}
        
        {challengeComplete && (
          <View style={styles.completionMessage}>
            <Text style={[styles.completionText, { color: colors.primary }]}>
              🎉 Great job! Your circle drawing skills are improving!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tips}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Tips:</Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Start slow and focus on smooth, curved movements
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Try to connect the start and end points
        </Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          • Practice makes perfect - don't worry about being perfect!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  canvasContainer: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  targetGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  guideLine: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderStyle: 'dashed',
    position: 'absolute',
  },
  guideText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  canvas: {
    borderRadius: 12,
    zIndex: 2,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 30,
  },
  completionMessage: {
    alignItems: 'center',
    padding: 20,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  tips: {
    marginTop: 20,
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

export default CircleChallenge;