import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { DrawAnythingCanvas, MagicTransformation } from '@/components/drawing';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { useDrawing } from '@/context/DrawingContext';
import { haptics } from '@/utils/haptics';
import { ShapeType, sanitizeShapeType } from '@/types/drawing'; // ✅ FIXED: Import helper

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { state: drawingState, clearCanvas } = useDrawing();
  
  const [showTransformation, setShowTransformation] = useState(false);
  const [detectedShape, setDetectedShape] = useState<ShapeType>('unknown');
  const [userDrawing, setUserDrawing] = useState<any>(null);

  const handleShapeDetected = (shape: string) => {
    // ✅ FIXED: Safely convert string to ShapeType
    const validShape = sanitizeShapeType(shape);
    setDetectedShape(validShape);
    setUserDrawing(drawingState.strokes);
    
    // Trigger haptic feedback
    haptics.shapeDetected();
    
    // Show transformation after a brief delay
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
            haptics.actionSuccess();
          },
        },
      ]
    );
  };

  if (showTransformation) {
    return (
      <MagicTransformation
        shape={detectedShape} // ✅ FIXED: Pass shape prop correctly
        userDrawing={userDrawing}
        onComplete={handleTransformationComplete}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Free Practice</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Draw anything and watch it transform!
        </Text>
      </View>

      <View style={styles.canvasContainer}>
        <DrawAnythingCanvas
          style={[styles.canvas, { backgroundColor: colors.card }]} // ✅ FIXED: Proper style object
          onShapeDetected={handleShapeDetected}
          showGuides={true}
          enableShapeDetection={true}
        />
      </View>

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
              {drawingState.lastDetectedShape?.type || 'None'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Last Shape
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Clear"
            onPress={handleClearCanvas}
            variant="outline"
            size="medium"
            style={styles.clearButton}
          />
          
          <Button
            title="Undo"
            onPress={() => {
              // Implement undo functionality
              haptics.buttonPress();
            }}
            variant="secondary"
            size="medium"
            disabled={!drawingState.canUndo}
            style={styles.undoButton}
          />
        </View>
      </View>

      {/* Drawing Tools Panel */}
      <View style={[styles.toolsPanel, { backgroundColor: colors.card }]}>
        <Text style={[styles.toolsTitle, { color: colors.text }]}>Drawing Tools</Text>
        
        <View style={styles.toolsGrid}>
          <View style={[styles.toolItem, { backgroundColor: colors.background }]}>
            <Text style={styles.toolEmoji}>✏️</Text>
            <Text style={[styles.toolName, { color: colors.text }]}>Pencil</Text>
          </View>
          
          <View style={[styles.toolItem, { backgroundColor: colors.background }]}>
            <Text style={styles.toolEmoji}>🖌️</Text>
            <Text style={[styles.toolName, { color: colors.text }]}>Brush</Text>
          </View>
          
          <View style={[styles.toolItem, { backgroundColor: colors.background }]}>
            <Text style={styles.toolEmoji}>🎨</Text>
            <Text style={[styles.toolName, { color: colors.text }]}>Paint</Text>
          </View>
          
          <View style={[styles.toolItem, { backgroundColor: colors.background }]}>
            <Text style={styles.toolEmoji}>🧽</Text>
            <Text style={[styles.toolName, { color: colors.text }]}>Eraser</Text>
          </View>
        </View>
      </View>

      {/* Progress Encouragement */}
      {drawingState.strokes.length > 0 && (
        <View style={[styles.encouragement, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.encouragementText, { color: colors.primary }]}>
            ✨ Great work! Keep drawing to discover new shapes!
          </Text>
        </View>
      )}
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
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  canvas: {
    flex: 1,
    borderRadius: 16,
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  clearButton: {
    flex: 1,
  },
  undoButton: {
    flex: 1,
  },
  toolsPanel: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  toolsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  toolEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  toolName: {
    fontSize: 10,
    textAlign: 'center',
  },
  encouragement: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});