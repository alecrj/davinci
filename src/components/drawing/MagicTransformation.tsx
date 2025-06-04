import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@/components/Themed';
import { Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext'; // ✅ FIXED: Correct import path
import { ensureGradientColors } from '@/utils/colors/gradientHelper';
import { ShapeType, Point } from '@/types/drawing';

const { width, height } = Dimensions.get('window');

// ✅ FIXED: Complete interface with all required props
export interface MagicTransformationProps {
  shape: ShapeType;
  detectedShape?: ShapeType; // Optional for backward compatibility
  userDrawing: any;
  originalPath?: Point[]; // Optional for backward compatibility  
  onComplete: () => void;
}

export const MagicTransformation: React.FC<MagicTransformationProps> = ({ 
  shape, 
  detectedShape, 
  userDrawing, 
  originalPath,
  onComplete 
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const [animationStage, setAnimationStage] = useState<'analyzing' | 'transforming' | 'revealing' | 'complete'>('analyzing');
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));

  // ✅ FIXED: Use shape prop, fall back to detectedShape for compatibility
  const activeShape = shape || detectedShape || 'unknown';

  useEffect(() => {
    startTransformationAnimation();
  }, []);

  const startTransformationAnimation = () => {
    // Stage 1: Analyzing (1 second)
    setTimeout(() => {
      setAnimationStage('transforming');
      
      // Scale and fade in animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    // Stage 2: Transforming (1.5 seconds)
    setTimeout(() => {
      setAnimationStage('revealing');
      
      // Rotation animation for magic effect
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 2500);

    // Stage 3: Complete (after 4 seconds total)
    setTimeout(() => {
      setAnimationStage('complete');
    }, 4000);
  };

  // ✅ FIXED: Handle all shape types including new ones with safe property access
  const getTransformationMessage = (shapeType: ShapeType): string => {
    const messages: Record<ShapeType, string> = {
      circle: "Beautiful! Your circle has perfect harmony and flow.",
      square: "Excellent! Your square shows great structural control.", 
      triangle: "Amazing! Your triangle demonstrates strong geometric sense.",
      rectangle: "Wonderful! Your rectangle has excellent proportions.",
      star: "Fantastic! Your star shows creative flair and precision.",
      heart: "Lovely! Your heart shape shows artistic expression.",
      line: "Great! Your line demonstrates confident stroke control.",
      arrow: "Perfect! Your arrow shows directional clarity.",
      spiral: "Incredible! Your spiral shows fluid motion mastery.",
      squiggle: "Creative! Your squiggle shows free-form expression.",
      unknown: "Magnificent! Your unique shape shows creative potential.",
    };
    
    return messages[shapeType] || messages.unknown; // ✅ FIXED: Safe property access
  };

  const renderEnhancedShape = () => {
    // Generate enhanced version of the user's drawing
    const enhancedColor = colors.primary;
    const strokeWidth = 3;
    
    return (
      <View style={styles.enhancedShapeContainer}>
        <LinearGradient
          colors={ensureGradientColors(['rgba(0, 122, 255, 0.1)', 'rgba(88, 86, 214, 0.1)'])}
          style={styles.shapeBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Svg width={200} height={200} viewBox="0 0 200 200">
          {renderShapePath(activeShape, enhancedColor, strokeWidth)}
        </Svg>
      </View>
    );
  };

  const renderShapePath = (shapeType: ShapeType, color: string, strokeWidth: number) => {
    const centerX = 100;
    const centerY = 100;
    const size = 60;

    switch (shapeType) {
      case 'circle':
        return <Path d={`M ${centerX - size} ${centerY} A ${size} ${size} 0 0 1 ${centerX + size} ${centerY} A ${size} ${size} 0 0 1 ${centerX - size} ${centerY}`} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'square':
        return <Path d={`M ${centerX - size} ${centerY - size} L ${centerX + size} ${centerY - size} L ${centerX + size} ${centerY + size} L ${centerX - size} ${centerY + size} Z`} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'triangle':
        return <Path d={`M ${centerX} ${centerY - size} L ${centerX + size} ${centerY + size} L ${centerX - size} ${centerY + size} Z`} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'rectangle':
        return <Path d={`M ${centerX - size} ${centerY - size/2} L ${centerX + size} ${centerY - size/2} L ${centerX + size} ${centerY + size/2} L ${centerX - size} ${centerY + size/2} Z`} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'star':
        const starPath = generateStarPath(centerX, centerY, size);
        return <Path d={starPath} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'heart':
        const heartPath = generateHeartPath(centerX, centerY, size);
        return <Path d={heartPath} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'spiral':
        const spiralPath = generateSpiralPath(centerX, centerY, size);
        return <Path d={spiralPath} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      case 'squiggle':
        const squigglePath = generateSquigglePath(centerX, centerY, size);
        return <Path d={squigglePath} stroke={color} strokeWidth={strokeWidth} fill="transparent" />;
      default:
        return <Path d={`M ${centerX - size} ${centerY} L ${centerX + size} ${centerY}`} stroke={color} strokeWidth={strokeWidth} />;
    }
  };

  const generateStarPath = (cx: number, cy: number, size: number): string => {
    const points = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let path = '';
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return path + ' Z';
  };

  const generateHeartPath = (cx: number, cy: number, size: number): string => {
    const scale = size / 50;
    return `M ${cx} ${cy + 10 * scale} C ${cx - 20 * scale} ${cy - 10 * scale}, ${cx - 40 * scale} ${cy - 10 * scale}, ${cx} ${cy - 30 * scale} C ${cx + 40 * scale} ${cy - 10 * scale}, ${cx + 20 * scale} ${cy - 10 * scale}, ${cx} ${cy + 10 * scale} Z`;
  };

  const generateSpiralPath = (cx: number, cy: number, size: number): string => {
    let path = `M ${cx} ${cy}`;
    const turns = 3;
    const steps = 60;
    
    for (let i = 1; i <= steps; i++) {
      const angle = (i / steps) * turns * 2 * Math.PI;
      const radius = (i / steps) * size;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const generateSquigglePath = (cx: number, cy: number, size: number): string => {
    let path = `M ${cx - size} ${cy}`;
    const segments = 8;
    
    for (let i = 1; i <= segments; i++) {
      const x = cx - size + (2 * size * i) / segments;
      const y = cy + (i % 2 === 0 ? 1 : -1) * size * 0.3 * Math.sin((i * Math.PI) / 2);
      path += ` Q ${x - size / segments} ${y + (i % 2 === 0 ? -1 : 1) * size * 0.2} ${x} ${y}`;
    }
    return path;
  };

  const renderAnimationContent = () => {
    switch (animationStage) {
      case 'analyzing':
        return (
          <View style={styles.stageContent}>
            <Text style={[styles.stageTitle, { color: colors.text }]}>Analyzing Your Creation...</Text>
            <View style={styles.loadingContainer}>
              <LinearGradient
                colors={ensureGradientColors(['#007AFF', '#5856D6'])}
                style={styles.loadingBar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        );

      case 'transforming':
        return (
          <Animated.View 
            style={[
              styles.stageContent,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }
            ]}
          >
            <Text style={[styles.stageTitle, { color: colors.text }]}>Creating Magic...</Text>
            {renderEnhancedShape()}
          </Animated.View>
        );

      case 'revealing':
        const rotateInterpolation = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View 
            style={[
              styles.stageContent,
              {
                transform: [{ rotate: rotateInterpolation }],
              }
            ]}
          >
            <Text style={[styles.stageTitle, { color: colors.text }]}>Revealing Your Masterpiece!</Text>
            {renderEnhancedShape()}
          </Animated.View>
        );

      case 'complete':
        return (
          <View style={styles.stageContent}>
            <Text style={[styles.celebrationTitle, { color: colors.primary }]}>✨ Amazing! ✨</Text>
            <Text style={[styles.celebrationMessage, { color: colors.text }]}>
              {getTransformationMessage(activeShape)}
            </Text>
            {renderEnhancedShape()}
            <Button
              title="Continue Learning"
              onPress={onComplete}
              variant="primary"
              size="large"
              style={styles.continueButton}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={ensureGradientColors(['rgba(0, 122, 255, 0.05)', 'rgba(88, 86, 214, 0.05)'])}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {renderAnimationContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stageContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: '70%',
    borderRadius: 2,
  },
  enhancedShapeContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    overflow: 'hidden',
  },
  shapeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  celebrationMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  continueButton: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
});

export default MagicTransformation;