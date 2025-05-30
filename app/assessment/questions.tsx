import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    score: number; // 0-4 points for skill level calculation
  }>;
}

const questions: Question[] = [
  {
    id: 'experience',
    question: 'How would you describe your drawing experience?',
    options: [
      { id: 'none', text: 'Complete beginner - I rarely draw', score: 0 },
      { id: 'little', text: 'I doodle sometimes', score: 1 },
      { id: 'some', text: 'I draw as a hobby occasionally', score: 2 },
      { id: 'regular', text: 'I draw regularly and take it seriously', score: 3 },
      { id: 'advanced', text: 'I have formal training or professional experience', score: 4 },
    ],
  },
  {
    id: 'comfort',
    question: 'Which best describes your comfort level with basic shapes?',
    options: [
      { id: 'struggle', text: 'I struggle with even simple circles and lines', score: 0 },
      { id: 'basic', text: 'I can draw basic shapes but they\'re not very neat', score: 1 },
      { id: 'decent', text: 'I can draw shapes pretty well', score: 2 },
      { id: 'confident', text: 'I\'m confident with shapes and proportions', score: 3 },
      { id: 'expert', text: 'I can draw complex shapes and forms accurately', score: 4 },
    ],
  },
  {
    id: 'goals',
    question: 'What\'s your main goal with drawing?',
    options: [
      { id: 'fun', text: 'Just for fun and relaxation', score: 1 },
      { id: 'hobby', text: 'Develop it as a serious hobby', score: 2 },
      { id: 'specific', text: 'Learn specific styles (manga, realism, etc.)', score: 3 },
      { id: 'professional', text: 'Build professional skills', score: 4 },
      { id: 'confidence', text: 'Gain confidence that I CAN draw', score: 0 },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you dedicate to drawing practice?',
    options: [
      { id: 'minimal', text: '2-3 minutes when I remember', score: 0 },
      { id: 'short', text: '5-10 minutes most days', score: 1 },
      { id: 'regular', text: '15-20 minutes daily', score: 2 },
      { id: 'dedicated', text: '30+ minutes regularly', score: 3 },
      { id: 'intensive', text: '1+ hours when possible', score: 4 },
    ],
  },
  {
    id: 'previous',
    question: 'Have you tried learning to draw before?',
    options: [
      { id: 'never', text: 'No, this is my first time', score: 0 },
      { id: 'failed', text: 'Yes, but I gave up because it was too hard', score: 1 },
      { id: 'some', text: 'A little, but never stuck with it', score: 2 },
      { id: 'classes', text: 'I\'ve taken some classes or courses', score: 3 },
      { id: 'self-taught', text: 'I\'ve learned a lot on my own', score: 4 },
    ],
  },
];

export default function AssessmentQuestions() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canContinue = selectedOption !== null;
  
  // Animation when question changes
  useEffect(() => {
    setSelectedOption(answers[currentQuestion.id] || null);
    
    // Slide in animation
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
  }, [currentQuestionIndex]);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };
  
  const handleNext = () => {
    if (!canContinue) return;
    
    if (isLastQuestion) {
      // Calculate total score and proceed to drawing test
      const totalScore = calculateTotalScore();
      router.push({
        pathname: '/assessment/drawing-test',
        params: { questionScore: totalScore.toString() },
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      router.back();
    }
  };
  
  const calculateTotalScore = (): number => {
    let total = 0;
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === answerId);
      if (option) {
        total += option.score;
      }
    });
    return total;
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with progress */}
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
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      </View>
      
      {/* Question Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.question, { color: theme.text }]}>
          {currentQuestion.question}
        </Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? theme.accentLight : theme.backgroundSecondary,
                    borderColor: isSelected ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => handleOptionSelect(option.id)}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        borderColor: isSelected ? theme.accent : theme.border,
                        backgroundColor: isSelected ? theme.accent : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? theme.accent : theme.text,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {option.text}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={[styles.backButton, { borderColor: theme.border }]}
          onPress={handleBack}
        >
          <Text style={[styles.backButtonText, { color: theme.textSecondary }]}>
            Back
          </Text>
        </Pressable>
        
        <Button
          title={isLastQuestion ? 'Continue to Drawing' : 'Next'}
          onPress={handleNext}
          disabled={!canContinue}
          style={[styles.nextButton, { opacity: canContinue ? 1 : 0.5 }]}
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
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
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
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flex: 2,
  },
});