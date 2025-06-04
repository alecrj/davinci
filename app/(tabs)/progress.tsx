import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext'; // ✅ FIXED: Correct import path
import { ensureGradientColors } from '@/utils/colors/gradientHelper';

const { width } = Dimensions.get('window');

interface StatItem {
  label: string;
  value: string;
  color: string[];
  icon: string;
}

interface LevelData {
  level: number;
  title: string;
  description: string;
  color: string[];
  progress: number;
  nextLevelXP: number;
  currentXP: number;
}

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { colors } = theme;

  const stats: StatItem[] = [
    {
      label: 'Total Drawings',
      value: '127',
      color: ['#007AFF', '#5856D6'],
      icon: '🎨',
    },
    {
      label: 'Streak Days',
      value: '23',
      color: ['#FF9500', '#FF6B00'],
      icon: '🔥',
    },
    {
      label: 'Skills Mastered',
      value: '8',
      color: ['#34C759', '#30A04B'],
      icon: '⭐',
    },
    {
      label: 'Hours Practiced',
      value: '47.5',
      color: ['#AF52DE', '#9542C4'],
      icon: '⏰',
    },
  ];

  const currentLevel: LevelData = {
    level: 12,
    title: 'Skilled Artist',
    description: 'You\'re developing strong artistic fundamentals',
    color: ['#007AFF', '#5856D6'],
    progress: 0.73,
    nextLevelXP: 2500,
    currentXP: 1825,
  };

  const achievements = [
    { title: 'First Drawing', description: 'Created your first masterpiece', earned: true, icon: '🎯' },
    { title: 'Week Warrior', description: '7-day drawing streak', earned: true, icon: '💪' },
    { title: 'Shape Master', description: 'Mastered basic shapes', earned: true, icon: '🔷' },
    { title: 'Color Wizard', description: 'Completed color theory lessons', earned: false, icon: '🌈' },
    { title: 'Speed Artist', description: 'Complete lesson in under 2 minutes', earned: false, icon: '⚡' },
    { title: 'Perfectionist', description: 'Score 100% on 5 lessons', earned: false, icon: '💎' },
  ];

  const skillProgress = [
    { skill: 'Line Control', progress: 0.85, level: 'Advanced' },
    { skill: 'Shape Recognition', progress: 0.92, level: 'Expert' },
    { skill: 'Proportions', progress: 0.67, level: 'Intermediate' },
    { skill: 'Shading', progress: 0.34, level: 'Beginner' },
    { skill: 'Color Theory', progress: 0.12, level: 'Beginner' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Level Progress Card */}
      <View style={[styles.levelCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={ensureGradientColors(currentLevel.color)}
          style={styles.levelGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.levelContent}>
            <Text style={styles.levelNumber}>Level {currentLevel.level}</Text>
            <Text style={styles.levelTitle}>{currentLevel.title}</Text>
            <Text style={styles.levelDescription}>{currentLevel.description}</Text>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBackground, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${currentLevel.progress * 100}%`,
                      backgroundColor: 'white'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentLevel.currentXP} / {currentLevel.nextLevelXP} XP
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <LinearGradient
            key={index}
            colors={ensureGradientColors(stat.color)}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Skills Progress */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Skill Progress</Text>
        {skillProgress.map((skill, index) => (
          <View key={index} style={styles.skillItem}>
            <View style={styles.skillHeader}>
              <Text style={[styles.skillName, { color: colors.text }]}>{skill.skill}</Text>
              <Text style={[styles.skillLevel, { color: colors.textSecondary }]}>{skill.level}</Text>
            </View>
            <View style={[styles.skillProgressBackground, { backgroundColor: colors.border }]}>
              <LinearGradient
                colors={ensureGradientColors(['#007AFF', '#5856D6'])}
                style={[styles.skillProgressBar, { width: `${skill.progress * 100}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View 
              key={index} 
              style={[
                styles.achievementCard, 
                { 
                  backgroundColor: achievement.earned ? colors.primary + '20' : colors.border,
                  borderColor: achievement.earned ? colors.primary : colors.border 
                }
              ]}
            >
              <Text style={[
                styles.achievementIcon, 
                { opacity: achievement.earned ? 1 : 0.5 }
              ]}>
                {achievement.icon}
              </Text>
              <Text style={[
                styles.achievementTitle, 
                { 
                  color: achievement.earned ? colors.text : colors.textSecondary,
                  fontWeight: achievement.earned ? '600' : '400'
                }
              ]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                {achievement.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Weekly Summary */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
        <View style={styles.weeklyStats}>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: colors.primary }]}>12</Text>
            <Text style={[styles.weeklyStatLabel, { color: colors.textSecondary }]}>Lessons</Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: colors.primary }]}>5.2h</Text>
            <Text style={[styles.weeklyStatLabel, { color: colors.textSecondary }]}>Practice</Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={[styles.weeklyStatValue, { color: colors.primary }]}>850</Text>
            <Text style={[styles.weeklyStatLabel, { color: colors.textSecondary }]}>XP Earned</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  levelGradient: {
    padding: 20,
  },
  levelContent: {
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '500',
  },
  skillLevel: {
    fontSize: 12,
  },
  skillProgressBackground: {
    height: 6,
    borderRadius: 3,
  },
  skillProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 68) / 2,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 10,
    textAlign: 'center',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
  },
});