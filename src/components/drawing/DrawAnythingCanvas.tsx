// src/components/drawing/DrawAnythingCanvas.tsx - COORDINATE ALIGNMENT FIXED + CONTEXT INTEGRATION
import React, { useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path, Line } from 'react-native-svg';
import { useDrawing } from '@/context/DrawingContext';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { Point } from '@/types/drawing';

export interface DrawAnythingCanvasProps {
  style?: StyleProp<ViewStyle>;
  onShapeDetected?: (shape: string) => void;
  onDrawingComplete?: (shape: any, drawing: any) => void;
  showGuides?: boolean;
  enableShapeDetection?: boolean;
  width?: number;
  height?: number;
}

export interface DrawAnythingCanvasRef {
  clearCanvas: () => void;
  getCurrentPath: () => Point[];
}

interface CanvasLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DrawAnythingCanvas = forwardRef<DrawAnythingCanvasRef, DrawAnythingCanvasProps>(
  ({ 
    style, 
    onShapeDetected, 
    onDrawingComplete,
    showGuides = false, 
    enableShapeDetection = true,
    width,
    height 
  }, ref) => {
    const { 
      state: drawingState, 
      startDrawing, 
      addPoint, 
      endDrawing,
      clearCanvas 
    } = useDrawing();
    
    const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
    const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>({ x: 0, y: 0, width: 0, height: 0 });

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        clearCanvas();
        setCurrentStroke([]);
      },
      getCurrentPath: () => currentStroke,
    }));

    // ✅ FIXED: Convert screen coordinates to canvas-relative coordinates
    const screenToCanvasCoordinates = useCallback((absoluteX: number, absoluteY: number): Point => {
      return {
        x: absoluteX - canvasLayout.x,
        y: absoluteY - canvasLayout.y,
      };
    }, [canvasLayout]);

    // ✅ FIXED: Handle canvas layout changes for coordinate system
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
      const { absoluteX, absoluteY } = event.nativeEvent;
      
      // ✅ FIXED: Convert to canvas coordinates
      const canvasPoint = screenToCanvasCoordinates(absoluteX, absoluteY);

      // ✅ FIXED: Bounds checking
      if (canvasPoint.x >= 0 && canvasPoint.x <= canvasLayout.width &&
          canvasPoint.y >= 0 && canvasPoint.y <= canvasLayout.height) {
        
        if (drawingState.isDrawing) {
          addPoint(canvasPoint);
          setCurrentStroke(prev => [...prev, canvasPoint]);
        }
      }
    }, [drawingState.isDrawing, addPoint, screenToCanvasCoordinates, canvasLayout]);

    const handleStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
      const { state, absoluteX, absoluteY } = event.nativeEvent;
      
      // ✅ FIXED: Convert to canvas coordinates
      const canvasPoint = screenToCanvasCoordinates(absoluteX, absoluteY);

      switch (state) {
        case State.BEGAN:
          startDrawing(canvasPoint);
          setCurrentStroke([canvasPoint]);
          break;
          
        case State.END:
        case State.CANCELLED:
          endDrawing();
          
          if (enableShapeDetection && currentStroke.length > 3) {
            const detectionResult = detectShape(currentStroke);
            if (detectionResult && onShapeDetected) {
              onShapeDetected(detectionResult.type);
            }
            
            if (onDrawingComplete) {
              onDrawingComplete(detectionResult?.type || 'unknown', {
                path: currentStroke,
                strokeCount: currentStroke.length,
                boundingBox: getBoundingBox(currentStroke),
              });
            }
          }
          
          setCurrentStroke([]);
          break;
      }
    }, [startDrawing, endDrawing, enableShapeDetection, onShapeDetected, onDrawingComplete, currentStroke, screenToCanvasCoordinates]);

    // ✅ OPTIMIZED: Efficient path rendering with smoothing
    const renderPath = useCallback((points: Point[]): string => {
      if (points.length < 2) return '';
      
      let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
      
      if (points.length === 2) {
        // Simple line for 2 points
        path += ` L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
      } else {
        // Smooth curves for multiple points
        for (let i = 1; i < points.length; i++) {
          const point = points[i];
          const prevPoint = points[i - 1];
          
          if (i === 1) {
            path += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
          } else {
            // Use quadratic curves for smoothing
            const nextPoint = points[i + 1];
            if (nextPoint) {
              const cpx = (point.x + nextPoint.x) / 2;
              const cpy = (point.y + nextPoint.y) / 2;
              path += ` Q ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${cpx.toFixed(2)} ${cpy.toFixed(2)}`;
            } else {
              path += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
            }
          }
        }
      }
      
      return path;
    }, []);

    const renderCurrentStroke = useCallback((): string => {
      return renderPath(currentStroke);
    }, [currentStroke, renderPath]);

    // ✅ OPTIMIZED: Efficient stroke rendering
    const renderCompletedStrokes = useCallback(() => {
      return drawingState.strokes.map((stroke, index) => (
        <Path
          key={stroke.id || index}
          d={renderPath(stroke.path.points)}
          stroke={stroke.path.color}
          strokeWidth={stroke.path.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      ));
    }, [drawingState.strokes, renderPath]);

    // ✅ HELPER: Bounding box calculation for shape analysis
    const getBoundingBox = useCallback((points: Point[]) => {
      if (points.length === 0) return null;
      
      let minX = points[0].x, maxX = points[0].x;
      let minY = points[0].y, maxY = points[0].y;
      
      for (const point of points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      
      return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
    }, []);

    return (
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        minPointers={1}
        maxPointers={1}
      >
        <View 
          style={[{ flex: 1 }, style]} 
          onLayout={handleLayout}
        >
          {/* ✅ FIXED: SVG with proper dimensions and viewBox */}
          <Svg 
            style={{ flex: 1 }} 
            width={canvasLayout.width || width || "100%"} 
            height={canvasLayout.height || height || "100%"}
            viewBox={`0 0 ${canvasLayout.width || 300} ${canvasLayout.height || 400}`}
          >
            {/* Render completed strokes */}
            {renderCompletedStrokes()}
            
            {/* Render current stroke */}
            {currentStroke.length > 1 && (
              <Path
                d={renderCurrentStroke()}
                stroke={drawingState.color}
                strokeWidth={drawingState.brushSize}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={drawingState.opacity}
              />
            )}
            
            {/* ✅ IMPROVED: Guide lines with proper canvas dimensions */}
            {showGuides && canvasLayout.width > 0 && canvasLayout.height > 0 && (
              <>
                {/* Center vertical line */}
                <Line
                  x1={canvasLayout.width / 2}
                  y1={0}
                  x2={canvasLayout.width / 2}
                  y2={canvasLayout.height}
                  stroke="rgba(0, 122, 255, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                />
                {/* Center horizontal line */}
                <Line
                  x1={0}
                  y1={canvasLayout.height / 2}
                  x2={canvasLayout.width}
                  y2={canvasLayout.height / 2}
                  stroke="rgba(0, 122, 255, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                />
                {/* Corner guides */}
                <Line
                  x1={canvasLayout.width * 0.25}
                  y1={0}
                  x2={canvasLayout.width * 0.25}
                  y2={canvasLayout.height}
                  stroke="rgba(0, 122, 255, 0.2)"
                  strokeWidth={0.5}
                  strokeDasharray="3,3"
                />
                <Line
                  x1={canvasLayout.width * 0.75}
                  y1={0}
                  x2={canvasLayout.width * 0.75}
                  y2={canvasLayout.height}
                  stroke="rgba(0, 122, 255, 0.2)"
                  strokeWidth={0.5}
                  strokeDasharray="3,3"
                />
              </>
            )}
          </Svg>
        </View>
      </PanGestureHandler>
    );
  }
);

DrawAnythingCanvas.displayName = 'DrawAnythingCanvas';

export default DrawAnythingCanvas;