// src/components/ui/Button.tsx
import React from 'react';
import { 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  StyleProp,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { hapticFeedback } from '@/utils/platform/haptics';
import { AnimatedText } from './AnimatedText';
import { createGradient } from '@/utils/colors/gradientHelper';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'; // ✅ ADD DESTRUCTIVE
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  fullWidth?: boolean;
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
  hapticType = 'light',
  fullWidth = false,
  icon,
}) => {
  const { colors, isDark } = useTheme();

  const handlePress = async () => {
    if (disabled || loading) return;
    
    // Trigger haptic feedback
    await hapticFeedback.trigger(hapticType);
    onPress();
  };

  const getButtonStyles = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };

    const sizeStyles: Record<typeof size, ViewStyle> = {
      small: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
      medium: { paddingVertical: 12, paddingHorizontal: 20, minHeight: 44 },
      large: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 52 },
    };

    const variantStyles: Record<typeof variant, ViewStyle> = {
      primary: {},
      secondary: { backgroundColor: colors.secondary },
      outline: { 
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      },
      ghost: { backgroundColor: 'transparent' },
      destructive: { backgroundColor: '#FF3B30' }, // ✅ ADD DESTRUCTIVE STYLES
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyles = (): StyleProp<TextStyle> => {
    const sizeStyles: Record<typeof size, TextStyle> = {
      small: { fontSize: 14, fontWeight: '600' },
      medium: { fontSize: 16, fontWeight: '600' },
      large: { fontSize: 18, fontWeight: '700' },
    };

    const variantStyles: Record<typeof variant, TextStyle> = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
      destructive: { color: '#FFFFFF' }, // ✅ ADD DESTRUCTIVE TEXT COLOR
    };

    return [sizeStyles[size], variantStyles[variant]];
  };

  const renderButton = () => (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
          style={{ marginRight: icon || title ? 8 : 0 }}
        />
      )}
      
      {icon && !loading && (
        <>{icon}</>
      )}
      
      {title && (
        <AnimatedText
          style={[getTextStyles(), textStyle, { marginLeft: icon && !loading ? 8 : 0 }]}
          animation="fadeIn"
        >
          {title}
        </AnimatedText>
      )}
    </TouchableOpacity>
  );

  // Use gradient for primary and destructive variants
  if (variant === 'primary') {
    return (
      <LinearGradient
        colors={createGradient([colors.primary, colors.secondary])}
        style={[getButtonStyles(), style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          {loading && (
            <ActivityIndicator 
              size="small" 
              color="#FFFFFF"
              style={{ marginRight: icon || title ? 8 : 0 }}
            />
          )}
          
          {icon && !loading && (
            <>{icon}</>
          )}
          
          {title && (
            <AnimatedText
              style={[getTextStyles(), textStyle, { marginLeft: icon && !loading ? 8 : 0 }]}
              animation="fadeIn"
            >
              {title}
            </AnimatedText>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (variant === 'destructive') {
    return (
      <LinearGradient
        colors={createGradient(['#FF3B30', '#FF6961'])}
        style={[getButtonStyles(), style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          {loading && (
            <ActivityIndicator 
              size="small" 
              color="#FFFFFF"
              style={{ marginRight: icon || title ? 8 : 0 }}
            />
          )}
          
          {icon && !loading && (
            <>{icon}</>
          )}
          
          {title && (
            <AnimatedText
              style={[getTextStyles(), textStyle, { marginLeft: icon && !loading ? 8 : 0 }]}
              animation="fadeIn"
            >
              {title}
            </AnimatedText>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return renderButton();
};