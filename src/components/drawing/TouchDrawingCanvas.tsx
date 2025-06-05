// src/components/drawing/TouchDrawingCanvas.tsx - FIXED STYLE PROP INTERFACE
import React, { useState, useCallback } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native'; // ✅ FIXED: Import StyleProp
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Point } from '@/types/drawing';

export interface TouchDrawingCanvasProps {
  style?: StyleProp<ViewStyle>; // ✅ FIXED: Changed from ViewStyle to StyleProp<ViewStyle>
  onDrawingComplete?: (path: Point[]) => void;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

export const TouchDrawingCanvas: React.FC<TouchDrawingCanvasProps> = ({
  style,
  onDrawingComplete,
  strokeWidth = 3,
  strokeColor,
  backgroundColor = 'transparent',
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [completedPaths, setCompletedPaths] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (!isDrawing) return;
    
    const { absoluteX, absoluteY } = event.nativeEvent;
    
    const point: Point = {
      x: absoluteX,
      y: absoluteY,
    };

    setCurrentPath(prev => [...prev, point]);
  }, [isDrawing]);

  const handleStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;
    
    switch (state) {
      case State.BEGAN:
        setIsDrawing(true);
        const startPoint: Point = { x: absoluteX, y: absoluteY };
        setCurrentPath([startPoint]);
        break;
        
      case State.END:
      case State.CANCELLED:
        setIsDrawing(false);
        
        if (currentPath.length > 1) {
          setCompletedPaths(prev => [...prev, currentPath]);
          onDrawingComplete?.(currentPath);
        }
        
        setCurrentPath([]);
        break;
    }
  }, [currentPath, onDrawingComplete]);

  const renderPath = (points: Point[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const prevPoint = points[i - 1];
      
      // Use quadratic curves for smoother lines
      const cpx = (prevPoint.x + point.x) / 2;
      const cpy = (prevPoint.y + point.y) / 2;
      
      if (i === 1) {
        path += ` Q ${prevPoint.x} ${prevPoint.y} ${cpx} ${cpy}`;
      } else {
        path += ` T ${cpx} ${cpy}`;
      }
    }
    
    return path;
  };

  const clearCanvas = () => {
    setCurrentPath([]);
    setCompletedPaths([]);
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      minPointers={1}
      maxPointers={1}
    >
      <View style={[{ flex: 1, backgroundColor }, style]}>
        <Svg style={{ flex: 1 }} width="100%" height="100%">
          {/* Render completed paths */}
          {completedPaths.map((path, index) => (
            <Path
              key={index}
              d={renderPath(path)}
              stroke={strokeColor || colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          ))}
          
          {/* Render current path */}
          {currentPath.length > 1 && (
            <Path
              d={renderPath(currentPath)}
              stroke={strokeColor || colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          )}
        </Svg>
      </View>
    </PanGestureHandler>
  );
};

export default TouchDrawingCanvas;