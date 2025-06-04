import React, { useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { View, ViewStyle } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { useDrawing } from '@/context/DrawingContext';
import { detectShape } from '@/utils/drawing/shapeDetection';
import { Point } from '@/types/drawing';

export interface DrawAnythingCanvasProps {
  style?: ViewStyle;
  onShapeDetected?: (shape: string) => void;
  onDrawingComplete?: (shape: any, drawing: any) => void; // ✅ FIXED: Added missing prop
  showGuides?: boolean;
  enableShapeDetection?: boolean;
  width?: number;  // ✅ FIXED: Added missing props
  height?: number; // ✅ FIXED: Added missing props
}

export interface DrawAnythingCanvasRef {
  clearCanvas: () => void;
  getCurrentPath: () => Point[];
}

export const DrawAnythingCanvas = forwardRef<DrawAnythingCanvasRef, DrawAnythingCanvasProps>(
  ({ 
    style, 
    onShapeDetected, 
    onDrawingComplete, // ✅ FIXED: Added to destructure
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

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        clearCanvas();
        setCurrentStroke([]);
      },
      getCurrentPath: () => currentStroke,
    }));

    const handleGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
      const { translationX, translationY, absoluteX, absoluteY } = event.nativeEvent;
      
      // Convert screen coordinates to canvas coordinates
      const point: Point = {
        x: absoluteX,
        y: absoluteY,
      };

      if (drawingState.isDrawing) {
        addPoint(point);
        setCurrentStroke(prev => [...prev, point]);
      }
    }, [drawingState.isDrawing, addPoint]);

    const handleStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
      const { state, absoluteX, absoluteY } = event.nativeEvent;
      
      const point: Point = {
        x: absoluteX,
        y: absoluteY,
      };

      switch (state) {
        case State.BEGAN:
          startDrawing(point);
          setCurrentStroke([point]);
          break;
          
        case State.END:
        case State.CANCELLED:
          endDrawing();
          
          // ✅ FIXED: Shape detection with proper Point array
          if (enableShapeDetection && currentStroke.length > 3) {
            const detectionResult = detectShape(currentStroke);
            if (detectionResult && onShapeDetected) {
              onShapeDetected(detectionResult.type);
            }
            
            // ✅ FIXED: Call onDrawingComplete if provided
            if (onDrawingComplete) {
              onDrawingComplete(detectionResult?.type || 'unknown', {
                path: currentStroke,
                strokeCount: currentStroke.length
              });
            }
          }
          
          setCurrentStroke([]);
          break;
      }
    }, [startDrawing, endDrawing, enableShapeDetection, onShapeDetected, onDrawingComplete, currentStroke]);

    const renderPath = (points: Point[]): string => {
      if (points.length < 2) return '';
      
      let path = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
      
      return path;
    };

    const renderCurrentStroke = (): string => {
      return renderPath(currentStroke);
    };

    const renderCompletedStrokes = () => {
      return drawingState.strokes.map((stroke, index) => (
        <Path
          key={stroke.id || index}
          d={renderPath(stroke.path.points)}
          stroke={stroke.path.color}
          strokeWidth={stroke.path.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ));
    };

    return (
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
        minPointers={1}
        maxPointers={1}
      >
        <View style={[{ flex: 1 }, style]}>
          <Svg 
            style={{ flex: 1 }} 
            width={width || "100%"} 
            height={height || "100%"}
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
            
            {/* Guide lines if enabled */}
            {showGuides && (
              <>
                {/* Center guidelines */}
                <Path
                  d="M 50% 0 L 50% 100%"
                  stroke="rgba(0, 122, 255, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                />
                <Path
                  d="M 0 50% L 100% 50%"
                  stroke="rgba(0, 122, 255, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="5,5"
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