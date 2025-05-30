import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
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
  icon,
}) => {
  const { theme } = useTheme();
  
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };
    
    // Size variations
    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 },
      large: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 },
    };
    
    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.border : theme.accent,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: disabled ? 0 : 0.1,
        shadowRadius: 4,
        elevation: disabled ? 0 : 2,
      },
      secondary: {
        backgroundColor: disabled ? theme.border : theme.backgroundSecondary,
        borderWidth: 1,
        borderColor: disabled ? theme.border : theme.accent,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? theme.border : theme.accent,
      },
    };
    
    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || loading ? 0.6 : 1,
    };
  };
  
  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };
    
    // Size text styles
    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };
    
    // Variant text colors
    const variantTextColors = {
      primary: disabled ? theme.textTertiary : 'white',
      secondary: disabled ? theme.textTertiary : theme.accent,
      outline: disabled ? theme.textTertiary : theme.accent,
    };
    
    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      color: variantTextColors[variant],
    };
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        {
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{
        color: variant === 'primary' ? 'rgba(255,255,255,0.2)' : theme.accent + '20',
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? 'white' : theme.accent}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle, icon && { marginLeft: 8 }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};