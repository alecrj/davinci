// src/context/UserProgressContext.tsx - COMPLETE CONTEXT WITH ALL PROPERTIES
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AssessmentResult {
  questionScore: number;
  drawingScore: number;
  totalScore: number;
  exercises: Array<{
    exerciseId: string;
    completed: boolean;
    shapeDetected: string | null;
    accuracy: number;
    timeSpent: number;
  }>;
}

export interface UserStats {
  totalLessonsCompleted: number;
  currentStreak: number;
  totalDrawingTime: number;
  shapesDrawn: number;
  perfectScores: number;
}

export interface UserPreferences {
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  language: string;
}

export interface UserProgress {
  // Basic progress
  currentLevel: number;
  currentSkillLevel: string; // ✅ ADDED: For skill level display
  xp: number;
  streakDays: number;
  lastActivity: string;
  
  // ✅ ADDED: Onboarding state
  hasCompletedOnboarding: boolean;
  
  // Assessment data
  hasCompletedAssessment: boolean;
  skillLevel?: string;
  assessmentScore?: number;
  assessmentResults: AssessmentResult[];
  
  // Learning progress
  completedLessons: string[];
  currentLessonPath?: string;
  
  // ✅ ADDED: Statistics
  stats: UserStats;
  
  // ✅ ADDED: Achievements system
  achievements: string[];
  unlockedBadges: string[];
  totalArtworkCreated: number;
  
  // Social features
  following: string[];
  followers: string[];
  
  // ✅ ADDED: User preferences
  preferences: UserPreferences;
  
  // Premium features - ✅ FIXED: Include all tier types
  subscriptionTier?: 'free' | 'plus' | 'pro' | 'academy' | 'premium';
  subscriptionExpiry?: string;
  subscriptionExpiresAt?: string; // ✅ ADDED: Alternative property name used in profile
}

interface UserProgressContextType {
  progress: UserProgress;
  isLoading: boolean; // ✅ ADDED: Loading state
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>; // ✅ ADDED
  resetProgress: () => void;
  addXP: (amount: number) => void;
  levelUp: () => void;
  completeLesson: (lessonId: string) => void;
  addArtwork: () => void;
  incrementStreak: () => void;
  canAccessPremiumFeatures: () => boolean; // ✅ ADDED
  
  // ✅ ADDED: Computed properties for easier access
  skillLevel: string;
  streak: number;
  totalLessonsCompleted: number;
}

const defaultStats: UserStats = {
  totalLessonsCompleted: 0,
  currentStreak: 0,
  totalDrawingTime: 0,
  shapesDrawn: 0,
  perfectScores: 0,
};

const defaultPreferences: UserPreferences = {
  hapticEnabled: true,
  notificationsEnabled: true,
  soundEnabled: true,
  darkMode: false,
  language: 'en',
};

const defaultProgress: UserProgress = {
  currentLevel: 1,
  currentSkillLevel: 'beginner',
  xp: 0,
  streakDays: 0,
  lastActivity: new Date().toISOString(),
  hasCompletedOnboarding: false, // ✅ ADDED
  hasCompletedAssessment: false,
  assessmentResults: [],
  completedLessons: [],
  stats: defaultStats, // ✅ ADDED
  achievements: [], // ✅ ADDED
  unlockedBadges: [],
  totalArtworkCreated: 0,
  following: [],
  followers: [],
  preferences: defaultPreferences, // ✅ ADDED
  subscriptionTier: 'free',
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(false); // ✅ ADDED

  const updateProgress = async (updates: Partial<UserProgress>) => {
    setIsLoading(true);
    setProgress(prev => ({
      ...prev,
      ...updates,
      lastActivity: new Date().toISOString(),
    }));
    setIsLoading(false);
    
    // Here you would sync with backend/storage
    // await saveProgressToStorage(updatedProgress);
  };

  // ✅ ADDED: Update preferences method
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    setIsLoading(true);
    setProgress(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates,
      },
      lastActivity: new Date().toISOString(),
    }));
    setIsLoading(false);
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
      
      return {
        ...prev,
        xp: newXP,
        currentLevel: Math.max(prev.currentLevel, newLevel),
        lastActivity: new Date().toISOString(),
      };
    });
  };

  const levelUp = () => {
    setProgress(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      lastActivity: new Date().toISOString(),
    }));
  };

  const completeLesson = (lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      stats: {
        ...prev.stats,
        totalLessonsCompleted: prev.stats.totalLessonsCompleted + 1,
      },
      lastActivity: new Date().toISOString(),
    }));
  };

  const addArtwork = () => {
    setProgress(prev => ({
      ...prev,
      totalArtworkCreated: prev.totalArtworkCreated + 1,
      stats: {
        ...prev.stats,
        shapesDrawn: prev.stats.shapesDrawn + 1,
      },
      lastActivity: new Date().toISOString(),
    }));
  };

  const incrementStreak = () => {
    const today = new Date().toDateString();
    const lastActivityDate = new Date(progress.lastActivity).toDateString();
    
    if (today !== lastActivityDate) {
      setProgress(prev => ({
        ...prev,
        streakDays: prev.streakDays + 1,
        stats: {
          ...prev.stats,
          currentStreak: prev.streakDays + 1,
        },
        lastActivity: new Date().toISOString(),
      }));
    }
  };

  // ✅ ADDED: Premium features check
  const canAccessPremiumFeatures = (): boolean => {
    return progress.subscriptionTier !== 'free';
  };

  // Load progress from storage on mount
  useEffect(() => {
    // loadProgressFromStorage().then(setProgress);
  }, []);

  const value: UserProgressContextType = {
    progress,
    isLoading,
    updateProgress,
    updatePreferences,
    resetProgress,
    addXP,
    levelUp,
    completeLesson,
    addArtwork,
    incrementStreak,
    canAccessPremiumFeatures,
    
    // ✅ ADDED: Computed properties for easier access
    skillLevel: progress.skillLevel || progress.currentSkillLevel,
    streak: progress.streakDays,
    totalLessonsCompleted: progress.stats.totalLessonsCompleted,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = (): UserProgressContextType => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

export default UserProgressContext;