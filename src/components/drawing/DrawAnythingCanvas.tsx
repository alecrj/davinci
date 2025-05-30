// src/components/drawing/DrawAnythingCanvas.tsx - COMPLETE FILE REPLACEMENT
import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  ViewStyle,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { useDrawing } from '@/context/DrawingContext';
import { DrawingPath, Point } from '@/types/drawing';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { hapticFeedback } from '@/utils/platform/haptics';

// FIXED: Proper props interface with ref support
export interface DrawAnythingCanvasProps {
  onShapeDetected?: (shape: string) => void;
  style?: ViewStyle;
}

// FIXED: Add ref methods interface
export interface DrawAnythingCanvasRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
}

export const DrawAnythingCanvas = forwardRef<DrawAnythingCanvasRef, DrawAnythingCanvasProps>(
  ({ onShapeDetected, style }, ref) => {
    const theme = useTheme();
    const { drawingState, addPath, clearDrawing, undo, redo, canUndo, canRedo } = useDrawing();
    
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const pathIdRef = useRef(0);

    // FIXED: Expose methods to parent component
    useImperativeHandle(ref, () => ({
      clear: () => {
        clearDrawing();
        hapticFeedback('light');
      },
      undo: () => {
        if (canUndo) {
          undo();
          hapticFeedback('light');
        }
      },
      redo: () => {
        if (canRedo) {
          redo();
          hapticFeedback('light');
        }
      },
    }));

    const createPathString = useCallback((points: Point[]): string => {
      if (points.length === 0) return '';
      
      let path = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L${points[i].x},${points[i].y}`;
      }
      return path;
    }, []);

    const handleShapeDetection = useCallback((points: Point[]) => {
      if (points.length < 10) return; // Need minimum points for detection
      
      const detectionResult = detectShape(points);
      if (detectionResult.confidence > 0.6) {
        hapticFeedback('success');
        onShapeDetected?.(detectionResult.type);
      }
    }, [onShapeDetected]);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint: Point = { x: locationX, y: locationY };
        
        setCurrentPath([newPoint]);
        setIsDrawing(true);
        hapticFeedback('light');
      },

      onPanResponderMove: (evt) => {
        if (!isDrawing) return;
        
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint: Point = { x: locationX, y: locationY };
        
        setCurrentPath(prev => [...prev, newPoint]);
      },

      onPanResponderRelease: () => {
        if (!isDrawing || currentPath.length === 0) return;

        // Create drawing path
        const drawingPath: DrawingPath = {
          id: `path-${pathIdRef.current++}`,
          points: currentPath,
          color: theme.colors.primary,
          width: 4,
          timestamp: Date.now(),
        };

        // Add to drawing context
        addPath(drawingPath);

        // Detect shape
        handleShapeDetection(currentPath);

        // Reset current path
        setCurrentPath([]);
        setIsDrawing(false);
        hapticFeedback('light');
      },
    });

    const { width, height } = Dimensions.get('window');
    const canvasWidth = width - 32;
    const canvasHeight = height * 0.5;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
          style,
        ]}
        {...panResponder.panHandlers}
      >
        <Svg
          width={canvasWidth}
          height={canvasHeight}
          style={styles.svg}
        >
          {/* Grid lines */}
          <GridLines width={canvasWidth} height={canvasHeight} theme={theme} />
          
          {/* Completed paths */}
          {drawingState.currentSession?.strokes.map((stroke) => (
            <Path
              key={stroke.id}
              d={createPathString(stroke.path.points)}
              stroke={stroke.path.color}
              strokeWidth={stroke.path.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          
          {/* Current drawing path */}
          {currentPath.length > 0 && (
            <Path
              d={createPathString(currentPath)}
              stroke={theme.colors.primary}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    );
  }
);

// Grid component for visual aid
const GridLines: React.FC<{ width: number; height: number; theme: any }> = ({ width, height, theme }) => (
  <>
    {/* Horizontal grid lines */}
    {Array.from({ length: Math.floor(height / 40) }, (_, i) => (
      <Path
        key={`h-${i}`}
        d={`M0,${i * 40} L${width},${i * 40}`}
        stroke={theme.colors.border + '20'}
        strokeWidth={1}
      />
    ))}
    {/* Vertical grid lines */}
    {Array.from({ length: Math.floor(width / 40) }, (_, i) => (
      <Path
        key={`v-${i}`}
        d={`M${i * 40},0 L${i * 40},${height}`}
        stroke={theme.colors.border + '20'}
        strokeWidth={1}
      />
    ))}
  </>
);

// Add display name for debugging
DrawAnythingCanvas.displayName = 'DrawAnythingCanvas';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    margin: 16,
  },
  svg: {
    flex: 1,
  },
});