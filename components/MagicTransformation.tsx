import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface MagicTransformationProps {
  originalPath: Array<{x: number, y: number}>;
  onTransformationComplete: () => void;
}

const transformations = [
  {
    id: 'smiley',
    name: 'Smiley Face',
    emoji: '😊',
    description: 'Add two dots and a smile!'
  },
  {
    id: 'sun',
    name: 'Bright Sun',
    emoji: '☀️',
    description: 'Add radiating sunshine!'
  },
  {
    id: 'wheel',
    name: 'Spinning Wheel',
    emoji: '🎡',
    description: 'Add spokes through the center!'
  },
  {
    id: 'pizza',
    name: 'Delicious Pizza',
    emoji: '🍕',
    description: 'Add triangular slices!'
  },
  {
    id: 'clock',
    name: 'Working Clock',
    emoji: '🕐',
    description: 'Add numbers and hands!'
  },
];

export const MagicTransformation: React.FC<MagicTransformationProps> = ({
  originalPath,
  onTransformationComplete,
}) => {
  const [currentTransformation, setCurrentTransformation] = useState(0);
  const [showTransformation, setShowTransformation] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Calculate circle center and radius from original path
  const getCircleProperties = () => {
    if (originalPath.length === 0) return { centerX: 150, centerY: 150, radius: 50 };
    
    const centerX = originalPath.reduce((sum, point) => sum + point.x, 0) / originalPath.length;
    const centerY = originalPath.reduce((sum, point) => sum + point.y, 0) / originalPath.length;
    
    const distances = originalPath.map(point => 
      Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2))
    );
    const radius = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    
    return { centerX, centerY, radius: Math.max(radius, 30) };
  };

  const { centerX, centerY, radius } = getCircleProperties();

  useEffect(() => {
    // Start the transformation sequence
    const timer = setTimeout(() => {
      setShowTransformation(true);
      startTransformationAnimation();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showTransformation) {
      const interval = setInterval(() => {
        if (currentTransformation < transformations.length - 1) {
          setCurrentTransformation(prev => prev + 1);
          Vibration.vibrate(50); // Haptic feedback for each transformation
          startTransformationAnimation();
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onTransformationComplete();
          }, 2000);
        }
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [showTransformation, currentTransformation]);

  const startTransformationAnimation = () => {
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    rotateAnim.setValue(0);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderTransformation = (type: string) => {
    const svgWidth = Math.max(width - 80, 300);
    const svgHeight = 300;
    const adjustedCenterX = svgWidth / 2;
    const adjustedCenterY = svgHeight / 2;
    const adjustedRadius = Math.min(radius, 60);

    switch (type) {
      case 'smiley':
        return (
          <Svg width={svgWidth} height={svgHeight}>
            {/* Original Circle */}
            <Circle
              cx={adjustedCenterX}
              cy={adjustedCenterY}
              r={adjustedRadius}
              stroke="#4A90E2"
              strokeWidth={4}
              fill="none"
            />
            {/* Eyes */}
            <Circle cx={adjustedCenterX - adjustedRadius/3} cy={adjustedCenterY - adjustedRadius/4} r={4} fill="#4A90E2" />
            <Circle cx={adjustedCenterX + adjustedRadius/3} cy={adjustedCenterY - adjustedRadius/4} r={4} fill="#4A90E2" />
            {/* Smile */}
            <Path
              d={`M ${adjustedCenterX - adjustedRadius/2} ${adjustedCenterY + adjustedRadius/4} Q ${adjustedCenterX} ${adjustedCenterY + adjustedRadius/2} ${adjustedCenterX + adjustedRadius/2} ${adjustedCenterY + adjustedRadius/4}`}
              stroke="#4A90E2"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'sun':
        const rayLength = adjustedRadius + 20;
        return (
          <Svg width={svgWidth} height={svgHeight}>
            {/* Original Circle */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={adjustedRadius} stroke="#FFB800" strokeWidth={4} fill="#FFF3CD" />
            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
              const radian = (angle * Math.PI) / 180;
              const startX = adjustedCenterX + Math.cos(radian) * (adjustedRadius + 5);
              const startY = adjustedCenterY + Math.sin(radian) * (adjustedRadius + 5);
              const endX = adjustedCenterX + Math.cos(radian) * rayLength;
              const endY = adjustedCenterY + Math.sin(radian) * rayLength;
              
              return (
                <Line
                  key={index}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#FFB800"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}
          </Svg>
        );

      case 'wheel':
        return (
          <Svg width={svgWidth} height={svgHeight}>
            {/* Original Circle */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={adjustedRadius} stroke="#4A90E2" strokeWidth={4} fill="none" />
            {/* Spokes */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => {
              const radian = (angle * Math.PI) / 180;
              const endX = adjustedCenterX + Math.cos(radian) * adjustedRadius;
              const endY = adjustedCenterY + Math.sin(radian) * adjustedRadius;
              
              return (
                <Line
                  key={index}
                  x1={adjustedCenterX}
                  y1={adjustedCenterY}
                  x2={endX}
                  y2={endY}
                  stroke="#4A90E2"
                  strokeWidth={2}
                />
              );
            })}
            {/* Center hub */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={8} fill="#4A90E2" />
          </Svg>
        );

      case 'pizza':
        return (
          <Svg width={svgWidth} height={svgHeight}>
            {/* Original Circle */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={adjustedRadius} stroke="#FF6B35" strokeWidth={4} fill="#FFE4D1" />
            {/* Pizza slices */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
              const radian = (angle * Math.PI) / 180;
              const endX = adjustedCenterX + Math.cos(radian) * adjustedRadius;
              const endY = adjustedCenterY + Math.sin(radian) * adjustedRadius;
              
              return (
                <Line
                  key={index}
                  x1={adjustedCenterX}
                  y1={adjustedCenterY}
                  x2={endX}
                  y2={endY}
                  stroke="#FF6B35"
                  strokeWidth={2}
                />
              );
            })}
          </Svg>
        );

      case 'clock':
        return (
          <Svg width={svgWidth} height={svgHeight}>
            {/* Original Circle */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={adjustedRadius} stroke="#4A90E2" strokeWidth={4} fill="white" />
            {/* Clock numbers */}
            <SvgText x={adjustedCenterX} y={adjustedCenterY - adjustedRadius + 15} textAnchor="middle" fontSize="14" fill="#4A90E2">12</SvgText>
            <SvgText x={adjustedCenterX + adjustedRadius - 8} y={adjustedCenterY + 5} textAnchor="middle" fontSize="14" fill="#4A90E2">3</SvgText>
            <SvgText x={adjustedCenterX} y={adjustedCenterY + adjustedRadius - 5} textAnchor="middle" fontSize="14" fill="#4A90E2">6</SvgText>
            <SvgText x={adjustedCenterX - adjustedRadius + 8} y={adjustedCenterY + 5} textAnchor="middle" fontSize="14" fill="#4A90E2">9</SvgText>
            {/* Clock hands */}
            <Line x1={adjustedCenterX} y1={adjustedCenterY} x2={adjustedCenterX} y2={adjustedCenterY - adjustedRadius/2} stroke="#4A90E2" strokeWidth={3} strokeLinecap="round" />
            <Line x1={adjustedCenterX} y1={adjustedCenterY} x2={adjustedCenterX + adjustedRadius/3} y2={adjustedCenterY} stroke="#4A90E2" strokeWidth={2} strokeLinecap="round" />
            {/* Center dot */}
            <Circle cx={adjustedCenterX} cy={adjustedCenterY} r={4} fill="#4A90E2" />
          </Svg>
        );

      default:
        return null;
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Watch the Magic! ✨</Text>
        <Text style={styles.subtitle}>Your circle is becoming...</Text>
      </View>

      <Animated.View
        style={[
          styles.transformationContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        {showTransformation && renderTransformation(transformations[currentTransformation].id)}
      </Animated.View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.emoji}>{transformations[currentTransformation].emoji}</Text>
        <Text style={styles.transformationName}>{transformations[currentTransformation].name}</Text>
        <Text style={styles.transformationDescription}>{transformations[currentTransformation].description}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentTransformation + 1} of {transformations.length}
        </Text>
        <View style={styles.progressBar}>
          {transformations.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentTransformation && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  transformationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  transformationName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  transformationDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
  },
});