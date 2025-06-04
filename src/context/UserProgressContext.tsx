import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'casual' | 'hobby' | 'student';

// ✅ FIXED: Added missing assessment result interface
export interface AssessmentResult {
  shapeType: string;
  accuracy: number;
  timeSpent: number;
  completedAt: Date;
}

export interface UserProgress {
  // ✅ FIXED: Added missing properties that components expect
  hasCompletedOnboarding: boolean;
  hasCompletedAssessment: boolean;
  isNewUser: boolean;
  currentLevel: number; // ✅ FIXED: Added missing currentLevel
  
  skillLevel: SkillLevel;
  currentSkillLevel: SkillLevel;
  
  // ✅ FIXED: Added missing assessmentResults
  assessmentResults: AssessmentResult[];
  
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  
  subscriptionTier: 'free' | 'premium' | 'pro';
  subscriptionExpiresAt: Date | null;
  
  achievements: Array<{
    id: string;
    title: string;
    unlockedAt: Date;
  }>;
  
  stats: {
    totalLessonsCompleted: number;
    currentStreak: number;
    totalShapesDrawn: number;
    totalPracticeTime: number;
    averageAccuracy: number;
  };
  
  assessmentScore?: number;
  
  lastActiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressContextType {
  progress: UserProgress;
  isLoading: boolean;
  
  // ✅ FIXED: Direct access properties components expect
  skillLevel: SkillLevel;
  streak: number;
  totalLessonsCompleted: number;
  totalPracticeTime: number;
  weeklyProgress: number[];
  currentLevel: number; // ✅ FIXED: Added missing currentLevel
  assessmentResults: AssessmentResult[]; // ✅ FIXED: Added missing assessmentResults
  
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
  hasCompletedOnboarding: false,
  hasCompletedAssessment: false,
  isNewUser: true,
  currentLevel: 1, // ✅ FIXED: Added default currentLevel
  
  skillLevel: 'beginner',
  currentSkillLevel: 'beginner',
  
  assessmentResults: [], // ✅ FIXED: Added default assessmentResults
  
  streak: 0,
  totalLessonsCompleted: 0,
  totalPracticeTime: 0,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  
  hapticEnabled: true,
  notificationsEnabled: true,
  
  subscriptionTier: 'free',
  subscriptionExpiresAt: null,
  
  achievements: [],
  
  stats: {
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalShapesDrawn: 0,
    totalPracticeTime: 0,
    averageAccuracy: 0,
  },
  
  lastActiveDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress());
  const [isLoading, setIsLoading] = useState(true);

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
    isLoading,
    
    // ✅ FIXED: Direct access properties
    skillLevel: progress.skillLevel,
    streak: progress.streak,
    totalLessonsCompleted: progress.totalLessonsCompleted,
    totalPracticeTime: progress.totalPracticeTime,
    weeklyProgress: progress.weeklyProgress,
    currentLevel: progress.currentLevel, // ✅ FIXED: Added missing currentLevel
    assessmentResults: progress.assessmentResults, // ✅ FIXED: Added missing assessmentResults
    
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