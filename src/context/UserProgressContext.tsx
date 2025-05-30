/**
 * FIXED - UserProgress Context with ALL expected properties
 * Resolves all "Property does not exist" errors
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, SKILL_LEVELS, SkillLevel } from '@/constants/app';

// Complete user progress interface
export interface UserProgress {
  // Basic user info
  currentSkillLevel: SkillLevel;
  
  // Statistics that components expect
  stats: {
    totalLessonsCompleted: number;
    currentStreak: number;
    totalShapesDrawn: number;
    totalPracticeTime: number;
  };
  
  // Achievement system
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: number;
    category: string;
  }>;
  
  // Subscription info
  subscriptionTier: 'free' | 'premium' | 'pro';
  subscriptionExpiresAt?: number;
  
  // Settings
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  
  // Progress tracking
  lastActiveDate: number;
  joinedDate: number;
  totalSessionTime: number;
  
  // Weekly progress data
  weeklyProgress: number[];
}

// Context interface with ALL expected methods
export interface UserProgressContextType {
  // State
  progress: UserProgress;
  isLoading: boolean;
  
  // Computed properties that components expect
  skillLevel: SkillLevel;
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  
  // Methods that components expect
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProgress>) => Promise<void>;
  updateSkillLevel: (level: SkillLevel) => Promise<void>;
  
  // Subscription methods
  canAccessPremiumFeatures: () => boolean;
  
  // Achievement methods
  unlockAchievement: (achievementId: string) => Promise<void>;
  
  // Progress tracking
  incrementLessonCount: () => Promise<void>;
  incrementPracticeTime: (minutes: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  
  // Data management
  resetProgress: () => Promise<void>;
  exportProgress: () => Promise<string>;
  importProgress: (data: string) => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Default progress for new users
const getDefaultProgress = (): UserProgress => ({
  currentSkillLevel: SKILL_LEVELS.BEGINNER,
  stats: {
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalShapesDrawn: 0,
    totalPracticeTime: 0,
  },
  achievements: [],
  subscriptionTier: 'free',
  hapticEnabled: true,
  notificationsEnabled: true,
  lastActiveDate: Date.now(),
  joinedDate: Date.now(),
  totalSessionTime: 0,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0], // 7 days
});

interface UserProgressProviderProps {
  children: ReactNode;
}

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress());
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from storage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProgress({ ...getDefaultProgress(), ...parsed });
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
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.warn('Failed to save user progress:', error);
    }
  };

  // Update progress
  const updateProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates };
    await saveProgress(newProgress);
  };

  // Update preferences
  const updatePreferences = async (preferences: Partial<UserProgress>) => {
    await updateProgress(preferences);
  };

  // Update skill level
  const updateSkillLevel = async (level: SkillLevel) => {
    await updateProgress({ currentSkillLevel: level });
  };

  // Check premium access
  const canAccessPremiumFeatures = (): boolean => {
    if (progress.subscriptionTier === 'free') return false;
    if (progress.subscriptionExpiresAt && progress.subscriptionExpiresAt < Date.now()) {
      return false;
    }
    return true;
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId: string) => {
    if (progress.achievements.some(a => a.id === achievementId)) return;
    
    const newAchievement = {
      id: achievementId,
      title: `Achievement ${achievementId}`,
      description: 'Well done!',
      unlockedAt: Date.now(),
      category: 'general',
    };
    
    await updateProgress({
      achievements: [...progress.achievements, newAchievement],
    });
  };

  // Increment lesson count
  const incrementLessonCount = async () => {
    await updateProgress({
      stats: {
        ...progress.stats,
        totalLessonsCompleted: progress.stats.totalLessonsCompleted + 1,
      },
    });
  };

  // Increment practice time
  const incrementPracticeTime = async (minutes: number) => {
    await updateProgress({
      stats: {
        ...progress.stats,
        totalPracticeTime: progress.stats.totalPracticeTime + minutes,
      },
    });
  };

  // Update streak
  const updateStreak = async () => {
    const today = new Date().toDateString();
    const lastActive = new Date(progress.lastActiveDate).toDateString();
    
    if (today !== lastActive) {
      const newStreak = today === new Date(progress.lastActiveDate + 86400000).toDateString()
        ? progress.stats.currentStreak + 1
        : 1;
      
      await updateProgress({
        stats: {
          ...progress.stats,
          currentStreak: newStreak,
        },
        lastActiveDate: Date.now(),
      });
    }
  };

  // Reset progress
  const resetProgress = async () => {
    await saveProgress(getDefaultProgress());
  };

  // Export progress
  const exportProgress = async (): Promise<string> => {
    return JSON.stringify(progress);
  };

  // Import progress
  const importProgress = async (data: string) => {
    try {
      const imported = JSON.parse(data);
      await saveProgress({ ...getDefaultProgress(), ...imported });
    } catch (error) {
      console.warn('Failed to import progress:', error);
    }
  };

  const value: UserProgressContextType = {
    // State
    progress,
    isLoading,
    
    // Computed properties
    skillLevel: progress.currentSkillLevel,
    streak: progress.stats.currentStreak,
    totalLessonsCompleted: progress.stats.totalLessonsCompleted,
    totalPracticeTime: progress.stats.totalPracticeTime,
    weeklyProgress: progress.weeklyProgress,
    
    // Methods
    updateProgress,
    updatePreferences,
    updateSkillLevel,
    canAccessPremiumFeatures,
    unlockAchievement,
    incrementLessonCount,
    incrementPracticeTime,
    updateStreak,
    resetProgress,
    exportProgress,
    importProgress,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = (): UserProgressContextType => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

export default UserProgressContext;