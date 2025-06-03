// src/components/ui/Input.tsx
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  // Add any custom props here
}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <TextInput
      style={{ 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 12,
        fontSize: 16 
      }}
      {...props}
    />
  );
};
