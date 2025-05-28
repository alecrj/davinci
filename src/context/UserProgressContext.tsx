import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SkillLevel = 'beginner' | 'casual' | 'hobby' | 'student' | 'professional';

interface UserProgress {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  skillLevel: SkillLevel | null;
  completedLessons: string[];
  currentStreak: number;
  totalDrawings: number;
  favoriteSubjects: string[];
  unlockedAchievements: string[];
  lastActiveDate: string;
}

interface UserProgressContextType {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const defaultProgress: UserProgress = {
  isNewUser: true,
  hasCompletedOnboarding: false,
  skillLevel: null,
  completedLessons: [],
  currentStreak: 0,
  totalDrawings: 0,
  favoriteSubjects: [],
  unlockedAchievements: [],
  lastActiveDate: new Date().toISOString(),
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // Load progress from storage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProgress');
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const resetProgress = async () => {
    setProgress(defaultProgress);
    try {
      await AsyncStorage.removeItem('userProgress');
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  };

  return (
    <UserProgressContext.Provider value={{ progress, updateProgress, resetProgress }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within UserProgressProvider');
  }
  return context;
};