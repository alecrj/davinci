// src/components/ui/Card.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[{ padding: 16, borderRadius: 8, backgroundColor: 'white' }, style]}>
      {children}
    </View>
  );
};