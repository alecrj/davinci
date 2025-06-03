// src/context/UserProgressContext.tsx - FIXED WITH MISSING PROPERTIES
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'casual' | 'hobby' | 'student'; // ✅ ADD MISSING TYPES

export interface UserProgress {
  // ✅ ONBOARDING AND ASSESSMENT FLAGS
  hasCompletedOnboarding: boolean;
  hasCompletedAssessment: boolean;
  isNewUser: boolean;
  
  // ✅ SKILL AND LEVEL
  skillLevel: SkillLevel;
  currentSkillLevel: SkillLevel;
  
  // ✅ PROGRESS TRACKING
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  
  // ✅ PREFERENCES
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  
  // ✅ SUBSCRIPTION
  subscriptionTier: 'free' | 'premium' | 'pro';
  subscriptionExpiresAt: Date | null;
  
  // ✅ ACHIEVEMENTS
  achievements: Array<{
    id: string;
    title: string;
    unlockedAt: Date;
  }>;
  
  // ✅ STATS OBJECT
  stats: {
    totalLessonsCompleted: number;
    currentStreak: number;
    totalShapesDrawn: number;
    totalPracticeTime: number;
    averageAccuracy: number;
  };
  
  // ✅ ASSESSMENT RESULTS
  assessmentScore?: number;
  
  // ✅ TIMESTAMPS
  lastActiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressContextType {
  progress: UserProgress;
  isLoading: boolean; // ✅ ADD MISSING IS_LOADING
  
  // ✅ DIRECT ACCESS PROPERTIES COMPONENTS EXPECT
  skillLevel: SkillLevel;
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  
  // ✅ METHODS
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  updatePreferences: (preferences: { hapticEnabled?: boolean; notificationsEnabled?: boolean }) => Promise<void>;
  updateSkillLevel: (skillLevel: SkillLevel) => Promise<void>;
  completeLesson: (lessonId: string, accuracy: number, timeSpent: number) => Promise<void>;
  canAccessPremiumFeatures: () => boolean;
  updateSubscription: (tier: 'free' | 'premium' | 'pro', expiresAt?: Date) => Promise<void>;
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
  // ✅ ONBOARDING FLAGS
  hasCompletedOnboarding: false,
  hasCompletedAssessment: false,
  isNewUser: true,
  
  // ✅ SKILL
  skillLevel: 'beginner',
  currentSkillLevel: 'beginner',
  
  // ✅ PROGRESS
  streak: 0,
  totalLessonsCompleted: 0,
  totalPracticeTime: 0,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  
  // ✅ PREFERENCES
  hapticEnabled: true,
  notificationsEnabled: true,
  
  // ✅ SUBSCRIPTION
  subscriptionTier: 'free',
  subscriptionExpiresAt: null,
  
  // ✅ ACHIEVEMENTS
  achievements: [],
  
  // ✅ STATS
  stats: {
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalShapesDrawn: 0,
    totalPracticeTime: 0,
    averageAccuracy: 0,
  },
  
  // ✅ TIMESTAMPS
  lastActiveDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress());
  const [isLoading, setIsLoading] = useState(true); // ✅ ADD LOADING STATE

  // Load progress from storage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const stored = await AsyncStorage.getItem('USER_PROGRESS');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Handle date conversion safely
          if (parsed.lastActiveDate) parsed.lastActiveDate = new Date(parsed.lastActiveDate);
          if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
          if (parsed.updatedAt) parsed.updatedAt = new Date(parsed.updatedAt);
          if (parsed.subscriptionExpiresAt) parsed.subscriptionExpiresAt = new Date(parsed.subscriptionExpiresAt);
          
          setProgress({ ...createDefaultProgress(), ...parsed });
        }
      } catch (error) {
        console.warn('Failed to load user progress:', error);
      } finally {
        setIsLoading(false);
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
    
    // Update stats if certain properties changed
    if (updates.totalLessonsCompleted !== undefined || updates.streak !== undefined) {
      newProgress.stats = {
        ...newProgress.stats,
        totalLessonsCompleted: updates.totalLessonsCompleted ?? newProgress.totalLessonsCompleted,
        currentStreak: updates.streak ?? newProgress.streak,
      };
    }
    
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
    await updateProgress({
      totalLessonsCompleted: progress.totalLessonsCompleted + 1,
      totalPracticeTime: progress.totalPracticeTime + timeSpent,
      lastActiveDate: new Date(),
    });
  };

  const canAccessPremiumFeatures = (): boolean => {
    if (progress.subscriptionTier === 'free') return false;
    if (progress.subscriptionExpiresAt && progress.subscriptionExpiresAt < new Date()) return false;
    return true;
  };

  const updateSubscription = async (tier: 'free' | 'premium' | 'pro', expiresAt?: Date) => {
    await updateProgress({
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
    isLoading, // ✅ EXPOSE LOADING STATE
    
    // ✅ DIRECT ACCESS PROPERTIES
    skillLevel: progress.skillLevel,
    streak: progress.streak,
    totalLessonsCompleted: progress.totalLessonsCompleted,
    totalPracticeTime: progress.totalPracticeTime,
    weeklyProgress: progress.weeklyProgress,
    
    updateProgress,
    updatePreferences,
    updateSkillLevel,
    completeLesson,
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