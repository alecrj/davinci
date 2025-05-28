import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { useDrawing } from '@/context/DrawingContext';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { Point, DrawingPath, ShapeType } from '@/types/drawing';

interface DrawAnythingCanvasProps {
  width: number;
  height: number;
  onDrawingComplete: (shape: ShapeType, drawing: any) => void;
}

export const DrawAnythingCanvas: React.FC<DrawAnythingCanvasProps> = ({
  width,
  height,
  onDrawingComplete,
}) => {
  const { theme } = useTheme();
  const { drawingState, addPath, clearDrawing } = useDrawing();
  
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const pathIdRef = useRef(0);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      
      onPanResponderRelease: () => {
        if (currentPath.length > 5) {
          const newPath: DrawingPath = {
            id: `path-${pathIdRef.current++}`,
            points: currentPath,
            color: theme.accent,
            width: 4,
            timestamp: Date.now(),
          };
          
          const updatedPaths = [...paths, newPath];
          setPaths(updatedPaths);
          addPath(newPath);
          
          // Detect shape after a brief delay
          setTimeout(() => {
            const detectedShape = detectShape(updatedPaths);
            if (detectedShape) {
              onDrawingComplete(detectedShape.type, {
                paths: updatedPaths,
                shape: detectedShape,
              });
            }
          }, 500);
        }
        
        setCurrentPath([]);
      },
    })
  ).current;
  
  const createPathData = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Use quadratic bezier curves for smooth lines
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      path += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    
    // Last point
    if (points.length > 1) {
      path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    }
    
    return path;
  };
  
  return (
    <View 
      style={[
        styles.container,
        { 
          width,
          height,
          backgroundColor: theme.drawingCanvas,
          borderColor: theme.border,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <G>
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
          
          {/* Render current path */}
          {currentPath.length > 0 && (
            <Path
              d={createPathData(currentPath)}
              stroke={theme.accent}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          )}
        </G>
      </Svg>
      
      {/* Grid overlay for better drawing guidance */}
      <View style={styles.gridOverlay} pointerEvents="none">
        <View style={[styles.gridLine, styles.horizontal, { borderColor: theme.border + '20' }]} />
        <View style={[styles.gridLine, styles.vertical, { borderColor: theme.border + '20' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  horizontal: {
    top: '50%',
    left: 0,
    right: 0,
  },
  vertical: {
    left: '50%',
    top: 0,
    bottom: 0,
  },
});