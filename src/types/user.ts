// User-related type definitions
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: string;
    lastLoginAt: string;
    preferences: UserPreferences;
    progress: UserProgress;
  }
  
  export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    haptics: boolean;
    musicEnabled: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }
  
  export interface UserProgress {
    // Core Progress
    totalXP: number;
    currentLevel: number; // ✅ ADDED: Missing property used in onboarding
    streakDays: number;
    lessonsCompleted: number;
    achievementsUnlocked: string[];
    
    // Onboarding Progress
    onboardingCompleted: boolean;
    enhancedOnboardingCompleted: boolean; // ✅ ADDED: For iPad-first enhanced assessment
    drawingAssessmentCompleted: boolean;
    hasCreatedFirstDrawing: boolean;
    
    // Assessment Results
    assessmentResults?: AssessmentResults; // ✅ ADDED: Missing property used in drawing-test
    professionalTrack?: string; // ✅ ADDED: Professional development pathway
    assessmentScore?: number; // ✅ ADDED: Enhanced assessment scoring
    questionResponses?: Record<number, string[]>; // ✅ ADDED: Question responses from assessment
    drawingAssessments?: any[]; // ✅ ADDED: Drawing challenge results
    analysisResult?: any; // ✅ ADDED: Analysis from drawing assessment
    drawingResults?: any[]; // ✅ ADDED: Drawing test results
    
    // Learning Progress
    currentTrack?: string;
    completedLessons: string[];
    unlockedLessons: string[];
    skillLevels: Record<string, number>;
    
    // Drawing Stats
    totalDrawingsCreated: number;
    totalDrawingTime: number;
    favoriteTools: string[];
    
    // Battle Stats
    battlesWon: number;
    battlesLost: number;
    currentRank: string;
    tournamentParticipations: number;
    
    // Timestamps
    lastActivityDate: string;
    lastLessonDate?: string;
    lastBattleDate?: string;
  }
  
  export interface AssessmentResults {
    userType: 'confident_explorer' | 'methodical_builder' | 'creative_expressionist' | 'returning_artist' | 'complete_beginner';
    confidenceLevel: number;
    preferredLearningStyle: string;
    recommendedTrack: string;
    strengths: string[];
    areasForImprovement: string[];
    personalizedMessage: string;
    estimatedTimeToGoal: string;
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    unlockCondition: string;
    category: 'drawing' | 'learning' | 'social' | 'streak' | 'battle';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt?: string;
  }
  
  export interface UserStats {
    dailyStreak: number;
    longestStreak: number;
    totalTimeSpent: number;
    favoriteLessonType: string;
    mostUsedTool: string;
    averageSessionLength: number;
    weeklyProgress: number[];
    monthlyProgress: number[];
  }
  
  // Learning track definitions
  export interface LearningTrack {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    prerequisites: string[];
    lessons: string[];
    skills: string[];
    certificate?: string;
  }
  
  // Professional development tracks for iPad-first approach
  export interface ProfessionalTrack {
    id: string;
    title: string;
    description: string;
    targetAudience: string;
    timeCommitment: string;
    milestones: string[];
    careerOutcomes: string[];
    institutionalSupport: boolean;
  }