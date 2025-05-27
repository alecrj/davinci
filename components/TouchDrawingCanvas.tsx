import React, { useRef, useState } from 'react';
import {
  View,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native';
import { PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

interface TouchDrawingCanvasProps {
  width: number;
  height: number;
  onDrawingComplete: (path: Array<{x: number, y: number}>) => void;
}

export const TouchDrawingCanvas: React.FC<TouchDrawingCanvasProps> = ({
  width,
  height,
  onDrawingComplete,
}) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const pathPoints = useRef<Array<{x: number, y: number}>>([]);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { x, y } = event.nativeEvent;
    
    // Ensure coordinates are within canvas bounds
    const clampedX = Math.max(0, Math.min(x, width));
    const clampedY = Math.max(0, Math.min(y, height));
    
    pathPoints.current.push({ x: clampedX, y: clampedY });
    
    if (!isDrawing) {
      setIsDrawing(true);
      setCurrentPath(`M${clampedX},${clampedY}`);
    } else {
      setCurrentPath(prev => `${prev} L${clampedX},${clampedY}`);
    }
  };

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDrawing(true);
      pathPoints.current = [];
    } else if (event.nativeEvent.state === State.END) {
      setIsDrawing(false);
      
      // Add current path to paths array
      if (currentPath) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath('');
        
        // Call completion callback with path points
        if (pathPoints.current.length > 0) {
          onDrawingComplete([...pathPoints.current]);
        }
      }
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathPoints.current = [];
  };

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        shouldCancelWhenOutside={false}
        minPointers={1}
        maxPointers={1}
      >
        <View style={{ flex: 1 }}>
          <Svg
            width={width}
            height={height}
            style={{ position: 'absolute' }}
          >
            {/* Render completed paths */}
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path}
                stroke="#4A90E2"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            
            {/* Render current path being drawn */}
            {currentPath && (
              <Path
                d={currentPath}
                stroke="#4A90E2"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.8}
              />
            )}
          </Svg>
          
          {/* Instructions overlay when empty */}
          {paths.length === 0 && !currentPath && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#D1D5DB',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: '#9CA3AF',
                    textAlign: 'center',
                  }}
                >
                  Draw your{'\n'}circle here
                </Text>
              </View>
            </View>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
};