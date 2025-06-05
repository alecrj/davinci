// app/assessment/drawing-test.tsx - FIXED TIMER AND CONTEXT TYPES
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { DrawAnythingCanvas } from '@/components/drawing/DrawAnythingCanvas';
import { Button } from '@/components/ui/Button';
import { ShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

interface DrawingExercise {
  id: string;
  title: string;
  instruction: string;
  targetShape: ShapeType;
  timeLimit: number;
  points: number;
}

const exercises: DrawingExercise[] = [
  {
    id: 'circle',
    title: 'Draw a Circle',
    instruction: 'Draw a simple circle. Don\'t worry about perfection!',
    targetShape: 'circle',
    timeLimit: 30,
    points: 2,
  },
  {
    id: 'square',
    title: 'Draw a Square',
    instruction: 'Draw a square or rectangle. Take your time!',
    targetShape: 'square',
    timeLimit: 30,
    points: 2,
  },
];

type SkillLevel = 'beginner' | 'casual' | 'hobby' | 'student' | 'advanced';

export default function AssessmentDrawingTest() {
  const router = useRouter();
  const { theme } = useTheme();
  const { updateProgress } = useUserProgress();
  const { questionScore } = useLocalSearchParams<{ questionScore: string }>();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<Array<{
    exerciseId: string;
    completed: boolean;
    shapeDetected: ShapeType | null;
    accuracy: number;
    timeSpent: number;
  }>>([]);
  const [timeLeft, setTimeLeft] = useState(exercises[0].timeLimit);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  
  // ✅ FIXED: Proper timer type
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  
  // Timer effect
  useEffect(() => {
    if (hasStarted && timeLeft > 0) {
      // ✅ FIXED: Proper timer typing
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        
        if (timeLeft <= 10) {
          Animated.sequence([
            Animated.timing(timerAnim, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(timerAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleExerciseComplete(null, null);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, hasStarted]);
  
  useEffect(() => {
    setTimeLeft(currentExercise.timeLimit);
    setHasStarted(false);
    setIsDrawing(false);
    
    slideAnim.setValue(30);
    fadeAnim.setValue(0.7);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentExerciseIndex]);
  
  const handleStartDrawing = () => {
    setHasStarted(true);
    startTimeRef.current = Date.now();
  };
  
  const handleDrawingComplete = (shape: ShapeType, drawing: any) => {
    if (!hasStarted) return;
    
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
    handleExerciseComplete(shape, timeSpent);
  };
  
  const handleExerciseComplete = (detectedShape: ShapeType | null, timeSpent: number | null) => {
    const exerciseResult = {
      exerciseId: currentExercise.id,
      completed: detectedShape === currentExercise.targetShape,
      shapeDetected: detectedShape,
      accuracy: calculateAccuracy(detectedShape, currentExercise.targetShape),
      timeSpent: timeSpent || currentExercise.timeLimit,
    };
    
    setExerciseResults(prev => [...prev, exerciseResult]);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setTimeout(() => {
      if (isLastExercise) {
        completeAssessment([...exerciseResults, exerciseResult]);
      } else {
        setCurrentExerciseIndex(prev => prev + 1);
      }
    }, 1500);
  };
  
  const calculateAccuracy = (detected: ShapeType | null, target: ShapeType): number => {
    if (detected === target) return 1.0;
    if (detected === null) return 0.0;
    
    const shapeGroups = {
      'circle': ['circle'],
      'square': ['square', 'triangle'],
      'line': ['line'],
    };
    
    const targetGroup = Object.entries(shapeGroups).find(([_, shapes]) => 
      shapes.includes(target)
    );
    
    if (targetGroup && targetGroup[1].includes(detected)) {
      return 0.5;
    }
    
    return 0.0;
  };
  
  const completeAssessment = async (allResults: typeof exerciseResults) => {
    const questionPoints = parseInt(questionScore || '0');
    const drawingPoints = allResults.reduce((sum, result) => 
      sum + (result.accuracy * exercises.find(e => e.id === result.exerciseId)!.points), 0
    );
    
    const totalScore = questionPoints + drawingPoints;
    const skillLevel = determineSkillLevel(totalScore);
    
    // ✅ FIXED: Use correct assessment results structure
    await updateProgress({
      hasCompletedAssessment: true,
      skillLevel,
      assessmentScore: totalScore,
      assessmentResults: [{
        questionScore: questionPoints,
        drawingScore: drawingPoints,
        totalScore,
        exercises: allResults,
      }],
    });
    
    router.replace('/(tabs)');
  };
  
  const determineSkillLevel = (totalScore: number): SkillLevel => {
    if (totalScore >= 20) return 'advanced';
    if (totalScore >= 15) return 'student';
    if (totalScore >= 10) return 'hobby';
    if (totalScore >= 5) return 'casual';
    return 'beginner';
  };
  
  const progressPercentage = ((currentExerciseIndex + 1) / exercises.length) * 100;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.accent,
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Text>
        </View>
        
        <Animated.View
          style={[
            styles.timerContainer,
            {
              backgroundColor: timeLeft <= 10 ? theme.warning : theme.backgroundSecondary,
              transform: [{ scale: timerAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.timerText,
              {
                color: timeLeft <= 10 ? 'white' : theme.text,
                fontFamily: timeLeft <= 10 ? 'SF-Pro-Text-Bold' : 'SF-Pro-Text-Medium',
              },
            ]}
          >
            {timeLeft}s
          </Text>
        </Animated.View>
      </View>
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.exerciseHeader}>
          <Text style={[styles.exerciseTitle, { color: theme.text }]}>
            {currentExercise.title}
          </Text>
          <Text style={[styles.exerciseInstruction, { color: theme.textSecondary }]}>
            {currentExercise.instruction}
          </Text>
        </View>
        
        {!hasStarted ? (
          <View style={styles.startContainer}>
            <View style={[styles.canvasPlaceholder, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.placeholderText, { color: theme.textTertiary }]}>
                Drawing canvas will appear here
              </Text>
            </View>
            
            <Button
              title="Start Drawing"
              onPress={handleStartDrawing}
              style={styles.startButton}
            />
          </View>
        ) : (
          <View style={styles.drawingContainer}>
            <DrawAnythingCanvas
              onDrawingComplete={handleDrawingComplete}
              width={width - 40}
              height={height * 0.45}
            />
            
            <Text style={[styles.drawingHint, { color: theme.textTertiary }]}>
              Draw with your finger - you have {timeLeft} seconds
            </Text>
          </View>
        )}
      </Animated.View>
      
      <View style={styles.bottomNav}>
        <Button
          title="Skip this exercise"
          onPress={() => handleExerciseComplete(null, null)}
          variant="secondary"
          style={styles.skipButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Text-Regular',
  },
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  exerciseTitle: {
    fontSize: 28,
    fontFamily: 'SF-Pro-Display-Semibold',
    marginBottom: 8,
  },
  exerciseInstruction: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
  },
  startContainer: {
    alignItems: 'center',
    gap: 32,
  },
  canvasPlaceholder: {
    width: width - 40,
    height: height * 0.45,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Text-Regular',
  },
  startButton: {
    width: width - 80,
  },
  drawingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  drawingHint: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
  },
  bottomNav: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
});