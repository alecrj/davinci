import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { AnimatedText } from '@/components/ui/AnimatedText';

const { width: screenWidth } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👣',
    unlocked: true,
    progress: 1,
    total: 1,
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: '7-day drawing streak',
    icon: '🔥',
    unlocked: false,
    progress: 3,
    total: 7,
  },
  {
    id: '3',
    title: 'Shape Master',
    description: 'Master all basic shapes',
    icon: '🔷',
    unlocked: false,
    progress: 5,
    total: 8,
  },
  {
    id: '4',
    title: 'Creative Explorer',
    description: 'Try 10 different drawing styles',
    icon: '🎨',
    unlocked: false,
    progress: 2,
    total: 10,
  },
];

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { 
    skillLevel, 
    streak, 
    totalLessonsCompleted,
    totalPracticeTime,
    weeklyProgress 
  } = useUserProgress();

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    color 
  }: { 
    icon: string; 
    value: string | number; 
    label: string; 
    color: string[];
  }) => (
    <LinearGradient colors={color} style={styles.statCard}>
      <Ionicons name={icon as any} size={24} color="white" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <View style={[
      styles.achievementCard,
      { 
        backgroundColor: theme.colors.card,
        opacity: achievement.unlocked ? 1 : 0.6,
      }
    ]}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.text }]}>
          {achievement.description}
        </Text>
        <View style={styles.achievementProgress}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: achievement.unlocked ? theme.colors.success : theme.colors.primary,
                  width: `${(achievement.progress / achievement.total) * 100}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            {achievement.progress}/{achievement.total}
          </Text>
        </View>
      </View>
      {achievement.unlocked && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedText
            text="Your Progress"
            style={[styles.title, { color: theme.colors.text }]}
            animation="slideInLeft"
          />
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Track your artistic journey
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            value={streak}
            label="Day Streak"
            color={['#ff6b6b', '#ff8787']}
          />
          <StatCard
            icon="school"
            value={totalLessonsCompleted}
            label="Lessons"
            color={['#4ecdc4', '#44a3aa']}
          />
          <StatCard
            icon="time"
            value={`${Math.floor(totalPracticeTime / 60)}h`}
            label="Practice Time"
            color={['#a78bfa', '#8b5cf6']}
          />
          <StatCard
            icon="trending-up"
            value={skillLevel}
            label="Skill Level"
            color={['#fbbf24', '#f59e0b']}
          />
        </View>

        {/* Weekly Activity */}
        <View style={[styles.weeklyCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            This Week
          </Text>
          <View style={styles.weekDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const isActive = weeklyProgress[index] > 0;
              return (
                <View key={index} style={styles.dayContainer}>
                  <Text style={[styles.dayLabel, { color: theme.colors.text }]}>
                    {day}
                  </Text>
                  <View style={[
                    styles.dayIndicator,
                    {
                      backgroundColor: isActive ? theme.colors.success : theme.colors.border,
                    }
                  ]}>
                    {isActive && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.weekStats}>
            <Text style={[styles.weekStatText, { color: theme.colors.text }]}>
              {weeklyProgress.filter(d => d > 0).length} days active
            </Text>
            <Text style={[styles.weekStatText, { color: theme.colors.text }]}>
              {weeklyProgress.reduce((a, b) => a + b, 0)} min total
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Achievements
          </Text>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {/* Motivational Quote */}
        <View style={[styles.quoteCard, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="bulb" size={24} color="white" />
          <Text style={styles.quoteText}>
            "Every expert was once a beginner. Keep drawing!"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    width: (screenWidth - 40) / 2 - 5,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  weeklyCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekStatText: {
    fontSize: 14,
    opacity: 0.7,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 15,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    gap: 15,
  },
  quoteText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    lineHeight: 22,
  },
});