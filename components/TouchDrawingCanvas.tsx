// components/TouchDrawingCanvas.tsx - COMPLETE FILE REPLACEMENT
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
// FIXED: Import from correct packages
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface TouchDrawingCanvasProps {
  onPathComplete?: (path: string) => void;
}

export default function TouchDrawingCanvas({ onPathComplete }: TouchDrawingCanvasProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const panRef = useRef(null);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { x, y } = event.nativeEvent;
    const newPath = currentPath === '' ? `M${x},${y}` : `${currentPath} L${x},${y}`;
    setCurrentPath(newPath);
  };

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      const { x, y } = event.nativeEvent;
      setCurrentPath(`M${x},${y}`);
    } else if (event.nativeEvent.state === State.END) {
      if (currentPath !== '') {
        setPaths(prev => [...prev, currentPath]);
        onPathComplete?.(currentPath);
        setCurrentPath('');
      }
    }
  };

  const { width, height } = Dimensions.get('window');
  const canvasHeight = height * 0.6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Draw Something!</Text>
        <Text style={styles.subtitle}>Use your finger to draw</Text>
      </View>
      
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.canvas, { width, height: canvasHeight }]}>
          <Svg width={width} height={canvasHeight} style={StyleSheet.absoluteFillObject}>
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path}
                stroke="#007AFF"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath !== '' && (
              <Path
                d={currentPath}
                stroke="#007AFF"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        </Animated.View>
      </PanGestureHandler>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Paths drawn: {paths.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  canvas: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});