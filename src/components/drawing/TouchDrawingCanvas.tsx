// src/components/drawing/TouchDrawingCanvas.tsx - COORDINATE ALIGNMENT FIXED
import React, { useState, useCallback, useRef } from 'react';
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Point } from '@/types/drawing';

export interface TouchDrawingCanvasProps {
  style?: StyleProp<ViewStyle>;
  onDrawingComplete?: (path: Point[]) => void;
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
}

interface CanvasLayout {
  x: number;
  y: number;
  width: number;
  height: number;
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
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>({ x: 0, y: 0, width: 0, height: 0 });

  // ✅ FIXED: Convert screen coordinates to canvas-relative coordinates
  const screenToCanvasCoordinates = useCallback((absoluteX: number, absoluteY: number): Point => {
    return {
      x: absoluteX - canvasLayout.x,
      y: absoluteY - canvasLayout.y,
    };
  }, [canvasLayout]);

  // ✅ FIXED: Handle canvas layout changes
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setCanvasLayout({
        x: pageX,
        y: pageY,
        width,
        height,
      });
    });
  }, []);

  const handleGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (!isDrawing) return;
    
    const { absoluteX, absoluteY } = event.nativeEvent;
    
    // ✅ FIXED: Convert to canvas coordinates
    const canvasPoint = screenToCanvasCoordinates(absoluteX, absoluteY);

    // ✅ FIXED: Ensure coordinates are within canvas bounds
    if (canvasPoint.x >= 0 && canvasPoint.x <= canvasLayout.width &&
        canvasPoint.y >= 0 && canvasPoint.y <= canvasLayout.height) {
      setCurrentPath(prev => [...prev, canvasPoint]);
    }
  }, [isDrawing, screenToCanvasCoordinates, canvasLayout]);

  const handleStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;
    
    switch (state) {
      case State.BEGAN:
        setIsDrawing(true);
        // ✅ FIXED: Convert to canvas coordinates for start point
        const startPoint = screenToCanvasCoordinates(absoluteX, absoluteY);
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
  }, [currentPath, onDrawingComplete, screenToCanvasCoordinates]);

  // ✅ OPTIMIZED: Smooth path rendering with quadratic curves
  const renderPath = useCallback((points: Point[]): string => {
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
  }, []);

  const clearCanvas = useCallback(() => {
    setCurrentPath([]);
    setCompletedPaths([]);
  }, []);

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      minPointers={1}
      maxPointers={1}
    >
      <View 
        style={[{ flex: 1, backgroundColor }, style]} 
        onLayout={handleLayout}
      >
        {/* ✅ FIXED: SVG with explicit dimensions matching canvas */}
        <Svg 
          style={{ flex: 1 }} 
          width={canvasLayout.width || "100%"} 
          height={canvasLayout.height || "100%"}
          viewBox={`0 0 ${canvasLayout.width || 300} ${canvasLayout.height || 400}`}
        >
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