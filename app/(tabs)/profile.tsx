// app/(tabs)/profile.tsx - FIXED PROFILE TAB WITH ALL CORRECT PROPERTIES
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Switch, Alert, Dimensions } from 'react-native';
import { View } from '@/components/Themed';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ensureGradientColors } from '@/utils/colors/gradientHelper';
import { uiHaptics } from '@/utils/haptics';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  // ✅ FIXED: Use correct properties from context
  const { progress, updatePreferences, canAccessPremiumFeatures } = useUserProgress();

  // ✅ FIXED: Use correct property paths for preferences
  const [hapticEnabled, setHapticEnabled] = useState(progress.preferences.hapticEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(progress.preferences.notificationsEnabled);

  const handleHapticToggle = async (value: boolean) => {
    setHapticEnabled(value);
    await updatePreferences({ hapticEnabled: value });
    if (value) {
      uiHaptics.success();
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await updatePreferences({ notificationsEnabled: value });
    uiHaptics.buttonPress();
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle sign out
          uiHaptics.buttonPress();
        }},
      ]
    );
  };

  const getSubscriptionTierName = () => {
    // ✅ FIXED: Handle all subscription tier types including premium
    if (progress.subscriptionTier === 'premium' || progress.subscriptionTier === 'academy') return 'Premium';
    if (progress.subscriptionTier === 'pro') return 'Pro';
    if (progress.subscriptionTier === 'plus') return 'Plus';
    return 'Free';
  };

  const getSubscriptionIcon = () => {
    // ✅ FIXED: Handle premium tier correctly
    switch (progress.subscriptionTier) {
      case 'academy':
      case 'premium': return '⭐';
      case 'pro': return '💎';
      case 'plus': return '🎨';
      default: return '🆓';
    }
  };

  const getProgressLevel = () => {
    if (progress.currentLevel <= 5) return 'Beginner';
    if (progress.currentLevel <= 15) return 'Intermediate';
    if (progress.currentLevel <= 30) return 'Advanced';
    return 'Expert';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <LinearGradient
        colors={ensureGradientColors([colors.primary + '20', 'transparent'])}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {progress.currentLevel}
            </Text>
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            Artist Level {progress.currentLevel}
          </Text>
          
          <Text style={[styles.userTitle, { color: colors.textSecondary }]}>
            {/* ✅ FIXED: Use currentSkillLevel from progress */}
            {progress.currentSkillLevel.charAt(0).toUpperCase() + progress.currentSkillLevel.slice(1)} Level
          </Text>

          <View style={[styles.subscriptionBadge, { backgroundColor: colors.card }]}>
            <Text style={styles.subscriptionIcon}>{getSubscriptionIcon()}</Text>
            <Text style={[styles.subscriptionText, { color: colors.text }]}>
              {getSubscriptionTierName()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {/* ✅ FIXED: Use stats from progress.stats */}
              {progress.stats.totalLessonsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Lessons
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {/* ✅ FIXED: Use stats from progress.stats */}
              {progress.stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Streak
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {/* ✅ FIXED: Use achievements from progress.achievements */}
              {progress.achievements.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Achievements
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Settings</Text>

        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Haptic Feedback
          </Text>
          <Switch
            value={hapticEnabled}
            onValueChange={handleHapticToggle}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={hapticEnabled ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>

      {/* Subscription Info */}
      {canAccessPremiumFeatures() && (
        <View style={[styles.subscriptionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Subscription</Text>
          
          {/* ✅ FIXED: Use subscriptionExpiry instead of subscriptionExpiresAt */}
          {canAccessPremiumFeatures() && progress.subscriptionExpiry && (
            <Text style={[styles.subscriptionInfo, { color: colors.textSecondary }]}>
              Expires: {new Date(progress.subscriptionExpiry).toLocaleDateString()}
            </Text>
          )}

          <Button
            title="Manage Subscription"
            variant="outline"
            size="medium"
            onPress={() => {
              uiHaptics.buttonPress();
              // Navigate to subscription management
            }}
            style={styles.subscriptionButton}
          />
        </View>
      )}

      {/* Actions */}
      <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Account</Text>

        <Button
          title="Export Progress"
          variant="outline"
          size="medium"
          onPress={() => {
            uiHaptics.buttonPress();
            Alert.alert('Export Progress', 'Feature coming soon!');
          }}
          style={styles.actionButton}
        />

        <Button
          title="Reset Progress"
          variant="outline"
          size="medium"
          onPress={() => {
            Alert.alert(
              'Reset Progress',
              'This will delete all your progress. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => {
                  uiHaptics.warning();
                  // Handle reset
                }},
              ]
            );
          }}
          style={styles.actionButton}
        />

        <Button
          title="Sign Out"
          variant="outline"
          size="medium"
          onPress={handleSignOut}
          style={styles.actionButton}
        />
      </View>

      {/* App Info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>About</Text>
        
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          DaVinci - The Duolingo of Art
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          © 2025 DaVinci Art Learning
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  subscriptionIcon: {
    fontSize: 16,
  },
  subscriptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
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
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  subscriptionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subscriptionInfo: {
    fontSize: 14,
    marginBottom: 12,
  },
  subscriptionButton: {
    alignSelf: 'flex-start',
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    marginBottom: 12,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
});