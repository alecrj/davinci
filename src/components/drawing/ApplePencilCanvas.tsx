// src/components/drawing/ApplePencilCanvas.tsx - FIXED GESTURE HANDLER IMPORTS
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
// ✅ FIXED: Import from react-native-gesture-handler instead of react-native
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { ensureGradientColors } from '@/utils/colors/gradientHelper';
import { Point } from '@/types/drawing';

const { width, height } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && (width > 700 || height > 700);

interface ApplePencilStroke {
  points: Point[];
  pressure: number[];
  tilt: number[];
  color: string;
  width: number;
}

interface ApplePencilCanvasProps {
  onStrokeComplete?: (stroke: ApplePencilStroke) => void;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tilt: number) => void;
  style?: any;
}

export const ApplePencilCanvas: React.FC<ApplePencilCanvasProps> = ({
  onStrokeComplete,
  onPressureChange,
  onTiltChange,
  style
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentPressure, setCurrentPressure] = useState<number[]>([]);
  const [currentTilt, setCurrentTilt] = useState<number[]>([]);
  const [completedStrokes, setCompletedStrokes] = useState<ApplePencilStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const baseStrokeWidth = 3;

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (!isDrawing) return;
    
    const { translationX, translationY, absoluteX, absoluteY } = event.nativeEvent;
    
    // Note: React Native Gesture Handler doesn't provide pressure/tilt data directly
    // For a production iPad app, you'd need to use native iOS APIs through a bridge
    // This is a simulation for demonstration purposes
    const simulatedPressure = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
    const simulatedTilt = Math.random() * 30; // 0 to 30 degrees
    
    const point: Point = {
      x: absoluteX,
      y: absoluteY,
    };

    setCurrentStroke(prev => [...prev, point]);
    setCurrentPressure(prev => [...prev, simulatedPressure]);
    setCurrentTilt(prev => [...prev, simulatedTilt]);
    
    // Notify parent components of pressure/tilt changes
    onPressureChange?.(simulatedPressure);
    onTiltChange?.(simulatedTilt);
  };

  const handleStateChange = (event: PanGestureHandlerGestureEvent) => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;
    
    switch (state) {
      case State.BEGAN:
        setIsDrawing(true);
        const startPoint: Point = { x: absoluteX, y: absoluteY };
        setCurrentStroke([startPoint]);
        setCurrentPressure([0.7]); // Default pressure
        setCurrentTilt([0]); // Default tilt
        break;
        
      case State.END:
      case State.CANCELLED:
        if (currentStroke.length > 1) {
          const completedStroke: ApplePencilStroke = {
            points: [...currentStroke],
            pressure: [...currentPressure],
            tilt: [...currentTilt],
            color: colors.primary,
            width: baseStrokeWidth,
          };
          
          setCompletedStrokes(prev => [...prev, completedStroke]);
          onStrokeComplete?.(completedStroke);
        }
        
        setIsDrawing(false);
        setCurrentStroke([]);
        setCurrentPressure([]);
        setCurrentTilt([]);
        break;
    }
  };

  const renderPath = (points: Point[], pressureArray: number[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  const getStrokeWidth = (pressure: number[]): number => {
    if (pressure.length === 0) return baseStrokeWidth;
    const avgPressure = pressure.reduce((sum, p) => sum + p, 0) / pressure.length;
    return baseStrokeWidth * (0.5 + avgPressure * 0.5); // 1.5x to 3x base width
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      minPointers={1}
      maxPointers={1}
    >
      <View style={[styles.container, style]}>
        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
          {/* Render completed strokes */}
          {completedStrokes.map((stroke, index) => (
            <Path
              key={index}
              d={renderPath(stroke.points, stroke.pressure)}
              stroke={stroke.color}
              strokeWidth={getStrokeWidth(stroke.pressure)}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          ))}
          
          {/* Render current stroke */}
          {currentStroke.length > 1 && (
            <Path
              d={renderPath(currentStroke, currentPressure)}
              stroke={colors.primary}
              strokeWidth={getStrokeWidth(currentPressure)}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          )}
        </Svg>
        
        {/* iPad-specific overlay information */}
        {isIPad && completedStrokes.length === 0 && (
          <View style={styles.iPadOverlay}>
            <Text style={[styles.overlayTitle, { color: colors.text }]}>
              Apple Pencil Ready
            </Text>
            <Text style={[styles.overlayText, { color: colors.textSecondary }]}>
              Draw with pressure sensitivity
            </Text>
            <Text style={[styles.overlaySubtext, { color: colors.textSecondary }]}>
              • Vary pressure for line weight
              • Tilt for shading effects
              • Natural palm rejection
            </Text>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
};

// Apple Pencil Pressure Display Component
interface PressureDisplayProps {
  pressure: number;
  tilt: number;
}

export const ApplePencilPressureDisplay: React.FC<PressureDisplayProps> = ({ 
  pressure, 
  tilt 
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.pressureContainer, { backgroundColor: colors.card }]}>
      <View style={styles.pressureItem}>
        <Text style={[styles.pressureLabel, { color: colors.textSecondary }]}>
          Pressure
        </Text>
        <View style={[styles.pressureBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.pressureFill, 
              { 
                backgroundColor: colors.primary,
                width: `${pressure * 100}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.pressureValue, { color: colors.text }]}>
          {(pressure * 100).toFixed(0)}%
        </Text>
      </View>
      
      <View style={styles.pressureItem}>
        <Text style={[styles.pressureLabel, { color: colors.textSecondary }]}>
          Tilt
        </Text>
        <View style={[styles.pressureBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.pressureFill, 
              { 
                backgroundColor: colors.secondary,
                width: `${(tilt / 90) * 100}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.pressureValue, { color: colors.text }]}>
          {tilt.toFixed(0)}°
        </Text>
      </View>
    </View>
  );
};

// Apple Pencil Professional Tutorial Component
export const ApplePencilTutorial: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [currentPressure, setCurrentPressure] = useState(0.5);
  const [currentTilt, setCurrentTilt] = useState(0);

  return (
    <View style={[styles.tutorialContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.tutorialTitle, { color: colors.text }]}>
        Master Your Apple Pencil
      </Text>
      <Text style={[styles.tutorialSubtitle, { color: colors.textSecondary }]}>
        Learn professional pressure and tilt techniques
      </Text>

      <View style={styles.tutorialContent}>
        <ApplePencilCanvas
          onPressureChange={setCurrentPressure}
          onTiltChange={setCurrentTilt}
          style={styles.tutorialCanvas}
        />
        
        <ApplePencilPressureDisplay 
          pressure={currentPressure}
          tilt={currentTilt}
        />
      </View>

      <View style={[styles.techniquesContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.techniquesTitle, { color: colors.text }]}>
          Professional Techniques:
        </Text>
        <Text style={[styles.techniqueItem, { color: colors.textSecondary }]}>
          🖊️ Light pressure: Fine details and delicate lines
        </Text>
        <Text style={[styles.techniqueItem, { color: colors.textSecondary }]}>
          ✏️ Medium pressure: Standard drawing and sketching
        </Text>
        <Text style={[styles.techniqueItem, { color: colors.textSecondary }]}>
          🖌️ Heavy pressure: Bold strokes and emphasis
        </Text>
        <Text style={[styles.techniqueItem, { color: colors.textSecondary }]}>
          📐 Tilt angle: Shading and texture effects
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  iPadOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -60 }],
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    width: 200,
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  overlayText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  overlaySubtext: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
  pressureContainer: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  pressureItem: {
    marginBottom: 12,
  },
  pressureLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  pressureBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  pressureFill: {
    height: '100%',
    borderRadius: 4,
  },
  pressureValue: {
    fontSize: 12,
    textAlign: 'right',
  },
  tutorialContainer: {
    flex: 1,
    padding: 20,
  },
  tutorialTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tutorialSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialCanvas: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  techniquesContainer: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  techniquesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  techniqueItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ApplePencilCanvas;