// src/components/ui/index.ts - CLEAN UI COMPONENT EXPORTS

// ✅ MAIN UI COMPONENTS
export { Button } from './Button';
export { AnimatedText } from './AnimatedText';
export { ExternalLink } from './ExternalLink';
export { MonoText } from './StyledText';

// ✅ PLACEHOLDER COMPONENTS (CREATE SIMPLE VERSIONS TO AVOID ERRORS)

// Badge Component
export const Badge: React.FC<{ children: React.ReactNode; variant?: string }> = ({ children }) => {
  return null; // Placeholder
};

// Card Component  
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return null; // Placeholder
};

// Input Component
export const Input: React.FC<{ placeholder?: string; value?: string; onChangeText?: (text: string) => void }> = () => {
  return null; // Placeholder
};

// LoadingSpinner Component
export const LoadingSpinner: React.FC<{ size?: 'small' | 'large' }> = () => {
  return null; // Placeholder
};

// Modal Component
export const Modal: React.FC<{ visible: boolean; onClose: () => void; children: React.ReactNode }> = () => {
  return null; // Placeholder
};

// ProgressBar Component
export const ProgressBar: React.FC<{ progress: number; color?: string }> = () => {
  return null; // Placeholder
};