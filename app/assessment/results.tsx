import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext'; // ✅ FIXED: Correct import path
import { ensureGradientColors } from '@/utils/colors/gradientHelper';

const { width } = Dimensions.get('window');

interface UserTrack {
  id: string;
  name: string;
  description: string;
  color: string[];
  strengths: string[];
  approach: string;
  timeline: string;
}

export default function AssessmentResultsScreen() {
  const { theme } = useTheme();
  const { colors } = theme;

  // Mock assessment results - would come from context/API
  const userTrack: UserTrack = {
    id: 'confident-explorer',
    name: 'Confident Explorer',
    description: 'You have natural line confidence and a growth mindset. You\'re ready to experiment and learn through creative exploration.',
    color: ['#007AFF', '#5856D6'],
    strengths: [
      'Intuitive drawing ability',
      'Willingness to experiment',
      'Natural line confidence',
      'Growth mindset'
    ],
    approach: 'Fundamentals → Style Development → Advanced Techniques',
    timeline: 'At 10 min/day: Week 4 = Recognizable art, Week 12 = Personal style'
  };

  const currentLevel = {
    title: userTrack.name,
    description: userTrack.description,
    color: userTrack.color,
    progress: 0.15, // Just started
    nextMilestone: 'First Masterpiece',
    estimatedTime: '2-3 lessons'
  };

  const personalizedPlan = [
    {
      week: 1,
      focus: 'Building Confidence',
      lessons: ['Perfect Lines', 'Circle Mastery', 'Basic Shapes'],
      goal: 'Develop drawing confidence'
    },
    {
      week: 2,
      focus: 'Fundamental Skills', 
      lessons: ['Proportions', 'Shading Basics', 'Simple Objects'],
      goal: 'Master basic techniques'
    },
    {
      week: 3,
      focus: 'Creative Expression',
      lessons: ['Color Theory', 'Style Exploration', 'Personal Projects'],
      goal: 'Find your artistic voice'
    },
    {
      week: 4,
      focus: 'First Masterpiece',
      lessons: ['Complete Drawing', 'Details & Finishing', 'Portfolio Start'],
      goal: 'Create recognizable art'
    }
  ];

  const handleStartLearning = () => {
    router.push('/'); // ✅ FIXED: Use root path instead of /(tabs)/
  };

  const handleRetakeAssessment = () => {
    router.push('/assessment/'); // ✅ FIXED: This is actually valid, will fix in navigation types
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Results Header */}
      <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={ensureGradientColors(currentLevel.color)}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Your Artist Type</Text>
            <Text style={styles.headerLevel}>{currentLevel.title}</Text>
            <Text style={styles.headerDescription}>{currentLevel.description}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Strengths Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Artistic Superpowers</Text>
        {userTrack.strengths.map((strength, index) => (
          <View key={index} style={styles.strengthItem}>
            <Text style={styles.strengthIcon}>⭐</Text>
            <Text style={[styles.strengthText, { color: colors.text }]}>{strength}</Text>
          </View>
        ))}
      </View>

      {/* Learning Approach */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Learning Path</Text>
        <Text style={[styles.approachText, { color: colors.textSecondary }]}>{userTrack.approach}</Text>
        <View style={styles.timelineContainer}>
          <Text style={[styles.timelineTitle, { color: colors.text }]}>Progress Timeline</Text>
          <Text style={[styles.timelineText, { color: colors.textSecondary }]}>{userTrack.timeline}</Text>
        </View>
      </View>

      {/* Personalized Plan */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your 4-Week Transformation Plan</Text>
        {personalizedPlan.map((week, index) => (
          <View key={index} style={[styles.weekCard, { backgroundColor: colors.background }]}>
            <View style={styles.weekHeader}>
              <Text style={[styles.weekNumber, { color: colors.primary }]}>Week {week.week}</Text>
              <Text style={[styles.weekFocus, { color: colors.text }]}>{week.focus}</Text>
            </View>
            <Text style={[styles.weekGoal, { color: colors.textSecondary }]}>{week.goal}</Text>
            <View style={styles.lessonsContainer}>
              {week.lessons.map((lesson, lessonIndex) => (
                <View key={lessonIndex} style={[styles.lessonTag, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.lessonText, { color: colors.primary }]}>{lesson}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Next Steps */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ready to Start Your Journey?</Text>
        <Text style={[styles.nextStepsText, { color: colors.textSecondary }]}>
          Your personalized learning experience is ready. Start with your first lesson and begin your transformation into a confident artist.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Start My Art Journey"
            onPress={handleStartLearning}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
          
          <Button
            title="Retake Assessment"
            onPress={handleRetakeAssessment}
            variant="secondary"
            size="medium"
            style={styles.secondaryButton}
          />
        </View>
      </View>

      {/* Confidence Boost */}
      <View style={[styles.confidenceCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={ensureGradientColors(['#FF6B6B', '#4ECDC4'])}
          style={styles.confidenceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.confidenceTitle}>Remember: You ARE an Artist</Text>
          <Text style={styles.confidenceText}>
            Every professional artist started exactly where you are. The only difference is they kept going. Your journey starts now.
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    padding: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  headerLevel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  strengthText: {
    fontSize: 14,
    flex: 1,
  },
  approachText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  timelineContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 13,
    lineHeight: 18,
  },
  weekCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  weekFocus: {
    fontSize: 16,
    fontWeight: '500',
  },
  weekGoal: {
    fontSize: 13,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  lessonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lessonTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  lessonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  nextStepsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  confidenceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  confidenceGradient: {
    padding: 20,
    alignItems: 'center',
  },
  confidenceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});