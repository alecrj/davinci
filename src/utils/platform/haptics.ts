// src/utils/platform/haptics.ts
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticFeedbackType = 
  | 'light'
  | 'medium' 
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | 'impact';

export interface HapticConfig {
  enabled: boolean;
  intensity?: number;
}

class HapticFeedbackManager {
  private isEnabled: boolean = true;
  private isSupported: boolean = Platform.OS === 'ios';

  constructor() {
    // iOS haptics are automatically supported with expo-haptics
    // Android support varies by device
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  isHapticSupported(): boolean {
    return this.isSupported;
  }

  async light() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async medium() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async heavy() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async selection() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async success() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async warning() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async error() {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async impact(style: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.isEnabled || !this.isSupported) return;
    try {
      const feedbackStyle = style === 'light' 
        ? Haptics.ImpactFeedbackStyle.Light
        : style === 'medium'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy;
      
      await Haptics.impactAsync(feedbackStyle);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  async trigger(type: HapticFeedbackType) {
    switch (type) {
      case 'light':
        return this.light();
      case 'medium':
        return this.medium();
      case 'heavy':
        return this.heavy();
      case 'selection':
        return this.selection();
      case 'success':
        return this.success();
      case 'warning':
        return this.warning();
      case 'error':
        return this.error();
      case 'impact':
        return this.impact();
      default:
        return this.light();
    }
  }
}

// Export singleton instance
export const hapticManager = new HapticFeedbackManager();

// Export convenience function
export const hapticFeedback = {
  light: () => hapticManager.light(),
  medium: () => hapticManager.medium(), 
  heavy: () => hapticManager.heavy(),
  selection: () => hapticManager.selection(),
  success: () => hapticManager.success(),
  warning: () => hapticManager.warning(),
  error: () => hapticManager.error(),
  impact: (style?: 'light' | 'medium' | 'heavy') => hapticManager.impact(style),
  trigger: (type: HapticFeedbackType) => hapticManager.trigger(type),
  setEnabled: (enabled: boolean) => hapticManager.setEnabled(enabled),
  isSupported: () => hapticManager.isHapticSupported(),
};

export default hapticFeedback;