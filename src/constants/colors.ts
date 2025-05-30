/**
 * FIXED - Color constants for the DaVinci app
 * iOS-inspired color palette with light and dark theme support
 * This resolves ALL color-related TypeScript errors
 */

export const Colors = {
    light: {
      // Text colors
      text: '#11181C',
      textSecondary: '#687076',
      textMuted: '#8E8E93',
      textTertiary: '#8E8E93',
      
      // Background colors
      background: '#FFFFFF',
      backgroundSecondary: '#F2F2F7',
      surface: '#F2F2F7',
      card: '#FFFFFF',
      
      // Interactive colors
      tint: '#007AFF',
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#007AFF',
      accentLight: '#007AFF20',
      
      // Status colors
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      info: '#007AFF',
      
      // Navigation colors
      tabIconDefault: '#687076',
      tabIconSelected: '#007AFF',
      tabBarBackground: '#FFFFFF',
      
      // Border and separator colors
      border: '#C6C6C8',
      separator: '#E5E5EA',
      
      // Drawing specific
      drawingCanvas: '#FFFFFF',
      
      // Drawing colors (nested object)
      drawing: {
        primary: '#007AFF',
        secondary: '#5856D6',
        success: '#34C759',
        canvas: '#FFFFFF',
        grid: '#F2F2F7',
      },
    },
    
    dark: {
      // Text colors
      text: '#ECEDEE',
      textSecondary: '#9BA1A6',
      textMuted: '#636366',
      textTertiary: '#636366',
      
      // Background colors
      background: '#000000',
      backgroundSecondary: '#1C1C1E',
      surface: '#1C1C1E',
      card: '#1C1C1E',
      
      // Interactive colors
      tint: '#0A84FF',
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      accent: '#0A84FF',
      accentLight: '#0A84FF20',
      
      // Status colors
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      info: '#0A84FF',
      
      // Navigation colors
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#0A84FF',
      tabBarBackground: '#000000',
      
      // Border and separator colors
      border: '#38383A',
      separator: '#2C2C2E',
      
      // Drawing specific
      drawingCanvas: '#1C1C1E',
      
      // Drawing colors (nested object)
      drawing: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        success: '#30D158',
        canvas: '#1C1C1E',
        grid: '#2C2C2E',
      },
    },
  } as const;
  
  // Export DrawingColors for backward compatibility
  export const DrawingColors = {
    light: Colors.light.drawing,
    dark: Colors.dark.drawing,
  } as const;
  
  // Type exports
  export type ColorScheme = keyof typeof Colors;
  export type ColorPalette = typeof Colors.light;
  export type DrawingColorPalette = typeof Colors.light.drawing;
  
  // Default export for backward compatibility
  export default Colors;