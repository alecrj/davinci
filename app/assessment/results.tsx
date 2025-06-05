// app/assessment/results.tsx - FIXED NAVIGATION
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ensureGradientColors } from '@/utils/colors/gradientHelper';

const { width, height } = Dimensions.get('window');

export default function AssessmentResults() {
  const { theme } = useTheme();
  const { colors } = theme;
  const router = useRouter();
  const { progress } = useUserProgress();
  
  const [animationValue] = useState(new Animated.Value(0));
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    setTimeout(() => {
      setShowResults(true);
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  const getSkillLevelInfo = (level: string) => {
    const levels = {
      beginner: {
        emoji: '🌱',
        title: 'Beginning Artist',
        description: 'Perfect starting point! We\'ll build your confidence step by step.',
        color: '#4CAF50',
      },
      casual: {
        emoji: '🎨',
        title: 'Casual Creator',
        description: 'You have some experience! Let\'s refine your skills.',
        color: '#2196F3',
      },
      hobby: {
        emoji: '✨',
        title: 'Hobby Artist',
        description: 'Great foundation! Ready for more advanced techniques.',
        color: '#9C27B0',
      },
      student: {
        emoji: '🎯',
        title: 'Art Student',
        description: 'Strong skills! Time to master professional techniques.',
        color: '#FF9800',
      },
      advanced: {
        emoji: '🏆',
        title: 'Advanced Artist',
        description: 'Excellent skills! Ready for complex challenges.',
        color: '#F44336',
      },
    };
    
    return levels[level as keyof typeof levels] || levels.beginner;
  };

  const skillInfo = getSkillLevelInfo(progress.skillLevel || 'beginner');

  const handleStartLearning = () => {
    // ✅ FIXED: Use Link component navigation instead of router.push
    router.replace('/(tabs)');
  };

  const handleRetakeAssessment = () => {
    // ✅ FIXED: Use proper navigation to assessment index
    router.push('/assessment');
  };

  if (!showResults) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Analyzing your artistic potential...
          </Text>
          <View style={[styles.loadingBar, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  backgroundColor: colors.primary,
                  width: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={ensureGradientColors([`${skillInfo.color}20`, 'transparent'])}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: animationValue,
            transform: [
              {
                translateY: animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Results Header */}
        <View style={styles.header}>
          <Text style={[styles.completedText, { color: colors.primary }]}>
            Assessment Complete! ✨
          </Text>
          
          <View style={[styles.skillBadge, { backgroundColor: skillInfo.color + '20' }]}>
            <Text style={styles.skillEmoji}>{skillInfo.emoji}</Text>
            <Text style={[styles.skillTitle, { color: skillInfo.color }]}>
              {skillInfo.title}
            </Text>
          </View>
          
          <Text style={[styles.skillDescription, { color: colors.text }]}>
            {skillInfo.description}
          </Text>
        </View>

        {/* Score Breakdown */}
        <View style={[styles.scoresContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.scoresTitle, { color: colors.text }]}>
            Your Scores
          </Text>
          
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              Assessment Score
            </Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>
              {progress.assessmentScore || 0}/24
            </Text>
          </View>
          
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              Current Level
            </Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>
              {progress.currentLevel}
            </Text>
          </View>
          
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              XP Earned
            </Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>
              {progress.xp}
            </Text>
          </View>
        </View>

        {/* Learning Path Preview */}
        <View style={[styles.pathContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.pathTitle, { color: colors.text }]}>
            Your Learning Path
          </Text>
          
          <View style={styles.pathItems}>
            <View style={styles.pathItem}>
              <View style={[styles.pathDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.pathText, { color: colors.text }]}>
                Foundation Drawing Skills
              </Text>
            </View>
            
            <View style={styles.pathItem}>
              <View style={[styles.pathDot, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.pathText, { color: colors.textSecondary }]}>
                Shape Recognition & Control
              </Text>
            </View>
            
            <View style={styles.pathItem}>
              <View style={[styles.pathDot, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.pathText, { color: colors.textSecondary }]}>
                Creative Expression
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Start Learning Journey"
            onPress={handleStartLearning}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
          
          <Button
            title="Retake Assessment"
            onPress={handleRetakeAssessment}
            variant="outline"
            size="medium"
            style={styles.secondaryButton}
          />
        </View>

        {/* Encouragement */}
        <View style={styles.encouragement}>
          <Text style={[styles.encouragementText, { color: colors.textSecondary }]}>
            🎨 Remember: Every artist was first an amateur. You're on the perfect path!
          </Text>
        </View>
      </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  completedText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  skillEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  scoresContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 16,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pathContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  pathTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  pathItems: {
    gap: 12,
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pathText: {
    fontSize: 16,
    flex: 1,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  encouragement: {
    alignItems: 'center',
    paddingTop: 20,
  },
  encouragementText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});