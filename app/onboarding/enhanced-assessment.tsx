import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { DrawAnythingCanvas } from '@/components/drawing';
import { useTheme } from '@/context/ThemeContext';
import { ensureGradientColors } from '@/utils/colors/gradientHelper';
import { uiHaptics } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

// iPad detection and optimization
const isIPad = Platform.OS === 'ios' && (width > 700 || height > 700);
const isLandscape = width > height;

interface OnboardingQuestion {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    value: string;
  }>;
}

export default function EnhancedOnboardingScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questions' | 'assessment' | 'results'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [drawingData, setDrawingData] = useState<any[]>([]);

  // iPad-optimized onboarding questions
  const questions: OnboardingQuestion[] = [
    {
      id: 'art_relationship',
      question: 'How do you view your relationship with digital art creation?',
      options: [
        { id: 'a', text: "I've avoided digital art - seems too complex", value: 'intimidated' },
        { id: 'b', text: "I drew traditionally but want to go digital professionally", value: 'transitioning' },
        { id: 'c', text: "I use iPad for basic sketches but want advanced techniques", value: 'developing' },
        { id: 'd', text: "I create digital art regularly but need professional development", value: 'advancing' },
        { id: 'e', text: "I'm a professional artist exploring iPad workflow", value: 'professional' },
      ]
    },
    {
      id: 'learning_style',
      question: 'How do you prefer to learn complex creative skills on iPad?',
      options: [
        { id: 'a', text: "Step-by-step Apple Pencil technique tutorials with pressure guidance", value: 'guided' },
        { id: 'b', text: "Quick professional demonstrations then independent exploration", value: 'independent' },
        { id: 'c', text: "Traditional technique translation to iPad with Apple Pencil", value: 'translation' },
        { id: 'd', text: "Technical theory foundation then advanced iPad implementation", value: 'theoretical' },
        { id: 'e', text: "Professional workflow immersion with advanced features", value: 'immersive' },
      ]
    },
    {
      id: 'creative_goals',
      question: 'What professional creative outcomes are you seeking?',
      options: [
        { id: 'a', text: "Portfolio development for professional opportunities", value: 'portfolio' },
        { id: 'b', text: "Educational curriculum integration for teaching", value: 'education' },
        { id: 'c', text: "Advanced technique mastery with pressure sensitivity", value: 'mastery' },
        { id: 'd', text: "Digital workflow transition from traditional mediums", value: 'transition' },
        { id: 'e', text: "Professional art career development pathway", value: 'career' },
      ]
    },
    {
      id: 'time_commitment',
      question: 'How much dedicated iPad learning time can you commit daily?',
      options: [
        { id: 'a', text: "10-15 minutes (focused professional skill building)", value: 'light' },
        { id: 'b', text: "20-30 minutes (serious digital art development)", value: 'moderate' },
        { id: 'c', text: "30-60 minutes (intensive professional technique mastery)", value: 'intensive' },
        { id: 'd', text: "60+ minutes (professional art career development focus)", value: 'dedicated' },
      ]
    },
    {
      id: 'concerns',
      question: 'What concerns you most about professional iPad art creation?',
      options: [
        { id: 'a', text: "My work won't look professional enough for portfolio use", value: 'quality' },
        { id: 'b', text: "I don't understand how to use Apple Pencil professionally", value: 'tools' },
        { id: 'c', text: "iPad seems limited compared to desktop professional tools", value: 'limitations' },
        { id: 'd', text: "I worry about transitioning from traditional to digital", value: 'transition' },
        { id: 'e', text: "I'm unsure about building a sustainable creative practice", value: 'sustainability' },
      ]
    }
  ];

  useEffect(() => {
    // iPad welcome experience optimization
    if (isIPad) {
      uiHaptics.tabSelection();
    }
  }, []);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    uiHaptics.buttonPress();
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('assessment');
    }
  };

  const handleAssessmentComplete = (drawingResult: any) => {
    setDrawingData(prev => [...prev, drawingResult]);
    uiHaptics.actionSuccess();
    
    // Move to results after a brief delay
    setTimeout(() => {
      setCurrentStep('results');
    }, 1000);
  };

  const handleComplete = () => {
    uiHaptics.celebration();
    router.push('/');
  };

  const renderWelcomeScreen = () => (
    <View style={[styles.welcomeContainer, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={ensureGradientColors(['rgba(0, 122, 255, 0.05)', 'rgba(88, 86, 214, 0.05)'])}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.welcomeContent}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          {isIPad ? 'Welcome to DaVinci for iPad' : 'Welcome to DaVinci'}
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.primary }]}>
          {isIPad 
            ? 'Where Artists Discover Professional Excellence' 
            : 'The Duolingo of Art'
          }
        </Text>
        <Text style={[styles.welcomeDescription, { color: colors.textSecondary }]}>
          {isIPad 
            ? 'In the next 7 minutes, experience why iPad is the ultimate drawing platform for artists, educators, and creative professionals.'
            : 'In the next 5 minutes, discover your artistic potential and unlock the artist within you.'
          }
        </Text>

        {isIPad && (
          <View style={[styles.ipadFeatures, { backgroundColor: colors.card }]}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>iPad Advantages:</Text>
            <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
              ✨ Apple Pencil pressure sensitivity for professional drawing
            </Text>
            <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
              🎨 Large canvas for detailed artwork and instruction
            </Text>
            <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
              💫 115-layer support for professional-grade compositions
            </Text>
            <Text style={[styles.featureItem, { color: colors.textSecondary }]}>
              📚 Split-screen learning optimized for education
            </Text>
          </View>
        )}

        <Button
          title={isIPad ? "Discover my professional potential" : "Discover my artistic potential"}
          onPress={() => setCurrentStep('questions')}
          variant="primary"
          size="large"
          style={styles.welcomeButton}
        />
      </View>
    </View>
  );

  const renderQuestionsScreen = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <View style={[styles.questionContainer, { backgroundColor: colors.background }]}>
        {/* Progress bar */}
        <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
          <LinearGradient
            colors={ensureGradientColors(['#007AFF', '#5856D6'])}
            style={[styles.progressBar, { width: `${progress}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.questionNumber, { color: colors.textSecondary }]}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          
          <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.question}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                title={option.text}
                onPress={() => handleAnswer(currentQuestion.id, option.value)}
                variant="outline"
                size={isIPad ? "large" : "medium"}
                style={[
                  styles.optionButton,
                  isIPad && styles.iPadOptionButton
                ]}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderAssessmentScreen = () => (
    <View style={[styles.assessmentContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.assessmentTitle, { color: colors.text }]}>
        {isIPad ? 'Professional Art DNA Assessment' : 'Art DNA Assessment'}
      </Text>
      <Text style={[styles.assessmentSubtitle, { color: colors.textSecondary }]}>
        {isIPad 
          ? 'Use your Apple Pencil to draw on the large canvas below. We\'ll analyze your technique and professional potential.'
          : 'Draw anything that comes to mind on the canvas below. There\'s no right or wrong - just express yourself!'
        }
      </Text>

      <View style={[styles.canvasContainer, { backgroundColor: colors.card }]}>
        <DrawAnythingCanvas
          style={styles.assessmentCanvas}
          onShapeDetected={(shape) => {
            handleAssessmentComplete({ shape, timestamp: Date.now() });
          }}
          showGuides={isIPad}
          enableShapeDetection={true}
        />
      </View>

      {isIPad && (
        <View style={[styles.iPadInstructions, { backgroundColor: colors.card }]}>
          <Text style={[styles.instructionTitle, { color: colors.text }]}>Apple Pencil Tips:</Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Vary pressure for different line weights
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Tilt your pencil for shading effects
          </Text>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
            • Rest your hand naturally - palm rejection is active
          </Text>
        </View>
      )}
    </View>
  );

  const renderResultsScreen = () => (
    <View style={[styles.resultsContainer, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={ensureGradientColors(['rgba(0, 122, 255, 0.1)', 'rgba(88, 86, 214, 0.1)'])}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView style={styles.resultsContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.resultsTitle, { color: colors.primary }]}>
          ✨ Your {isIPad ? 'Professional' : 'Artistic'} DNA Revealed!
        </Text>
        
        <View style={[styles.resultsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {isIPad ? 'Your Professional Track:' : 'Your Artist Type:'}
          </Text>
          <Text style={[styles.cardContent, { color: colors.primary }]}>
            {isIPad ? 'iPad Professional Artist' : 'Creative Explorer'}
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            {isIPad 
              ? 'You have the foundation for professional digital art creation with iPad and Apple Pencil. Your learning path will focus on industry-standard techniques and portfolio development.'
              : 'You have natural creative instincts and the willingness to explore. Your learning path will focus on building confidence and discovering your artistic voice.'
            }
          </Text>
        </View>

        <View style={[styles.resultsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {isIPad ? 'Professional Development Timeline:' : 'Your Learning Journey:'}
          </Text>
          <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
            {isIPad 
              ? 'At 30 minutes/day: Week 6 = Portfolio pieces, Week 16 = Professional workflow mastery'
              : 'At 10 minutes/day: Week 4 = Recognizable art, Week 12 = Personal artistic style'
            }
          </Text>
        </View>

        <Button
          title={isIPad ? "Begin Professional Development" : "Start My Art Journey"}
          onPress={handleComplete}
          variant="primary"
          size="large"
          style={styles.completeButton}
        />
      </ScrollView>
    </View>
  );

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'questions':
        return renderQuestionsScreen();
      case 'assessment':
        return renderAssessmentScreen();
      case 'results':
        return renderResultsScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isIPad ? 40 : 20,
  },
  welcomeContent: {
    alignItems: 'center',
    maxWidth: isIPad ? 600 : 400,
  },
  welcomeTitle: {
    fontSize: isIPad ? 48 : 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: isIPad ? 24 : 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeDescription: {
    fontSize: isIPad ? 18 : 16,
    textAlign: 'center',
    lineHeight: isIPad ? 26 : 24,
    marginBottom: 30,
  },
  ipadFeatures: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    width: '100%',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    paddingLeft: 8,
  },
  welcomeButton: {
    paddingHorizontal: isIPad ? 50 : 40,
    minWidth: isIPad ? 400 : 300,
  },

  // Questions Screen Styles
  questionContainer: {
    flex: 1,
    paddingTop: 60,
  },
  progressContainer: {
    height: 4,
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: isIPad ? 40 : 20,
  },
  questionNumber: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: isIPad ? 24 : 20,
    fontWeight: '600',
    lineHeight: isIPad ? 32 : 28,
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    marginBottom: 8,
  },
  iPadOptionButton: {
    paddingVertical: 20,
  },

  // Assessment Screen Styles
  assessmentContainer: {
    flex: 1,
    padding: isIPad ? 40 : 20,
    paddingTop: 60,
  },
  assessmentTitle: {
    fontSize: isIPad ? 28 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  assessmentSubtitle: {
    fontSize: isIPad ? 18 : 16,
    textAlign: 'center',
    lineHeight: isIPad ? 26 : 24,
    marginBottom: 30,
  },
  canvasContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: isIPad ? 20 : 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  assessmentCanvas: {
    flex: 1,
    minHeight: isIPad ? 400 : 300,
  },
  iPadInstructions: {
    padding: 20,
    borderRadius: 16,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 4,
  },

  // Results Screen Styles
  resultsContainer: {
    flex: 1,
    paddingTop: 60,
  },
  resultsContent: {
    flex: 1,
    paddingHorizontal: isIPad ? 40 : 20,
  },
  resultsTitle: {
    fontSize: isIPad ? 32 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  resultsCard: {
    padding: isIPad ? 30 : 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: isIPad ? 20 : 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: isIPad ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: isIPad ? 16 : 14,
    lineHeight: isIPad ? 24 : 20,
  },
  completeButton: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: isIPad ? 50 : 40,
  },
});