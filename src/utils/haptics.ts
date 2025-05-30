/**
 * DaVinci Haptic Feedback System
 * Strategic haptic feedback for confidence building and iOS premium feel
 */

import * as Haptics from 'expo-haptics';
import { FEATURE_FLAGS } from '@/constants/app';

// Haptic feedback types for different interactions
export type HapticType = 
  | 'light'
  | 'medium' 
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact';

/**
 * Trigger haptic feedback with fallback handling
 */
export const triggerHaptic = async (type: HapticType): Promise<void> => {
  // Check if haptics are enabled
  if (!FEATURE_FLAGS.HAPTIC_FEEDBACK) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
        
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
        
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
        
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
        
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
        
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
        
      case 'selection':
        await Haptics.selectionAsync();
        break;
        
      case 'impact':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
        
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Fail silently - haptics are non-critical
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Drawing-specific haptic feedback functions
 */
export const drawingHaptics = {
  /**
   * Light tap when user starts drawing
   */
  startDrawing: () => triggerHaptic('light'),
  
  /**
   * Medium impact when shape is detected
   */
  shapeDetected: () => triggerHaptic('medium'),
  
  /**
   * Success feedback when transformation happens
   */
  transformationSuccess: () => triggerHaptic('success'),
  
  /**
   * Light feedback when user completes a stroke
   */
  strokeComplete: () => triggerHaptic('light'),
  
  /**
   * Heavy impact for major achievements
   */
  majorAchievement: () => triggerHaptic('heavy'),
  
  /**
   * Selection feedback for tool changes
   */
  toolChange: () => triggerHaptic('selection'),
  
  /**
   * Warning for invalid actions
   */
  invalidAction: () => triggerHaptic('warning'),
  
  /**
   * Error feedback for failures
   */
  actionFailed: () => triggerHaptic('error'),
};

/**
 * UI interaction haptic feedback functions
 */
export const uiHaptics = {
  /**
   * Button press feedback
   */
  buttonPress: () => triggerHaptic('light'),
  
  /**
   * Tab selection feedback
   */
  tabSelection: () => triggerHaptic('selection'),
  
  /**
   * Modal/sheet presentation
   */
  modalPresent: () => triggerHaptic('light'),
  
  /**
   * Modal/sheet dismissal
   */
  modalDismiss: () => triggerHaptic('light'),
  
  /**
   * Success action completion
   */
  actionSuccess: () => triggerHaptic('success'),
  
  /**
   * Navigation feedback
   */
  navigate: () => triggerHaptic('light'),
  
  /**
   * Long press recognition
   */
  longPress: () => triggerHaptic('medium'),
  
  /**
   * Swipe gesture feedback
   */
  swipe: () => triggerHaptic('light'),
};

/**
 * Assessment and lesson haptic feedback
 */
export const assessmentHaptics = {
  /**
   * Question answered correctly
   */
  correctAnswer: () => triggerHaptic('success'),
  
  /**
   * Question answered incorrectly (gentle)
   */
  incorrectAnswer: () => triggerHaptic('warning'),
  
  /**
   * Assessment completed successfully
   */
  assessmentComplete: () => triggerHaptic('heavy'),
  
  /**
   * Lesson progress milestone
   */
  lessonMilestone: () => triggerHaptic('medium'),
  
  /**
   * Lesson completed
   */
  lessonComplete: () => triggerHaptic('success'),
  
  /**
   * Skill level up
   */
  skillLevelUp: () => triggerHaptic('heavy'),
};

/**
 * Social interaction haptic feedback
 */
export const socialHaptics = {
  /**
   * Artwork shared successfully
   */
  artworkShared: () => triggerHaptic('success'),
  
  /**
   * Received encouragement/like
   */
  receivedEncouragement: () => triggerHaptic('medium'),
  
  /**
   * Challenge completed
   */
  challengeComplete: () => triggerHaptic('success'),
  
  /**
   * Featured in gallery
   */
  featuredArtwork: () => triggerHaptic('heavy'),
};

/**
 * Subscription and premium haptic feedback
 */
export const subscriptionHaptics = {
  /**
   * Purchase successful
   */
  purchaseSuccess: () => triggerHaptic('heavy'),
  
  /**
   * Purchase failed
   */
  purchaseFailed: () => triggerHaptic('error'),
  
  /**
   * Premium feature unlocked
   */
  featureUnlocked: () => triggerHaptic('success'),
  
  /**
   * Trial started
   */
  trialStarted: () => triggerHaptic('medium'),
};

/**
 * Custom haptic pattern for special celebrations
 */
export const celebrationHaptic = async (): Promise<void> => {
  if (!FEATURE_FLAGS.HAPTIC_FEEDBACK) return;
  
  try {
    // Triple tap pattern for major celebrations
    await triggerHaptic('medium');
    await new Promise(resolve => setTimeout(resolve, 100));
    await triggerHaptic('heavy');
    await new Promise(resolve => setTimeout(resolve, 100));
    await triggerHaptic('success');
  } catch (error) {
    console.warn('Celebration haptic failed:', error);
  }
};

/**
 * Check if haptic feedback is available on the device
 */
export const isHapticAvailable = (): boolean => {
  return FEATURE_FLAGS.HAPTIC_FEEDBACK && Haptics !== undefined;
};