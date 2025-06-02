// src/components/drawing/DrawAnythingCanvas.tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, ViewStyle, Dimensions, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ShapeType, Point, DrawingPath } from '@/types/drawing';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { hapticFeedback } from '@/utils/platform/haptics';

export interface DrawAnythingCanvasProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  
  // ✅ ADD MISSING PROPS
  onDrawingComplete?: (shape: ShapeType, drawing: any) => void;
  onShapeDetected?: (shape: ShapeType) => void;
  onDrawingStart?: () => void;
  onDrawingEnd?: () => void;
}

export interface DrawAnythingCanvasRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  getDrawing: () => DrawingPath[];
  setDrawing: (paths: DrawingPath[]) => void;
}

export const DrawAnythingCanvas = forwardRef<DrawAnythingCanvasRef, DrawAnythingCanvasProps>(({
  width = Dimensions.get('window').width - 40,
  height = 400,
  style,
  strokeColor = '#007AFF',
  strokeWidth = 3,
  backgroundColor = 'transparent',
  onDrawingComplete,
  onShapeDetected,
  onDrawingStart,
  onDrawingEnd,
}, ref) => {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const pathId = useRef(0);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPaths([]);
      setCurrentPath([]);
    },
    undo: () => {
      setPaths(prev => prev.slice(0, -1));
    },
    redo: () => {
      // Implementation would require redo stack
    },
    getDrawing: () => paths,
    setDrawing: (newPaths: DrawingPath[]) => {
      setPaths(newPaths);
    },
  }));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const point: Point = { x: locationX, y: locationY };
      
      setCurrentPath([point]);
      setIsDrawing(true);
      onDrawingStart?.();
      
      // Light haptic feedback on draw start
      hapticFeedback.light();
    },

    onPanResponderMove: (evt) => {
      if (!isDrawing) return;
      
      const { locationX, locationY } = evt.nativeEvent;
      const point: Point = { x: locationX, y: locationY };
      
      setCurrentPath(prev => [...prev, point]);
    },

    onPanResponderRelease: () => {
      if (!isDrawing || currentPath.length === 0) return;

      // Create drawing path
      const drawingPath: DrawingPath = {
        id: `path-${pathId.current++}`,
        points: currentPath,
        color: strokeColor,
        width: strokeWidth,
        timestamp: Date.now(),
      };

      setPaths(prev => [...prev, drawingPath]);
      
      // Detect shape from current path points
      const detectionResult = detectShape([drawingPath]); // ✅ FIX: Pass DrawingPath array
      if (detectionResult && detectionResult.confidence > 0.6) { // ✅ FIX: Check for null
        // Success haptic feedback
        hapticFeedback.success();
        onShapeDetected?.(detectionResult.type);
        onDrawingComplete?.(detectionResult.type, { paths: [...paths, drawingPath], detectedShape: detectionResult });
      }

      setCurrentPath([]);
      setIsDrawing(false);
      onDrawingEnd?.();
    },
  });

  const createPathData = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    return pathData;
  };

  return (
    <View style={[{ width, height, backgroundColor }, style]} {...panResponder.panHandlers}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        {/* Render completed paths */}
        {paths.map((path) => (
          <Path
            key={path.id}
            d={createPathData(path.points)}
            stroke={path.color}
            strokeWidth={path.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        
        {/* Render current drawing path */}
        {currentPath.length > 1 && (
          <Path
            d={createPathData(currentPath)}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </View>
  );
});