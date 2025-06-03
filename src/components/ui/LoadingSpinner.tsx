// src/components/ui/LoadingSpinner.tsx
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'small', 
  color = '#007AFF' 
}) => {
  return <ActivityIndicator size={size} color={color} />;
};
