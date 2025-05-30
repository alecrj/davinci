// CRITICAL FIX 2: src/context/UserProgressContext.tsx
// Adding all missing properties that are causing errors

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/app';

// FIXED: Complete UserProgress interface with all expected properties
export interface UserProgress {
  // Onboarding and Assessment
  hasCompletedOnboarding: boolean;
  hasCompletedAssessment: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  
  // Drawing Statistics
  drawingsCompleted: number;
  shapesDetected: number;
  totalDrawingTime: number;
  currentStreak: number;
  longestStreak: number;
  
  // Learning Progress
  lessonsCompleted: number;
  currentLesson: number;
  totalScore: number;
  averageAccuracy: number;
  
  // Achievements and Progress
  achievements: Achievement[];
  badges: Badge[];
  level: number;
  experiencePoints: number;
  
  // App Usage
  totalSessions: number;
  lastSessionDate: string;
  firstLaunchDate: string;
  
  // Settings and Preferences
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  reminderSettings: {
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'weekly';
  };
  
  // Subscription Status
  subscription: {
    isPremium: boolean;
    plan: 'free' | 'premium' | 'pro';
    expiresAt?: string;
    features: string[];
  };
  
  // Social Features
  isProfilePublic: boolean;
  allowDataCollection: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: string;
}

interface UserProgressContextType {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  incrementDrawing: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  addBadge: (badge: Badge) => void;
  updateSkillLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  completeOnboarding: () => void;
  completeAssessment: (skillLevel: 'beginner' | 'intermediate' | 'advanced') => void;
  isLoading: boolean;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

interface UserProgressProviderProps {
  children: ReactNode;
}

// Default progress state
const defaultProgress: UserProgress = {
  hasCompletedOnboarding: false,
  hasCompletedAssessment: false,
  skillLevel: 'beginner',
  drawingsCompleted: 0,
  shapesDetected: 0,
  totalDrawingTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  lessonsCompleted: 0,
  currentLesson: 1,
  totalScore: 0,
  averageAccuracy: 0,
  achievements: [],
  badges: [],
  level: 1,
  experiencePoints: 0,
  totalSessions: 0,
  lastSessionDate: new Date().toISOString(),
  firstLaunchDate: new Date().toISOString(),
  preferredDifficulty: 'easy',
  reminderSettings: {
    enabled: false,
    time: '19:00',
    frequency: 'daily'
  },
  subscription: {
    isPremium: false,
    plan: 'free',
    features: []
  },
  isProfilePublic: false,
  allowDataCollection: true
};

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_PROGRESS);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({ ...defaultProgress, ...parsed });
      }
    } catch (error) {
      console.log('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem(
        APP_CONFIG.STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(newProgress)
      );
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const incrementDrawing = () => {
    updateProgress({
      drawingsCompleted: progress.drawingsCompleted + 1,
      experiencePoints: progress.experiencePoints + 10
    });
  };

  const incrementStreak = () => {
    const newStreak = progress.currentStreak + 1;
    updateProgress({
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak)
    });
  };

  const resetStreak = () => {
    updateProgress({ currentStreak: 0 });
  };

  const unlockAchievement = (achievementId: string) => {
    const updatedAchievements = progress.achievements.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        : achievement
    );
    updateProgress({ achievements: updatedAchievements });
  };

  const addBadge = (badge: Badge) => {
    updateProgress({
      badges: [...progress.badges, badge]
    });
  };

  const updateSkillLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    updateProgress({ skillLevel: level });
  };

  const completeOnboarding = () => {
    updateProgress({ hasCompletedOnboarding: true });
  };

  const completeAssessment = (skillLevel: 'beginner' | 'intermediate' | 'advanced') => {
    updateProgress({
      hasCompletedAssessment: true,
      skillLevel
    });
  };

  const value: UserProgressContextType = {
    progress,
    updateProgress,
    incrementDrawing,
    incrementStreak,
    resetStreak,
    unlockAchievement,
    addBadge,
    updateSkillLevel,
    completeOnboarding,
    completeAssessment,
    isLoading
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