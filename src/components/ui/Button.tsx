import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { uiHaptics } from '@/utils/haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  hapticFeedback = true,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const handlePress = () => {
    if (loading || disabled) return;
    
    if (hapticFeedback) {
      uiHaptics.buttonPress();
    }
    
    onPress();
  };

  // ✅ FIXED: Use available theme colors instead of non-existent properties
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      paddingHorizontal: getPaddingHorizontal(),
      paddingVertical: getPaddingVertical(),
      minHeight: getMinHeight(),
      opacity: disabled ? 0.6 : 1,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: '#FF3B30', // ✅ FIXED: Use fallback instead of non-existent colors.destructive
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
    }
  };

  // ✅ FIXED: Use available theme colors
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: getFontSize(),
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: '#FFFFFF', // ✅ FIXED: Use fallback instead of colors.primaryForeground
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: colors.text, // ✅ FIXED: Use available colors.text
        };
      case 'outline':
        return {
          ...baseStyle,
          color: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: colors.primary,
        };
      case 'destructive':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      default:
        return {
          ...baseStyle,
          color: '#FFFFFF', // ✅ FIXED: Use fallback
        };
    }
  };

  const getPaddingHorizontal = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 16;
      case 'large':
        return 24;
      default:
        return 16;
    }
  };

  const getPaddingVertical = (): number => {
    switch (size) {
      case 'small':
        return 8;
      case 'medium':
        return 12;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  const getMinHeight = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 44;
      case 'large':
        return 52;
      default:
        return 44;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const getSpinnerSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  // ✅ FIXED: Use available theme colors
  const getSpinnerColor = (): string => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // ✅ FIXED: Use fallback
      case 'secondary':
        return colors.text; // ✅ FIXED: Use available colors.text
      case 'outline':
      case 'ghost':
        return colors.primary;
      case 'destructive':
        return '#FFFFFF';
      default:
        return '#FFFFFF'; // ✅ FIXED: Use fallback
    }
  };

  const combineTextStyles = (): TextStyle[] => {
    const baseStyles = getTextStyles();
    const styles: TextStyle[] = [baseStyles];
    
    if (textStyle) {
      if (Array.isArray(textStyle)) {
        textStyle.forEach(style => {
          if (style) {
            styles.push(style as TextStyle);
          }
        });
      } else if (textStyle) {
        styles.push(textStyle as TextStyle);
      }
    }
    
    return styles;
  };

  if (loading) {
    return (
      <TouchableOpacity
        style={[getButtonStyles(), style]}
        disabled={true}
        activeOpacity={0.8}
      >
        <ActivityIndicator 
          size={getSpinnerSize()} 
          color={getSpinnerColor()} 
        />
        {icon && (
          <View style={{ marginLeft: 8 }}>
            {icon}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && !loading && (
        <View style={{ marginRight: 8 }}>
          {icon}
        </View>
      )}
      
      <Text 
        style={[
          ...combineTextStyles(),
          { marginLeft: icon && !loading ? 8 : 0 }
        ]}
      >
        {title}
      </Text>
      
      {loading && (
        <View style={{ marginLeft: icon ? 8 : 0 }}>
          <ActivityIndicator 
            size={getSpinnerSize()} 
            color={getSpinnerColor()} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;