import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
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
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    if (!disabled && !loading) {
      triggerHaptic('impact');
      onPress();
    }
  };
  
  const getButtonStyles = (): ViewStyle => {
    const baseStyle = styles[size];
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.border : theme.accent,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? theme.border : theme.accent,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
    }
  };
  
  const getTextStyles = (): TextStyle => {
    const sizeStyle = textSizes[size];
    
    switch (variant) {
      case 'primary':
        return {
          ...sizeStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
      case 'ghost':
        return {
          ...sizeStyle,
          color: disabled ? theme.textTertiary : theme.accent,
        };
    }
  };
  
  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getButtonStyles(),
          disabled && styles.disabled,
        ]}
      >
        {loading ? (
          <View style={styles.loader}>
            <Text style={getTextStyles()}>...</Text>
          </View>
        ) : (
          <Text style={[styles.text, getTextStyles(), textStyle]}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  small: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  medium: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  large: {
    height: 56,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  text: {
    fontFamily: 'SF-Pro-Text-Semibold',
  },
  disabled: {
    opacity: 0.6,
  },
  loader: {
    flexDirection: 'row',
  },
});

const textSizes = {
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
};