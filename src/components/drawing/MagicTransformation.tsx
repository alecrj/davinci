import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect, Polygon, G } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { ShapeType } from '@/types/drawing';
import { getShapeTransformations } from '@/utils/drawing/transformations';

const { width, height } = Dimensions.get('window');

interface MagicTransformationProps {
  detectedShape: ShapeType;
  userDrawing: any;
  onComplete: () => void;
}

export const MagicTransformation: React.FC<MagicTransformationProps> = ({
  detectedShape,
  userDrawing,
  onComplete,
}) => {
  const { theme } = useTheme();
  const [currentTransform, setCurrentTransform] = useState(0);
  const transformations = getShapeTransformations(detectedShape);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    startTransformation();
  }, [currentTransform]);
  
  const startTransformation = () => {
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    rotateAnim.setValue(0);
    
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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
    ]).start(() => {
      // Move to next transformation
      setTimeout(() => {
        if (currentTransform < transformations.length - 1) {
          setCurrentTransform(currentTransform + 1);
        } else {
          onComplete();
        }
      }, 1500);
    });
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const renderTransformation = () => {
    const transform = transformations[currentTransform];
    
    return (
      <View style={styles.canvas}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          <G>
            {/* Render the transformation based on shape type */}
            {transform.type === 'smiley' && (
              <>
                <Circle cx="150" cy="150" r="100" stroke={theme.accent} strokeWidth="4" fill="none" />
                <Circle cx="120" cy="130" r="10" fill={theme.accent} />
                <Circle cx="180" cy="130" r="10" fill={theme.accent} />
                <Path
                  d="M 110 170 Q 150 200 190 170"
                  stroke={theme.accent}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}
            
            {transform.type === 'sun' && (
              <>
                <Circle cx="150" cy="150" r="60" fill={theme.accent} />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 150 + Math.cos(rad) * 80;
                  const y1 = 150 + Math.sin(rad) * 80;
                  const x2 = 150 + Math.cos(rad) * 120;
                  const y2 = 150 + Math.sin(rad) * 120;
                  
                  return (
                    <Path
                      key={angle}
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      stroke={theme.accent}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  );
                })}
              </>
            )}
            
            {transform.type === 'flower' && (
              <>
                <Circle cx="150" cy="150" r="30" fill={theme.accent} />
                {[0, 72, 144, 216, 288].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 150 + Math.cos(rad) * 60;
                  const y = 150 + Math.sin(rad) * 60;
                  
                  return (
                    <Circle
                      key={angle}
                      cx={x}
                      cy={y}
                      r="40"
                      fill={theme.accentLight}
                      opacity="0.7"
                    />
                  );
                })}
              </>
            )}
            
            {/* Add more transformations based on shape type */}
          </G>
        </Svg>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        ✨ Watch the magic! ✨
      </Text>
      
      <Animated.View
        style={[
          styles.transformContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        {renderTransformation()}
      </Animated.View>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {transformations[currentTransform].description}
      </Text>
      
      <View style={styles.progress}>
        {transformations.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              { backgroundColor: theme.border },
              index <= currentTransform && { backgroundColor: theme.accent },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 40,
  },
  transformContainer: {
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  canvas: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Text-Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});