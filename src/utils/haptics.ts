// src/utils/haptics.ts - COMPLETE HAPTICS WITH ALL EXPORTS

import * as Haptics from 'expo-haptics';

export type HapticType = 
  | 'light'
  | 'medium' 
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact'; // ✅ ADD MISSING 'impact' TYPE

export const hapticFeedback = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  selection: () => Haptics.selectionAsync(),
  
  drawing: {
    start: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    shapeDetected: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    transformation: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    celebration: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
    },
  },
  
  ui: {
    buttonPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    toggle: () => Haptics.selectionAsync(),
    navigation: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    achievement: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  },
};

// ✅ ADD MISSING uiHaptics EXPORT (WHAT FILES ARE LOOKING FOR)
export const uiHaptics = hapticFeedback.ui;

export const triggerHaptic = (type: HapticType) => {
  switch (type) {
    case 'light':
      return hapticFeedback.light();
    case 'medium':
      return hapticFeedback.medium();
    case 'heavy':
      return hapticFeedback.heavy();
    case 'success':
      return hapticFeedback.success();
    case 'warning':
      return hapticFeedback.warning();
    case 'error':
      return hapticFeedback.error();
    case 'selection':
      return hapticFeedback.selection();
    case 'impact': // ✅ ADD MISSING IMPACT CASE
      return hapticFeedback.medium(); // Use medium impact for generic 'impact'
    default:
      return hapticFeedback.light();
  }
};

// ✅ SINGLE DEFAULT EXPORT
export default hapticFeedback;