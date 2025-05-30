/**
 * DaVinci Profile Tab
 * User settings, preferences, and subscription management
 */

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Switch, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useTheme } from '@/context/ThemeContext';
import { useUserProgress } from '@/context/UserProgressContext';
import { router } from 'expo-router';
import { uiHaptics } from '@/utils/haptics';

export default function ProfileScreen() {
  const { colors, mode, setThemeMode, toggleTheme } = useTheme();
  const { progress, updatePreferences, canAccessPremiumFeatures } = useUserProgress();
  
  const [hapticEnabled, setHapticEnabled] = useState(progress.hapticEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(progress.notificationsEnabled);

  const handleHapticToggle = async (value: boolean) => {
    setHapticEnabled(value);
    await updatePreferences({ hapticEnabled: value });
    
    if (value) {
      uiHaptics.buttonPress();
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await updatePreferences({ notificationsEnabled: value });
    uiHaptics.buttonPress();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    uiHaptics.buttonPress();
  };

  const handleSubscription = () => {
    if (canAccessPremiumFeatures()) {
      router.push('/subscription/manage');
    } else {
      router.push('/subscription/plans');
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Implementation would reset user progress
            uiHaptics.actionSuccess();
          },
        },
      ]
    );
  };

  const getSubscriptionStatus = () => {
    if (progress.subscriptionTier === 'free') return 'Free';
    if (progress.subscriptionTier === 'premium') return 'Premium';
    if (progress.subscriptionTier === 'pro') return 'Pro';
    return 'Free';
  };

  const getSubscriptionEmoji = () => {
    switch (progress.subscriptionTier) {
      case 'premium': return '⭐';
      case 'pro': return '💎';
      default: return '🆓';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <AnimatedText 
          style={[styles.title, { color: colors.text }]}
          animation="slideInDown"
        >
          Profile
        </AnimatedText>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your DaVinci experience
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>🎨</Text>
          </View>
          
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>
              Creative Artist
            </Text>
            <Text style={[styles.userLevel, { color: colors.textSecondary }]}>
              {progress.currentSkillLevel.charAt(0).toUpperCase() + progress.currentSkillLevel.slice(1)} Level
            </Text>
          </View>
          
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionEmoji}>
              {getSubscriptionEmoji()}
            </Text>
            <Text style={[styles.subscriptionText, { color: colors.textSecondary }]}>
              {getSubscriptionStatus()}
            </Text>
          </View>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.userStat}>
            <Text style={[styles.userStatNumber, { color: colors.primary }]}>
              {progress.stats.totalLessonsCompleted}
            </Text>
            <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
              Lessons
            </Text>
          </View>
          
          <View style={styles.userStat}>
            <Text style={[styles.userStatNumber, { color: colors.success }]}>
              {progress.stats.currentStreak}
            </Text>
            <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
              Streak
            </Text>
          </View>
          
          <View style={styles.userStat}>
            <Text style={[styles.userStatNumber, { color: colors.accent }]}>
              {progress.achievements.length}
            </Text>
            <Text style={[styles.userStatLabel, { color: colors.textSecondary }]}>
              Badges
            </Text>
          </View>
        </View>
      </View>

      {/* Subscription Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          💎 Subscription
        </Text>
        
        <View style={styles.subscriptionInfo}>
          <Text style={[styles.subscriptionStatus, { color: colors.text }]}>
            Current Plan: {getSubscriptionStatus()}
          </Text>
          
          {!canAccessPremiumFeatures() && (
            <Text style={[styles.subscriptionDesc, { color: colors.textSecondary }]}>
              Unlock unlimited lessons, advanced features, and premium content
            </Text>
          )}
          
          {canAccessPremiumFeatures() && progress.subscriptionExpiresAt && (
            <Text style={[styles.subscriptionDesc, { color: colors.textSecondary }]}>
              Expires: {new Date(progress.subscriptionExpiresAt).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        <Button
          title={canAccessPremiumFeatures() ? "Manage Subscription" : "Upgrade to Premium"}
          onPress={handleSubscription}
          variant={canAccessPremiumFeatures() ? "outline" : "primary"}
        />
      </View>

      {/* Settings Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          ⚙️ Settings
        </Text>
        
        {/* Theme Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              {mode === 'auto' ? 'Follow system' : mode === 'dark' ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
        
        {/* Haptic Feedback Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Haptic Feedback
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Feel vibrations when drawing
            </Text>
          </View>
          <Switch
            value={hapticEnabled}
            onValueChange={handleHapticToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
        
        {/* Notifications Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Notifications
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Daily reminders and updates
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🆘 Support
        </Text>
        
        <View style={styles.supportActions}>
          <Button
            title="Help & FAQ"
            onPress={() => Alert.alert('Help', 'Help documentation coming soon!')}
            variant="ghost"
            style={styles.supportButton}
          />
          
          <Button
            title="Contact Support"
            onPress={() => Alert.alert('Contact', 'Support contact coming soon!')}
            variant="ghost"
            style={styles.supportButton}
          />
          
          <Button
            title="Rate App"
            onPress={() => Alert.alert('Rate App', 'App Store rating coming soon!')}
            variant="ghost"
            style={styles.supportButton}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.error }]}>
          ⚠️ Danger Zone
        </Text>
        
        <Button
          title="Reset All Progress"
          onPress={handleResetProgress}
          variant="destructive"
          style={styles.resetButton}
        />
        
        <Text style={[styles.resetWarning, { color: colors.textTertiary }]}>
          This will permanently delete all your progress, lessons, and achievements.
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
          DaVinci v1.0.0
        </Text>
        <Text style={[styles.appMade, { color: colors.textTertiary }]}>
          Made with ❤️ for artists everywhere
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  userCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
  },
  subscriptionBadge: {
    alignItems: 'center',
  },
  subscriptionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStat: {
    alignItems: 'center',
  },
  userStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  subscriptionInfo: {
    marginBottom: 16,
  },
  subscriptionStatus: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  subscriptionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
  },
  supportActions: {
    gap: 8,
  },
  supportButton: {
    justifyContent: 'flex-start',
  },
  resetButton: {
    marginBottom: 12,
  },
  resetWarning: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  appVersion: {
    fontSize: 12,
    marginBottom: 4,
  },
  appMade: {
    fontSize: 12,
  },
});