// src/components/ui/ProgressBar.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress,
  color,
  backgroundColor,
  height = 8,
  borderRadius,
  style,
  animated = true
}) => {
  const { theme } = useTheme();
  
  const progressColor = color || theme.colors.primary;
  const bgColor = backgroundColor || theme.colors.border;
  const radius = borderRadius ?? height / 2;
  
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <View style={[
      {
        height,
        backgroundColor: bgColor,
        borderRadius: radius,
        overflow: 'hidden',
      },
      style
    ]}>
      <View style={{
        height: '100%',
        width: `${clampedProgress}%`,
        backgroundColor: progressColor,
        borderRadius: radius,
      }} />
    </View>
  );
};