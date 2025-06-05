// app/(tabs)/index.tsx - FIXED BUTTON ONPRESS AND NAVIGATION
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { View } from '@/components/Themed';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { uiHaptics } from '@/utils/haptics';
import { Link, useRouter } from 'expo-router';

export default function TabOneScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { progress } = useUserProgress();
  const router = useRouter();

  const handleGetStarted = async () => {
    await uiHaptics.buttonPress();
  };

  const handleTakeAssessment = async () => {
    await uiHaptics.buttonPress();
    router.push('/onboarding/enhanced-assessment');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to DaVinci
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The Duolingo of Art - Transform yourself into a confident artist
          </Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statsTitle, { color: colors.text }]}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {progress.currentLevel}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Level
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {progress.xp}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  XP
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {progress.streakDays}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Streak
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Link href="/practice" asChild>
              <Button
                title="Start Drawing"
                onPress={handleGetStarted}
                variant="primary"
                size="large"
                style={styles.primaryButton}
              />
            </Link>
            
            {/* ✅ FIXED: Added missing onPress prop */}
            <Button
              title="Take Assessment"
              onPress={handleTakeAssessment}
              variant="outline"
              size="medium"
              style={styles.secondaryButton}
            />
          </View>

          <View style={styles.featuresSection}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>
              What you'll learn:
            </Text>
            
            <View style={[styles.featureItem, { backgroundColor: colors.card }]}>
              <Text style={styles.featureEmoji}>🎨</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Drawing Fundamentals
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Master lines, shapes, and proportions
                </Text>
              </View>
            </View>

            <View style={[styles.featureItem, { backgroundColor: colors.card }]}>
              <Text style={styles.featureEmoji}>⚔️</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Drawing Battles
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Compete with other artists in real-time
                </Text>
              </View>
            </View>

            <View style={[styles.featureItem, { backgroundColor: colors.card }]}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  Achievement System
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Unlock badges and track your progress
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});