import * as Haptics from 'expo-haptics';

export type HapticType = 
  | 'light'
  | 'medium' 
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact';

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
    tabSelection: () => Haptics.selectionAsync(),
    actionSuccess: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    // ✅ FIXED: Added missing methods that components expect
    shapeDetected: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    celebration: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);
    },
  },
};

// ✅ FIXED: Export uiHaptics with all required methods
export const uiHaptics = hapticFeedback.ui;

// ✅ FIXED: Export individual methods for backward compatibility
export const haptics = hapticFeedback;

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
    case 'impact':
      return hapticFeedback.medium();
    default:
      return hapticFeedback.light();
  }
};

export default hapticFeedback;