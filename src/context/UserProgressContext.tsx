// src/context/UserProgressContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'casual';
export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface UserStats {
  totalLessonsCompleted: number;
  currentStreak: number;
  totalShapesDrawn: number;
  totalPracticeTime: number; // in minutes
  averageAccuracy: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: 'skill' | 'streak' | 'social' | 'special';
}

export interface UserProgress {
  // User identification and settings
  isNewUser: boolean;
  onboardingCompleted: boolean;
  skillLevel: SkillLevel;
  currentSkillLevel: SkillLevel; // ✅ ADD MISSING PROPERTY
  
  // Statistics and progress tracking
  stats: UserStats; // ✅ ADD MISSING STATS OBJECT
  streak: number; // ✅ ADD MISSING PROPERTY  
  totalLessonsCompleted: number; // ✅ ADD MISSING PROPERTY
  totalPracticeTime: number; // ✅ ADD MISSING PROPERTY
  weeklyProgress: number[]; // ✅ ADD MISSING PROPERTY (7 days of practice time)
  
  // Preferences and settings
  hapticEnabled: boolean; // ✅ ADD MISSING PROPERTY
  notificationsEnabled: boolean; // ✅ ADD MISSING PROPERTY
  
  // Subscription and premium features
  subscription: {
    tier: SubscriptionTier;
    expiresAt: Date | null;
    features: string[];
  };
  subscriptionTier: SubscriptionTier; // ✅ ADD MISSING PROPERTY
  subscriptionExpiresAt: Date | null; // ✅ ADD MISSING PROPERTY
  
  // Achievements and social
  achievements: Achievement[];
  
  // Progress tracking
  lastActiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressContextType {
  progress: UserProgress;
  
  // ✅ ADD MISSING PROPERTIES
  skillLevel: SkillLevel;
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  
  // Core progress methods
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  updatePreferences: (preferences: { hapticEnabled?: boolean; notificationsEnabled?: boolean }) => Promise<void>; // ✅ ADD MISSING METHOD
  updateSkillLevel: (skillLevel: SkillLevel) => Promise<void>;
  
  // Lesson and achievement methods
  completeLesson: (lessonId: string, accuracy: number, timeSpent: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  
  // Subscription methods
  canAccessPremiumFeatures: () => boolean; // ✅ ADD MISSING METHOD
  updateSubscription: (tier: SubscriptionTier, expiresAt?: Date) => Promise<void>;
  
  // Utility methods
  resetProgress: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

const createDefaultProgress = (): UserProgress => ({
  isNewUser: true,
  onboardingCompleted: false,
  skillLevel: 'beginner',
  currentSkillLevel: 'beginner',
  
  stats: {
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalShapesDrawn: 0,
    totalPracticeTime: 0,
    averageAccuracy: 0,
  },
  streak: 0,
  totalLessonsCompleted: 0,
  totalPracticeTime: 0,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0], // 7 days
  
  hapticEnabled: true,
  notificationsEnabled: true,
  
  subscription: {
    tier: 'free',
    expiresAt: null,
    features: [],
  },
  subscriptionTier: 'free',
  subscriptionExpiresAt: null,
  
  achievements: [],
  
  lastActiveDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress());

  // Load progress from storage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem('USER_PROGRESS');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          parsed.lastActiveDate = new Date(parsed.lastActiveDate);
          parsed.createdAt = new Date(parsed.createdAt);
          parsed.updatedAt = new Date(parsed.updatedAt);
          if (parsed.subscriptionExpiresAt) {
            parsed.subscriptionExpiresAt = new Date(parsed.subscriptionExpiresAt);
          }
          if (parsed.subscription?.expiresAt) {
            parsed.subscription.expiresAt = new Date(parsed.subscription.expiresAt);
          }
          parsed.achievements = parsed.achievements.map((achievement: any) => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt),
          }));
          setProgress(parsed);
        }
      } catch (error) {
        console.warn('Failed to load user progress:', error);
      }
    };
    loadProgress();
  }, []);

  // Save progress to storage
  const saveProgress = async (newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem('USER_PROGRESS', JSON.stringify(newProgress));
    } catch (error) {
      console.warn('Failed to save user progress:', error);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = {
      ...progress,
      ...updates,
      updatedAt: new Date(),
    };
    setProgress(newProgress);
    await saveProgress(newProgress);
  };

  const updatePreferences = async (preferences: { hapticEnabled?: boolean; notificationsEnabled?: boolean }) => {
    await updateProgress(preferences);
  };

  const updateSkillLevel = async (skillLevel: SkillLevel) => {
    await updateProgress({ 
      skillLevel, 
      currentSkillLevel: skillLevel 
    });
  };

  const completeLesson = async (lessonId: string, accuracy: number, timeSpent: number) => {
    const newStats = {
      ...progress.stats,
      totalLessonsCompleted: progress.stats.totalLessonsCompleted + 1,
      totalShapesDrawn: progress.stats.totalShapesDrawn + 1,
      totalPracticeTime: progress.stats.totalPracticeTime + timeSpent,
      averageAccuracy: (progress.stats.averageAccuracy + accuracy) / 2,
    };

    // Update weekly progress (add to today)
    const today = new Date().getDay();
    const newWeeklyProgress = [...progress.weeklyProgress];
    newWeeklyProgress[today] += timeSpent;

    // Update streak
    const lastActive = new Date(progress.lastActiveDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    let newStreak = progress.streak;
    
    if (daysDiff === 0) {
      // Same day, keep streak
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak += 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    await updateProgress({
      stats: newStats,
      streak: newStreak,
      totalLessonsCompleted: newStats.totalLessonsCompleted,
      totalPracticeTime: newStats.totalPracticeTime,
      weeklyProgress: newWeeklyProgress,
      lastActiveDate: now,
    });
  };

  const unlockAchievement = async (achievementId: string) => {
    // Implementation for achievement unlocking
    // This would include adding the achievement to the list
  };

  const canAccessPremiumFeatures = (): boolean => {
    if (progress.subscriptionTier === 'free') return false;
    if (progress.subscriptionExpiresAt && progress.subscriptionExpiresAt < new Date()) return false;
    return true;
  };

  const updateSubscription = async (tier: SubscriptionTier, expiresAt?: Date) => {
    await updateProgress({
      subscription: {
        tier,
        expiresAt: expiresAt || null,
        features: tier === 'free' ? [] : ['premium_lessons', 'ai_feedback', 'advanced_tools'],
      },
      subscriptionTier: tier,
      subscriptionExpiresAt: expiresAt || null,
    });
  };

  const resetProgress = async () => {
    const defaultProgress = createDefaultProgress();
    setProgress(defaultProgress);
    await saveProgress(defaultProgress);
  };

  const value: UserProgressContextType = {
    progress,
    
    // ✅ EXPOSE MISSING PROPERTIES
    skillLevel: progress.skillLevel,
    streak: progress.streak,
    totalLessonsCompleted: progress.totalLessonsCompleted,
    totalPracticeTime: progress.totalPracticeTime,
    weeklyProgress: progress.weeklyProgress,
    
    updateProgress,
    updatePreferences,
    updateSkillLevel,
    completeLesson,
    unlockAchievement,
    canAccessPremiumFeatures,
    updateSubscription,
    resetProgress,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};