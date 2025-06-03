// src/components/ui/Modal.tsx
import React from 'react';
import { Modal as RNModal, View, ModalProps } from 'react-native';

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const Modal: React.FC<CustomModalProps> = ({ children, onClose, ...props }) => {
  return (
    <RNModal {...props}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </View>
    </RNModal>
  );
};