// src/components/drawing/ToolPalette.tsx - PROFESSIONAL 5-BRUSH SYSTEM
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useDrawing } from '@/context/DrawingContext';
import { uiHaptics } from '@/utils/haptics';

// ✅ PROFESSIONAL: 5 Essential Brushes with Procreate-level Quality
const ESSENTIAL_BRUSHES = [
  {
    id: 'pencil',
    name: 'Pencil',
    type: 'pencil' as const,
    icon: '✏️',
    size: 2,
    opacity: 0.8,
    color: '#2C2C2C',
    description: 'Natural drawing feel with texture',
  },
  {
    id: 'pen',
    name: 'Pen',
    type: 'pen' as const,
    icon: '🖊️',
    size: 3,
    opacity: 1.0,
    color: '#000000',
    description: 'Clean, precise lines',
  },
  {
    id: 'marker',
    name: 'Marker',
    type: 'marker' as const,
    icon: '🖍️',
    size: 8,
    opacity: 0.7,
    color: '#FF6B35',
    description: 'Smooth strokes with transparency',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    type: 'brush' as const,
    icon: '🎨',
    size: 12,
    opacity: 0.5,
    color: '#4A90E2',
    description: 'Soft edges with flow simulation',
  },
  {
    id: 'eraser',
    name: 'Eraser',
    type: 'eraser' as const,
    icon: '🧽',
    size: 10,
    opacity: 1.0,
    color: '#FFFFFF',
    description: 'Clean removal with pressure sensitivity',
  },
];

// ✅ PROFESSIONAL: 12 Essential Colors
const ESSENTIAL_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White  
  '#FF3B30', // Red
  '#007AFF', // Blue
  '#34C759', // Green
  '#FFCC02', // Yellow
  '#FF9500', // Orange
  '#AF52DE', // Purple
  '#FF2D92', // Pink
  '#8E8E93', // Brown/Gray
  '#636366', // Gray
  '#00C7BE', // Cyan
];

interface ToolPaletteProps {
  style?: any;
  onToolChange?: (toolId: string) => void;
  onColorChange?: (color: string) => void;
  compact?: boolean;
}

export const ToolPalette: React.FC<ToolPaletteProps> = ({
  style,
  onToolChange,
  onColorChange,
  compact = false,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { state: drawingState, changeTool, changeColor, changeBrushSize } = useDrawing();
  
  const [selectedBrush, setSelectedBrush] = useState(ESSENTIAL_BRUSHES[1]); // Default to pen
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // ✅ PROFESSIONAL: Tool selection with haptic feedback
  const handleBrushSelect = useCallback((brush: typeof ESSENTIAL_BRUSHES[0]) => {
    setSelectedBrush(brush);
    
    // Update drawing context with all tool properties
    changeTool({
      id: brush.id,
      name: brush.name,
      type: brush.type,
      size: brush.size,
      opacity: brush.opacity,
      color: selectedColor, // Use current selected color
    });

    // Update brush size in context
    changeBrushSize(brush.size);
    
    // Professional haptic feedback
    uiHaptics.buttonPress();
    
    // Callback for parent components
    onToolChange?.(brush.id);
  }, [changeTool, changeBrushSize, selectedColor, onToolChange]);

  // ✅ PROFESSIONAL: Color selection with immediate preview
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
    changeColor(color);
    
    // Update current tool with new color
    changeTool({
      ...selectedBrush,
      color,
    });

    // Professional haptic feedback
    uiHaptics.actionSuccess();
    
    // Callback for parent components
    onColorChange?.(color);
    
    // Auto-hide color picker in compact mode
    if (compact) {
      setShowColorPicker(false);
    }
  }, [changeColor, changeTool, selectedBrush, compact, onColorChange]);

  const toggleColorPicker = useCallback(() => {
    setShowColorPicker(!showColorPicker);
    uiHaptics.buttonPress();
  }, [showColorPicker]);

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.card }, style]}>
        {/* Active Tool Display */}
        <View style={[styles.activeToolDisplay, { backgroundColor: colors.background }]}>
          <Text style={styles.toolIcon}>{selectedBrush.icon}</Text>
          <View style={[styles.colorIndicator, { backgroundColor: selectedColor }]} />
        </View>

        {/* Color Picker Toggle */}
        <TouchableOpacity
          style={[styles.colorPickerToggle, { backgroundColor: colors.background }]}
          onPress={toggleColorPicker}
        >
          <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
        </TouchableOpacity>

        {/* Compact Color Picker */}
        {showColorPicker && (
          <View style={[styles.compactColorGrid, { backgroundColor: colors.card }]}>
            {ESSENTIAL_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.compactColorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Professional Tools</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {selectedBrush.description}
        </Text>
      </View>

      {/* Brush Selection */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.brushesContainer}
        contentContainerStyle={styles.brushesContent}
      >
        {ESSENTIAL_BRUSHES.map((brush) => {
          const isSelected = selectedBrush.id === brush.id;
          return (
            <TouchableOpacity
              key={brush.id}
              style={[
                styles.brushButton,
                { backgroundColor: colors.background },
                isSelected && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
              ]}
              onPress={() => handleBrushSelect(brush)}
            >
              <Text style={styles.brushIcon}>{brush.icon}</Text>
              <Text style={[
                styles.brushName, 
                { color: isSelected ? colors.primary : colors.text }
              ]}>
                {brush.name}
              </Text>
              <Text style={[styles.brushSize, { color: colors.textSecondary }]}>
                {brush.size}px
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Color Selection */}
      <View style={styles.colorSection}>
        <View style={styles.colorHeader}>
          <Text style={[styles.colorTitle, { color: colors.text }]}>Colors</Text>
          <View style={[styles.selectedColorDisplay, { backgroundColor: selectedColor }]}>
            <Text style={[styles.colorHex, { color: selectedColor === '#FFFFFF' ? '#000' : '#FFF' }]}>
              {selectedColor.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.colorGrid}>
          {ESSENTIAL_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && [styles.selectedColorBorder, { borderColor: colors.primary }],
                color === '#FFFFFF' && { borderWidth: 1, borderColor: colors.border },
              ]}
              onPress={() => handleColorSelect(color)}
            >
              {selectedColor === color && (
                <View style={styles.selectedColorIndicator}>
                  <Text style={{ color: color === '#FFFFFF' ? '#000' : '#FFF', fontSize: 16 }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Settings Display */}
      <View style={[styles.settingsDisplay, { backgroundColor: colors.background }]}>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Brush</Text>
          <Text style={[styles.settingValue, { color: colors.text }]}>{selectedBrush.name}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Size</Text>
          <Text style={[styles.settingValue, { color: colors.text }]}>{selectedBrush.size}px</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Opacity</Text>
          <Text style={[styles.settingValue, { color: colors.text }]}>{Math.round(selectedBrush.opacity * 100)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 8,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  brushesContainer: {
    marginBottom: 16,
  },
  brushesContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  brushButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  brushIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  brushName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  brushSize: {
    fontSize: 10,
  },
  colorSection: {
    marginBottom: 16,
  },
  colorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedColorDisplay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  colorHex: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorBorder: {
    borderWidth: 3,
  },
  selectedColorIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderRadius: 12,
  },
  settingItem: {
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Compact Mode Styles
  activeToolDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  toolIcon: {
    fontSize: 20,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorPickerToggle: {
    padding: 8,
    borderRadius: 8,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  compactColorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    position: 'absolute',
    top: 50,
    right: 0,
    zIndex: 1000,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  compactColorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});

export default ToolPalette;