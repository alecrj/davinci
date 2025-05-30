/**
 * DaVinci Color System
 * Premium iOS-optimized color palette
 */

export const Colors = {
    light: {
      // Primary brand colors
      primary: '#007AFF',      // iOS Blue
      primaryDark: '#0056CC',  // Darker blue for pressed states
      secondary: '#5856D6',    // iOS Purple
      accent: '#FF9500',       // iOS Orange
      
      // Drawing colors
      canvas: '#FFFFFF',       // Pure white canvas
      stroke: '#000000',       // Black drawing strokes
      guide: '#E5E5EA',        // Light gray guides
      
      // UI colors
      background: '#FFFFFF',
      surface: '#F2F2F7',      // iOS light gray
      card: '#FFFFFF',
      
      // Text colors
      text: '#000000',
      textSecondary: '#8E8E93', // iOS secondary text
      textTertiary: '#C7C7CC',  // iOS tertiary text
      
      // Interactive colors
      success: '#34C759',       // iOS Green
      warning: '#FF9500',       // iOS Orange
      error: '#FF3B30',         // iOS Red
      info: '#007AFF',          // iOS Blue
      
      // Border and separator colors
      border: '#C6C6C8',
      separator: '#E5E5EA',
      
      // Special colors
      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    dark: {
      // Primary brand colors
      primary: '#0A84FF',      // iOS Blue (dark mode)
      primaryDark: '#0969DA',  // Darker blue for pressed states
      secondary: '#5E5CE6',    // iOS Purple (dark mode)
      accent: '#FF9F0A',       // iOS Orange (dark mode)
      
      // Drawing colors
      canvas: '#1C1C1E',       // Dark canvas
      stroke: '#FFFFFF',       // White drawing strokes
      guide: '#38383A',        // Dark gray guides
      
      // UI colors
      background: '#000000',
      surface: '#1C1C1E',      // iOS dark gray
      card: '#2C2C2E',         // iOS elevated dark
      
      // Text colors
      text: '#FFFFFF',
      textSecondary: '#8E8E93', // iOS secondary text (same in dark)
      textTertiary: '#48484A',  // iOS tertiary text (dark)
      
      // Interactive colors
      success: '#30D158',       // iOS Green (dark mode)
      warning: '#FF9F0A',       // iOS Orange (dark mode)
      error: '#FF453A',         // iOS Red (dark mode)
      info: '#0A84FF',          // iOS Blue (dark mode)
      
      // Border and separator colors
      border: '#38383A',
      separator: '#38383A',
      
      // Special colors
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
  };
  
  // Drawing-specific color palettes
  export const DrawingColors = {
    brushes: [
      '#000000', // Black
      '#FF3B30', // Red
      '#FF9500', // Orange
      '#FFCC00', // Yellow
      '#34C759', // Green
      '#007AFF', // Blue
      '#5856D6', // Purple
      '#FF2D92', // Pink
    ],
    
    transformations: {
      circle: '#007AFF',
      square: '#34C759', 
      triangle: '#FF9500',
      star: '#5856D6',
      heart: '#FF2D92',
      arrow: '#FF3B30',
      house: '#FFCC00',
      flower: '#FF69B4',
    },
  };
  
  // Gradient definitions for premium effects
  export const Gradients = {
    primary: ['#007AFF', '#5856D6'],
    success: ['#34C759', '#30D158'],
    warm: ['#FF9500', '#FF2D92'],
    cool: ['#007AFF', '#34C759'],
    sunset: ['#FF9500', '#FF3B30'],
    ocean: ['#007AFF', '#00C7BE'],
  };