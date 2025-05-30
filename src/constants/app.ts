/**
 * DaVinci App Constants
 * Core configuration for the premium drawing app
 */

// Storage keys for persisting user data
export const STORAGE_KEYS = {
    USER_PROGRESS: '@davinci_user_progress',
    THEME_PREFERENCE: '@davinci_theme',
    ONBOARDING_COMPLETE: '@davinci_onboarding_complete',
    ASSESSMENT_COMPLETE: '@davinci_assessment_complete',
    LESSON_PROGRESS: '@davinci_lesson_progress',
    DRAWING_HISTORY: '@davinci_drawing_history',
    SETTINGS: '@davinci_settings',
  } as const;
  
  // App configuration
  export const APP_CONFIG = {
    name: 'DaVinci',
    version: '1.0.0',
    buildNumber: 1,
    
    // Drawing engine settings
    drawing: {
      maxCanvasSize: 1024,
      targetFPS: 60,
      strokeWidth: {
        min: 1,
        max: 20,
        default: 3,
      },
      shapeDetectionThreshold: 0.6, // 60% confidence minimum
    },
    
    // Lesson system settings
    lessons: {
      defaultDuration: 180, // 3 minutes in seconds
      autoSaveInterval: 10, // seconds
      maxUndoSteps: 50,
    },
    
    // Performance settings
    performance: {
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      imageQuality: 0.8, // 80% quality for exports
      maxExportSize: 2048, // pixels
    },
    
    // Social features
    social: {
      maxShareSize: 1024, // pixels
      anonymousSharing: true,
      moderationEnabled: true,
    },
  } as const;
  
  // User skill levels
  export const SKILL_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate', 
    ADVANCED: 'advanced',
    EXPERT: 'expert',
  } as const;
  
  export type SkillLevel = typeof SKILL_LEVELS[keyof typeof SKILL_LEVELS];
  
  // Achievement categories
  export const ACHIEVEMENT_CATEGORIES = {
    DRAWING: 'drawing',
    LESSONS: 'lessons',
    SOCIAL: 'social',
    STREAKS: 'streaks',
    SPECIAL: 'special',
  } as const;
  
  // Error codes for standardized error handling
  export const ERROR_CODES = {
    NETWORK: 'NETWORK_ERROR',
    STORAGE: 'STORAGE_ERROR',
    DRAWING: 'DRAWING_ERROR',
    PERMISSION: 'PERMISSION_ERROR',
    SUBSCRIPTION: 'SUBSCRIPTION_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR',
  } as const;
  
  // Feature flags for controlling app behavior
  export const FEATURE_FLAGS = {
    AI_FEEDBACK: true,
    SOCIAL_SHARING: true,
    HAPTIC_FEEDBACK: true,
    ANALYTICS: true,
    DEBUG_MODE: __DEV__,
  } as const;
  
  // API endpoints (when backend is implemented)
  export const API_ENDPOINTS = {
    BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://api.davinci.app',
    AUTH: '/auth',
    LESSONS: '/lessons',
    SOCIAL: '/social',
    ANALYTICS: '/analytics',
  } as const;
  
  // Subscription tiers
  export const SUBSCRIPTION_TIERS = {
    FREE: 'free',
    PREMIUM: 'premium',
    PRO: 'pro',
  } as const;
  
  export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];