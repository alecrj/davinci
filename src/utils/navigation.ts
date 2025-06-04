import { router as expoRouter } from 'expo-router';

// Safe router wrapper that handles all our routes
export const router = {
  push: (href: string) => expoRouter.push(href as any),
  replace: (href: string) => expoRouter.replace(href as any),
  back: expoRouter.back,
  setParams: expoRouter.setParams,
};

// Navigation helpers
export const navigation = {
  toHome: () => router.push('/(tabs)/'),
  toAssessment: () => router.push('/assessment/'),
  toLessons: (lessonId?: string) => {
    if (lessonId) {
      router.push(`/lessons/${lessonId}`);
    } else {
      router.push('/lessons/basic-shapes');
    }
  },
  toOnboarding: () => router.push('/onboarding/enhanced-assessment'),
  toPractice: () => router.push('/(tabs)/practice'),
  toProfile: () => router.push('/(tabs)/profile'),
};