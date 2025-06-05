// src/utils/haptics.ts - COMPLETE HAPTICS SYSTEM WITH ALL METHODS
import * as Haptics from 'expo-haptics';

// Core haptic feedback functions
export const haptics = {
  // Basic feedback levels
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  
  // Notification feedback
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  
  // Selection feedback
  selection: () => Haptics.selectionAsync(),
  
  // Drawing-specific feedback
  drawing: {
    start: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    stroke: () => Haptics.selectionAsync(),
    complete: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  },
  
  // UI interaction feedback
  ui: {
    tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    longPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  },

  // ✅ ALL MISSING METHODS ADDED
  shapeDetected: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  actionSuccess: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  buttonPress: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  celebration: async () => {
    // Special celebration sequence
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 100);
  },

  // ✅ ADDED: Tab selection haptic (was missing)
  tabSelection: async () => {
    await Haptics.selectionAsync();
  },
};

// Alternative export for different import patterns
export const uiHaptics = {
  shapeDetected: haptics.shapeDetected,
  actionSuccess: haptics.actionSuccess,
  buttonPress: haptics.buttonPress,
  celebration: haptics.celebration,
  tabSelection: haptics.tabSelection, // ✅ ADDED: This was missing
  tap: haptics.ui.tap,
  press: haptics.ui.press,
  longPress: haptics.ui.longPress,
  success: haptics.success,
  warning: haptics.warning,
  error: haptics.error,
  selection: haptics.selection,
  light: haptics.light,
  medium: haptics.medium,
  heavy: haptics.heavy,
};

export default haptics;