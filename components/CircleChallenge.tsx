import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
  Alert,
} from 'react-native';
import { TouchDrawingCanvas } from './TouchDrawingCanvas';
import { MagicTransformation } from './MagicTransformation';

const { width, height } = Dimensions.get('window');

export const CircleChallenge: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'drawing' | 'transformation' | 'celebration'>('welcome');
  const [drawnPath, setDrawnPath] = useState<Array<{x: number, y: number}>>([]);
  const [isCircleDetected, setIsCircleDetected] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDrawingComplete = (path: Array<{x: number, y: number}>) => {
    setDrawnPath(path);
    
    // Simple circle detection algorithm
    if (detectCircle(path)) {
      setIsCircleDetected(true);
      Vibration.vibrate(100); // Haptic feedback
      
      // Move to transformation step
      setTimeout(() => {
        setCurrentStep('transformation');
      }, 500);
    }
  };

  const detectCircle = (path: Array<{x: number, y: number}>): boolean => {
    if (path.length < 20) return false;
    
    // Calculate center point
    const centerX = path.reduce((sum, point) => sum + point.x, 0) / path.length;
    const centerY = path.reduce((sum, point) => sum + point.y, 0) / path.length;
    
    // Calculate average distance from center
    const distances = path.map(point => 
      Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2))
    );
    const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    
    // Check if most points are roughly the same distance from center (circle-like)
    const tolerance = avgDistance * 0.3;
    const circularPoints = distances.filter(dist => Math.abs(dist - avgDistance) < tolerance);
    
    return circularPoints.length > path.length * 0.7; // 70% of points should be roughly circular
  };

  const startDrawing = () => {
    setCurrentStep('drawing');
  };

  const handleTransformationComplete = () => {
    setCurrentStep('celebration');
    Vibration.vibrate([100, 50, 100]); // Success haptic pattern
  };

  if (currentStep === 'welcome') {
    return (
      <Animated.View 
        style={[
          styles.container, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.welcomeContent}>
          <Text style={styles.title}>Let's start simple...</Text>
          <Text style={styles.subtitle}>Can you draw a circle?</Text>
          <Text style={styles.encouragement}>Any circle is perfect! ✨</Text>
          
          <Animated.View style={styles.circleExample}>
            <View style={styles.exampleCircle} />
          </Animated.View>
          
          <Text 
            style={styles.startButton}
            onPress={startDrawing}
          >
            Yes, I can try! 🎨
          </Text>
        </View>
      </Animated.View>
    );
  }

  if (currentStep === 'drawing') {
    return (
      <View style={styles.container}>
        <View style={styles.drawingHeader}>
          <Text style={styles.drawingTitle}>Draw your circle here</Text>
          <Text style={styles.drawingSubtitle}>Use your finger - don't worry about making it perfect!</Text>
        </View>
        
        <TouchDrawingCanvas
          onDrawingComplete={handleDrawingComplete}
          width={width - 40}
          height={height * 0.6}
        />
        
        <View style={styles.drawingFooter}>
          <Text style={styles.encouragingText}>
            {drawnPath.length > 0 ? "Looking great! Keep going..." : "Touch and drag to draw"}
          </Text>
        </View>
      </View>
    );
  }

  if (currentStep === 'transformation') {
    return (
      <MagicTransformation
        originalPath={drawnPath}
        onTransformationComplete={handleTransformationComplete}
      />
    );
  }

  if (currentStep === 'celebration') {
    return (
      <View style={styles.container}>
        <View style={styles.celebrationContent}>
          <Text style={styles.celebrationTitle}>🎉 AMAZING! 🎉</Text>
          <Text style={styles.celebrationText}>You just drew 5 things!</Text>
          <Text style={styles.celebrationSubtext}>
            • A smiley face 😊{'\n'}
            • A bright sun ☀️{'\n'}
            • A spinning wheel 🎡{'\n'}
            • A delicious pizza 🍕{'\n'}
            • A working clock 🕐
          </Text>
          
          <Text style={styles.transformationMessage}>
            See? You CAN draw!{'\n'}Let's unlock what else you can create...
          </Text>
          
          <Text 
            style={styles.continueButton}
            onPress={() => Alert.alert('Next Steps', 'Ready for your first lesson?')}
          >
            Continue the Journey 🚀
          </Text>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 12,
  },
  encouragement: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  circleExample: {
    marginBottom: 40,
  },
  exampleCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  startButton: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    textAlign: 'center',
    overflow: 'hidden',
  },
  drawingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  drawingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  drawingSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  drawingFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  encouragingText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  celebrationContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  celebrationTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
  },
  celebrationSubtext: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'left',
    lineHeight: 28,
    marginBottom: 30,
  },
  transformationMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  continueButton: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    textAlign: 'center',
    overflow: 'hidden',
  },
});