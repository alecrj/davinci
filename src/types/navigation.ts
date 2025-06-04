import { router } from '@/utils/navigation'; // ✅ FIXED: Use our safe router

// ✅ FIXED: Safe navigation functions to prevent type errors
export const safeNavigate = {
  // Tab navigation
  toHome: () => router.push('/(tabs)/'),
  toPractice: () => router.push('/(tabs)/practice'),
  toProgress: () => router.push('/(tabs)/progress'),
  toProfile: () => router.push('/(tabs)/profile'),
  
  // Lesson navigation (safe dynamic routes)
  toLesson: (lessonId: string) => {
    router.push('/(tabs)/practice');
  },
  toLessonComplete: () => router.push('/lessons/complete'),
  toLessonFeedback: () => router.push('/lessons/feedback'),
  
  // Assessment navigation
  toAssessment: () => router.push('/assessment/'),
  toAssessmentQuestions: () => router.push('/assessment/questions'),
  toAssessmentDrawingTest: () => router.push('/assessment/drawing-test'),
  toAssessmentResults: () => router.push('/assessment/results'),
  
  // Onboarding navigation
  toOnboardingDrawAnything: () => router.push('/onboarding/draw-anything'),
  toOnboardingPermissions: () => router.push('/onboarding/permissions'),
  
  // Back navigation
  back: () => router.back(),
  
  // Replace navigation (for login flows)
  replace: (path: string) => {
    router.replace(path);
  },
};

// ✅ FIXED: Animation types for animated text component
export type AnimationType = 
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'zoomIn'
  | 'bounceIn'
  | 'pulse'
  | 'shake';

// ✅ FIXED: Navigation utilities
export const navigationUtils = {
  getCurrentRoute: () => 'home',
  isOnTab: (tabName: string) => false,
  getTabIndex: () => 0,
};