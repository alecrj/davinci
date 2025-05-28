import { Platform } from 'react-native';
// Note: You'll need to install react-native-haptic-feedback
// npm install react-native-haptic-feedback

// For now, we'll create a mock that you can replace with the real library
type HapticType = 'impact' | 'notification' | 'selection' | 'success' | 'warning' | 'error';

export const triggerHaptic = (type: HapticType = 'impact') => {
  if (Platform.OS !== 'ios') return;
  
  // This is a placeholder - in production, you'd use:
  // import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
  // ReactNativeHapticFeedback.trigger(type);
  
  console.log(`Haptic feedback: ${type}`);
};