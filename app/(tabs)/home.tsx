// app/(tabs)/home.tsx - FIXED SVG USAGE
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg'; // ✅ PROPER SVG IMPORT
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { safeNavigate } from '@/types/navigation'; // ✅ USE SAFE NAVIGATION

const { width: screenWidth } = Dimensions.get('window');

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string[]; // ✅ SIMPLE STRING ARRAY
  completed: boolean;
  locked: boolean;
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Draw an Apple',
    subtitle: 'Master basic shapes',
    duration: 3,
    difficulty: 'beginner',
    icon: '🍎',
    color: ['#ff6b6b', '#ff8787'],
    completed: false,
    locked: false,
  },
  {
    id: '2',
    title: 'Cute Cat Face',
    subtitle: 'Combine simple shapes',
    duration: 3,
    difficulty: 'beginner',
    icon: '🐱',
    color: ['#4ecdc4', '#44a3aa'],
    completed: false,
    locked: false,
  },
  {
    id: '3',
    title: 'Beautiful Flower',
    subtitle: 'Curves and petals',
    duration: 3,
    difficulty: 'intermediate',
    icon: '🌸',
    color: ['#ff6b9d', '#ee5a6f'],
    completed: false,
    locked: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { skillLevel, streak, totalLessonsCompleted } = useUserProgress();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.locked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // ✅ USE SAFE NAVIGATION
    safeNavigate.toLesson(lesson.id);
  };

  // ✅ FIXED PROGRESS RING COMPONENT WITH PROPER SVG
  const ProgressRing = ({ progress }: { progress: number }) => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg height={size} width={size} style={styles.progressSvg}>
          <Circle
            stroke={theme.colors.border}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={theme.colors.primary}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressNumber, { color: theme.colors.text }]}>
            {Math.round(progress)}%
          </Text>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Complete
          </Text>
        </View>
      </View>
    );
  };

  // ✅ FIXED LESSON CARD WITH PROPER GRADIENT CONVERSION
  const LessonCard = ({ lesson }: { lesson: Lesson }) => (
    <TouchableOpacity
      style={[styles.lessonCard, lesson.locked && styles.lockedCard]}
      onPress={() => handleLessonPress(lesson)}
      activeOpacity={0.8}>
      <LinearGradient
        colors={lesson.locked ? ['#999999', '#666666'] as any : lesson.color as any} // ✅ TYPE ASSERTION
        style={styles.lessonGradient}>
        <Text style={styles.lessonIcon}>{lesson.icon}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
        <View style={styles.lessonFooter}>
          <View style={styles.lessonDuration}>
            <Ionicons name="time-outline" size={16} color="white" />
            <Text style={styles.lessonDurationText}>{lesson.duration} min</Text>
          </View>
          {lesson.locked && <Ionicons name="lock-closed" size={20} color="white" />}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AnimatedText
              text={greeting}
              style={[styles.greeting, { color: theme.colors.text }]}
              animation="fadeIn"
            />
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Ready to create something amazing?
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.streakBadge, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(tabs)/progress')}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>{streak}</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={[styles.progressCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Journey
          </Text>
          <View style={styles.progressContent}>
            <ProgressRing progress={(totalLessonsCompleted / 20) * 100} />
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {skillLevel}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                  Skill Level
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {totalLessonsCompleted}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                  Lessons Done
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Lessons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Today's Lessons
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lessonsContainer}>
            {mockLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </ScrollView>
        </View>

        {/* Quick Practice */}
        <TouchableOpacity
          style={[styles.practiceCard, { backgroundColor: theme.colors.secondary }]}
          onPress={() => router.push('/(tabs)/practice')}>
          <Ionicons name="brush" size={24} color="white" />
          <Text style={styles.practiceText}>Free Drawing Practice</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  progressContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  progressSvg: {
    transform: [{ rotateZ: '0deg' }],
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressStats: {
    flex: 1,
    marginLeft: 30,
    gap: 20,
  },
  statItem: {
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  lessonCard: {
    width: screenWidth * 0.6,
    height: 200,
    marginRight: 15,
  },
  lockedCard: {
    opacity: 0.7,
  },
  lessonGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  lessonIcon: {
    fontSize: 48,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lessonSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lessonDurationText: {
    color: 'white',
    fontSize: 14,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
  },
  practiceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 15,
  },
});