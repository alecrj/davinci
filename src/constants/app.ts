/**
 * FIXED - Complete app constants and configuration
 * Includes ALL missing exports referenced in the codebase
 */

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
    THEME: 'theme',
    USER_PROGRESS: 'userProgress',
    DRAWING_HISTORY: 'drawingHistory',
    LESSON_PROGRESS: 'lessonProgress',
    ACHIEVEMENTS: 'achievements',
    STREAKS: 'streaks',
    SUBSCRIPTION: 'subscription',
    SETTINGS: 'settings',
    // Missing key that was referenced
    assessmentResults: 'assessmentResults',
  } as const;
  
  // Skill levels for user progression
  export const SKILL_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate', 
    ADVANCED: 'advanced',
    EXPERT: 'expert',
  } as const;
  
  // App configuration
  export const APP_CONFIG = {
    NAME: 'DaVinci',
    VERSION: '1.0.0',
    BUILD_NUMBER: 1,
    BUNDLE_ID: 'com.davinci.drawing',
    
    // Performance settings
    TARGET_FPS: 60,
    MAX_DRAWING_POINTS: 1000,
    UNDO_HISTORY_LIMIT: 20,
    
    // Lesson configuration
    LESSON_DURATION_MINUTES: 3,
    MIN_LESSON_COMPLETION_PERCENTAGE: 70,
    STREAK_RESET_HOURS: 24,
    
    // Drawing engine settings
    SHAPE_DETECTION_THRESHOLD: 0.6,
    SMOOTHING_FACTOR: 0.8,
    MIN_STROKE_LENGTH: 10,
    
    // Social features
    MAX_COMMUNITY_UPLOADS_PER_DAY: 5,
    ARTWORK_MAX_SIZE_MB: 5,
    
    // Subscription
    FREE_LESSONS_LIMIT: 3,
    PREMIUM_PRICE_MONTHLY: 9.99,
    PREMIUM_PRICE_YEARLY: 59.99,
  } as const;
  
  // Feature flags for development and A/B testing
  export const FEATURE_FLAGS = {
    ENABLE_HAPTICS: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRASH_REPORTING: true,
    ENABLE_SOCIAL_FEATURES: false, // Will be enabled in Phase 3
    ENABLE_AI_FEEDBACK: false, // Will be enabled in Phase 2
    ENABLE_SUBSCRIPTION: false, // Will be enabled in Phase 4
    ENABLE_DEBUG_MODE: __DEV__,
    // Missing flag that was referenced
    HAPTIC_FEEDBACK: true,
  } as const;
  
  // Animation durations (in milliseconds)
  export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 250,
    SLOW: 400,
    EXTRA_SLOW: 600,
    
    // Specific animations
    TAB_SWITCH: 200,
    MODAL_PRESENT: 300,
    BUTTON_PRESS: 100,
    CELEBRATION: 2000,
    SHAPE_TRANSFORM: 800,
  } as const;
  
  // Haptic feedback patterns
  export const HAPTIC_PATTERNS = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    SELECTION: 'selection',
  } as const;
  
  // Screen dimensions and spacing
  export const LAYOUT = {
    PADDING: {
      XS: 4,
      SM: 8,
      MD: 16,
      LG: 24,
      XL: 32,
    },
    BORDER_RADIUS: {
      SM: 8,
      MD: 12,
      LG: 16,
      XL: 24,
    },
    ICON_SIZE: {
      SM: 16,
      MD: 24,
      LG: 32,
      XL: 48,
    },
  } as const;
  
  // API endpoints (when backend is implemented)
  export const API_ENDPOINTS = {
    BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://api.davinci.app',
    AUTH: '/auth',
    LESSONS: '/lessons',
    PROGRESS: '/progress',
    SOCIAL: '/social',
    SUBSCRIPTION: '/subscription',
  } as const;
  
  // Type exports for TypeScript
  export type SkillLevel = typeof SKILL_LEVELS[keyof typeof SKILL_LEVELS];
  export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
  export type FeatureFlag = keyof typeof FEATURE_FLAGS;
  export type AnimationDuration = typeof ANIMATION_DURATION[keyof typeof ANIMATION_DURATION];
  export type HapticPattern = typeof HAPTIC_PATTERNS[keyof typeof HAPTIC_PATTERNS];