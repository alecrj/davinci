/**
 * DaVinci Button Component
 * Premium iOS-style button with haptic feedback
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { uiHaptics } from '@/utils/haptics';

export type ButtonVariant = 
  | 'primary'
  | 'secondary' 
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      uiHaptics.buttonPress();
    }
    
    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    const sizeStyle = styles[size];
    const variantStyle = styles[variant];
    const disabledStyle = disabled ? styles.disabled : {};
    const fullWidthStyle = fullWidth ? styles.fullWidth : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...disabledStyle,
      ...fullWidthStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = styles.text;
    const sizeTextStyle = styles[`${size}Text`];
    const variantTextStyle = styles[`${variant}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};

    return {
      ...baseTextStyle,
      ...sizeTextStyle,
      ...variantTextStyle,
      ...disabledTextStyle,
      ...textStyle,
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.light.text : Colors.light.primary}
          size={size === 'small' ? 'small' : 'small'}
        />
      );
    }

    return (
      <>
        {icon && icon}
        <Text style={getTextStyle()}>{title}</Text>
      </>
    );
  };

  // Use gradient for primary buttons
  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[getButtonStyle(), { padding: 0 }]}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            styles[size],
            fullWidth && styles.fullWidth,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={getButtonStyle()}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  
  // Size variants
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  
  // Button variant styles
  primary: {
    backgroundColor: Colors.light.primary,
  },
  
  secondary: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  destructive: {
    backgroundColor: Colors.light.error,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  smallText: {
    fontSize: 14,
    lineHeight: 18,
  },
  
  mediumText: {
    fontSize: 16,
    lineHeight: 20,
  },
  
  largeText: {
    fontSize: 18,
    lineHeight: 22,
  },
  
  // Text variant styles
  primaryText: {
    color: Colors.light.text,
  },
  
  secondaryText: {
    color: Colors.light.text,
  },
  
  outlineText: {
    color: Colors.light.primary,
  },
  
  ghostText: {
    color: Colors.light.primary,
  },
  
  destructiveText: {
    color: Colors.light.text,
  },
  
  // Disabled styles
  disabled: {
    opacity: 0.5,
  },
  
  disabledText: {
    color: Colors.light.textTertiary,
  },
  
  // Layout modifiers
  fullWidth: {
    width: '100%',
  },
});