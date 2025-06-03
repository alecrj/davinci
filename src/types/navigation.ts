// src/types/navigation.ts - ROUTER TYPE FIXES
import { router } from 'expo-router';

// ✅ SAFE ROUTER NAVIGATION HELPER
export const safeNavigate = {
  toLesson: (lessonId: string) => {
    // Navigate to lessons directory with lessonId as query param instead of dynamic route
    router.push({
      pathname: '/lessons/complete',
      params: { lessonId }
    } as any);
  },
  
  toLessons: () => {
    router.push('/lessons/complete' as any);
  },
  
  toBasicShapes: () => {
    router.push('/lessons/complete' as any);
  },
  
  toAssessment: () => {
    router.push('/assessment' as any);
  },
  
  toOnboarding: () => {
    router.push('/onboarding/draw-anything' as any);
  },
  
  toTabs: () => {
    router.push('/(tabs)' as any);
  },
  
  back: () => {
    router.back();
  },
  
  replace: (path: string) => {
    router.replace(path as any);
  }
};

// ✅ LESSON ROUTING HELPER - SAFER APPROACH
export const navigateToLesson = (lessonId: string) => {
  // For now, navigate to the lessons index and handle lesson selection there
  router.push('/lessons/complete' as any);
};