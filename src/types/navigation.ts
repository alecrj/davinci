// src/types/navigation.ts - SAFE NAVIGATION UTILITIES
import { router } from 'expo-router';

// ✅ SAFE NAVIGATION FUNCTIONS TO PREVENT TYPE ERRORS
export const safeNavigate = {
  // Tab navigation
  toHome: () => router.push('/(tabs)/'),
  toPractice: () => router.push('/(tabs)/practice'),
  toProgress: () => router.push('/(tabs)/progress'),
  toProfile: () => router.push('/(tabs)/profile'),
  
  // Lesson navigation (safe dynamic routes)
  toLesson: (lessonId: string) => {
    // For now, navigate to practice until lesson routes are implemented
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
  
  // Social navigation
  toSocialGallery: () => router.push('/social/gallery'),
  toSocialChallenges: () => router.push('/social/challenges'),
  toSocialShare: () => router.push('/social/share'),
  
  // Subscription navigation
  toSubscriptionPlans: () => router.push('/subscription/plans'),
  toSubscriptionManage: () => router.push('/subscription/manage'),
  toSubscriptionSuccess: () => router.push('/subscription/success'),
  
  // Modal navigation
  toModal: () => router.push('/modal'),
  
  // Admin navigation
  toAdminAnalytics: () => router.push('/admin/analytics'),
  toAdminDebug: () => router.push('/admin/debug'),
  toAdminPerformance: () => router.push('/admin/performance'),
  
  // Back navigation
  back: () => router.back(),
  canGoBack: () => router.canGoBack(),
  
  // Replace navigation (for login flows)
  replace: (path: string) => {
    // Only allow safe paths
    const safePaths = [
      '/(tabs)/',
      '/onboarding/draw-anything',
      '/assessment/',
    ];
    
    if (safePaths.includes(path)) {
      router.replace(path as any);
    } else {
      router.replace('/(tabs)/');
    }
  },
};

// ✅ ANIMATION TYPES FOR ANIMATED TEXT COMPONENT
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

// ✅ NAVIGATION UTILITIES
export const navigationUtils = {
  // Get current route name
  getCurrentRoute: () => {
    // This would need to be implemented with navigation state
    return 'home';
  },
  
  // Check if on specific tab
  isOnTab: (tabName: string) => {
    return false; // Placeholder
  },
  
  // Get tab index
  getTabIndex: () => {
    return 0; // Placeholder
  },
};