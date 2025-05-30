/**
 * DaVinci Home Tab
 * Main dashboard for lessons, progress, and daily challenges
 */

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { progress } = useUserProgress();

  const handleStartLesson = () => {
    router.push('/lessons/basic-shapes');
  };

  const handleStartPractice = () => {
    router.push('/(tabs)/practice');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <AnimatedText 
          style={[styles.welcomeText, { color: colors.text }]}
          animation="fadeIn"
        >
          Welcome back, Artist! 🎨
        </AnimatedText>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ready to transform your creativity?
        </Text>
      </View>

      {/* Progress Overview */}
      <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Your Progress
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {progress.stats.totalLessonsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Lessons
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {progress.stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>
              {progress.stats.totalShapesDrawn}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Shapes
            </Text>
          </View>
        </View>
      </View>

      {/* Today's Lesson */}
      <View style={[styles.lessonCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Today's Lesson
        </Text>
        
        <Text style={[styles.lessonTitle, { color: colors.text }]}>
          Basic Shapes & Forms
        </Text>
        
        <Text style={[styles.lessonDescription, { color: colors.textSecondary }]}>
          Learn to draw perfect circles, squares, and triangles with confidence.
        </Text>
        
        <Button
          title="Start Lesson"
          onPress={handleStartLesson}
          variant="primary"
          style={styles.lessonButton}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Free Practice"
          onPress={handleStartPractice}
          variant="outline"
          style={styles.actionButton}
        />
        
        <Button
          title="View Progress"
          onPress={() => router.push('/(tabs)/progress')}
          variant="ghost"
          style={styles.actionButton}
        />
      </View>

      {/* Achievements Preview */}
      {progress.achievements.length > 0 && (
        <View style={[styles.achievementsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Recent Achievements
          </Text>
          
          <Text style={[styles.achievementText, { color: colors.textSecondary }]}>
            🏆 {progress.achievements[progress.achievements.length - 1]?.title}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60, // Account for status bar
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  lessonCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  lessonButton: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  achievementsCard: {
    borderRadius: 16,
    padding: 20,
  },
  achievementText: {
    fontSize: 16,
  },
});