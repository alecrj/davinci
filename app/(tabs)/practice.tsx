// app/(tabs)/practice.tsx - INTEGRATED PROFESSIONAL TOOLS + FIXED CANVAS
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, StyleProp, ViewStyle, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { DrawAnythingCanvas, MagicTransformation } from '@/components/drawing';
import { ToolPalette } from '@/components/drawing/ToolPalette';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useDrawing } from '@/context/DrawingContext';
import { uiHaptics } from '@/utils/haptics';
import { ShapeType, sanitizeShapeType } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { state: drawingState, clearCanvas, undo, redo } = useDrawing();
  
  const [showTransformation, setShowTransformation] = useState(false);
  const [detectedShape, setDetectedShape] = useState<ShapeType>('unknown');
  const [userDrawing, setUserDrawing] = useState<any>(null);
  const [showToolPalette, setShowToolPalette] = useState(true);
  
  const canvasRef = useRef<any>(null);

  const handleShapeDetected = (shape: string) => {
    const validShape = sanitizeShapeType(shape);
    setDetectedShape(validShape);
    setUserDrawing(drawingState.strokes);
    
    // ✅ FIXED: Use uiHaptics with correct method
    uiHaptics.shapeDetected();
    
    setTimeout(() => {
      setShowTransformation(true);
    }, 500);
  };

  const handleTransformationComplete = () => {
    setShowTransformation(false);
    setDetectedShape('unknown');
    setUserDrawing(null);
  };

  const handleClearCanvas = () => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear your drawing?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCanvas();
            canvasRef.current?.clearCanvas();
            uiHaptics.actionSuccess();
          },
        },
      ]
    );
  };

  const handleUndo = () => {
    undo();
    uiHaptics.buttonPress();
  };

  const handleRedo = () => {
    redo();
    uiHaptics.buttonPress();
  };

  const toggleToolPalette = () => {
    setShowToolPalette(!showToolPalette);
    uiHaptics.buttonPress();
  };

  if (showTransformation) {
    return (
      <MagicTransformation
        shape={detectedShape}
        userDrawing={userDrawing}
        onComplete={handleTransformationComplete}
      />
    );
  }

  // ✅ FIXED: Proper style prop typing
  const canvasStyle: StyleProp<ViewStyle> = [
    styles.canvas, 
    { backgroundColor: colors.card }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Professional Studio</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create with professional-grade tools and watch your art transform!
          </Text>
        </View>

        {/* Drawing Canvas */}
        <View style={styles.canvasContainer}>
          <DrawAnythingCanvas
            ref={canvasRef}
            style={canvasStyle}
            onShapeDetected={handleShapeDetected}
            showGuides={true}
            enableShapeDetection={true}
          />
          
          {/* Canvas Overlay Controls */}
          <View style={styles.canvasOverlay}>
            <TouchableOpacity
              style={[styles.overlayButton, { backgroundColor: colors.card + 'CC' }]}
              onPress={toggleToolPalette}
            >
              <Text style={styles.overlayButtonText}>🎨</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Tool Palette */}
        {showToolPalette && (
          <ToolPalette
            style={styles.toolPalette}
            onToolChange={(toolId) => {
              console.log('Tool changed to:', toolId);
            }}
            onColorChange={(color) => {
              console.log('Color changed to:', color);
            }}
          />
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.stats}>
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {drawingState.strokes.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Strokes
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {drawingState.currentTool.name}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active Tool
              </Text>
            </View>

            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {drawingState.lastDetectedShape?.type || 'None'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Last Shape
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Undo"
              onPress={handleUndo}
              variant="secondary"
              size="medium"
              disabled={!drawingState.canUndo}
              style={styles.actionButton}
            />

            <Button
              title="Redo"
              onPress={handleRedo}
              variant="secondary"
              size="medium"
              disabled={!drawingState.canRedo}
              style={styles.actionButton}
            />
            
            <Button
              title="Clear"
              onPress={handleClearCanvas}
              variant="outline"
              size="medium"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Progress Encouragement */}
        {drawingState.strokes.length > 0 && (
          <View style={[styles.encouragement, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.encouragementText, { color: colors.primary }]}>
              ✨ Excellent progress! {drawingState.strokes.length} strokes and counting!
            </Text>
            {drawingState.lastDetectedShape && (
              <Text style={[styles.shapeDetectionText, { color: colors.primary }]}>
                🎯 Great {drawingState.lastDetectedShape.type}! Keep practicing shapes!
              </Text>
            )}
          </View>
        )}

        {/* Professional Features Preview */}
        <View style={[styles.featuresPreview, { backgroundColor: colors.card }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Professional Features</Text>
          
          <View style={styles.featuresGrid}>
            <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
              <Text style={styles.featureEmoji}>🖌️</Text>
              <Text style={[styles.featureName, { color: colors.text }]}>Custom Brushes</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Create unique tools</Text>
            </View>
            
            <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
              <Text style={styles.featureEmoji}>📐</Text>
              <Text style={[styles.featureName, { color: colors.text }]}>Precision Tools</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Perfect geometry</Text>
            </View>
            
            <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
              <Text style={styles.featureEmoji}>🎨</Text>
              <Text style={[styles.featureName, { color: colors.text }]}>Color Mixer</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Unlimited palettes</Text>
            </View>
            
            <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
              <Text style={styles.featureEmoji}>💾</Text>
              <Text style={[styles.featureName, { color: colors.text }]}>Auto-Save</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Never lose work</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  canvasContainer: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  canvas: {
    flex: 1,
    borderRadius: 16,
  },
  canvasOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayButtonText: {
    fontSize: 20,
  },
  toolPalette: {
    marginBottom: 20,
  },
  controls: {
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 90,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  encouragement: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  encouragementText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  shapeDetectionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  featuresPreview: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: '48%',
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 10,
    textAlign: 'center',
  },
});