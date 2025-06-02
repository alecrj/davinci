// components/TouchDrawingCanvas.tsx
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'; // ✅ FIXED IMPORTS
import Svg, { Path } from 'react-native-svg';
import { Point } from '@/types/drawing';

interface TouchDrawingCanvasProps {
  style?: ViewStyle;
  strokeColor?: string;
  strokeWidth?: number;
  onDrawingComplete?: (path: Point[]) => void;
}

// ✅ PROPER DEFAULT EXPORT
const TouchDrawingCanvas: React.FC<TouchDrawingCanvasProps> = ({
  style,
  strokeColor = '#007AFF',
  strokeWidth = 3,
  onDrawingComplete,
}) => {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { x, y } = event.nativeEvent;
    const point: Point = { x, y };

    if (isDrawing) {
      setCurrentPath(prev => [...prev, point]);
    }
  };

  const handleStateChange = (event: any) => {
    const { state } = event.nativeEvent;

    if (state === State.BEGAN) {
      const { x, y } = event.nativeEvent;
      const point: Point = { x, y };
      setCurrentPath([point]);
      setIsDrawing(true);
    } else if (state === State.END || state === State.CANCELLED) {
      if (currentPath.length > 0) {
        setPaths(prev => [...prev, currentPath]);
        onDrawingComplete?.(currentPath);
      }
      setCurrentPath([]);
      setIsDrawing(false);
    }
  };

  const createPathData = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    return pathData;
  };

  const { width, height } = Dimensions.get('window');

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
    >
      <View style={[styles.container, { width: width - 40, height: 400 }, style]}>
        <Svg width="100%" height="100%">
          {/* Render completed paths */}
          {paths.map((path, index) => (
            <Path
              key={index}
              d={createPathData(path)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
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
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
});

export default TouchDrawingCanvas; // ✅ PROPER DEFAULT EXPORT

// ✅ ALSO PROVIDE NAMED EXPORT FOR COMPATIBILITY
export { TouchDrawingCanvas };