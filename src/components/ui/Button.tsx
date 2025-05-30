// src/components/ui/Button.tsx - COMPLETE FILE REPLACEMENT
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { hapticFeedback } from '@/utils/platform/haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  // FIXED: Accept style arrays like regular React Native components
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      hapticFeedback('light');
      onPress();
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: Colors.light.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: Colors.light.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.light.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: Colors.light.primary,
          borderWidth: 0,
        };
    }
  };

  const getVariantTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return {
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          color: Colors.light.primary,
        };
      case 'ghost':
        return {
          color: Colors.light.primary,
        };
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
        };
      case 'medium':
        return {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 16,
        };
      default:
        return {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        };
    }
  };

  const getSizeTextStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
          fontWeight: '600',
        };
      case 'medium':
        return {
          fontSize: 16,
          fontWeight: '600',
        };
      case 'large':
        return {
          fontSize: 18,
          fontWeight: '700',
        };
      default:
        return {
          fontSize: 16,
          fontWeight: '600',
        };
    }
  };

  const baseStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const baseTextStyles: TextStyle = {
    textAlign: 'center',
  };

  const disabledStyles: ViewStyle = {
    opacity: 0.6,
  };

  return (
    <TouchableOpacity
      style={[
        baseStyles,
        getVariantStyles(),
        getSizeStyles(),
        disabled && disabledStyles,
        style, // FIXED: Now properly accepts arrays
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.light.primary : '#FFFFFF'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        style={[
          baseTextStyles,
          getVariantTextStyles(),
          getSizeTextStyles(),
          textStyle, // FIXED: Now properly accepts arrays
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};