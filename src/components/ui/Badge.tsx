// src/components/ui/Badge.tsx
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  return (
    <View style={{ padding: 4, borderRadius: 4, backgroundColor: '#007AFF' }}>
      <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
    </View>
  );
};
