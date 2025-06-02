// src/types/drawing.ts
import { ColorValue } from 'react-native';

// Core drawing types
export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
}

export type ShapeType = 
  | 'circle'
  | 'square' 
  | 'triangle'
  | 'rectangle'
  | 'star'
  | 'heart'
  | 'line'
  | 'arrow'
  | 'unknown';

export interface DrawingShape {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  points: Point[];
}

export interface ShapeDetectionResult {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ✅ PROPER GRADIENT COLORS TYPE
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

// Canvas and drawing state
export interface DrawingState {
  paths: DrawingPath[];
  currentPath: Point[];
  isDrawing: boolean;
  tool: DrawingTool;
  strokeColor: string;
  strokeWidth: number;
}

export interface DrawingTool {
  type: 'pen' | 'brush' | 'eraser' | 'highlighter';
  size: number;
  opacity: number;
}

// Lesson and progress types
export interface LessonStep {
  id: string;
  type: 'instruction' | 'drawing' | 'feedback';
  title: string;
  description: string;
  targetShape?: ShapeType;
  duration?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: LessonStep[];
  color: GradientColors; // ✅ USE PROPER TYPE
  locked: boolean;
  completed: boolean;
  accuracy?: number;
}

// Helper functions for type conversion
export const createGradientColors = (colors: string[]): GradientColors => {
  if (colors.length < 2) {
    return ['#007AFF', '#5856D6'] as GradientColors; // ✅ PROPER CONVERSION
  }
  return colors as GradientColors; // ✅ PROPER CONVERSION
};

// Transformation and magic effects
export interface TransformationEffect {
  type: 'magic' | 'celebration' | 'encouragement';
  duration: number;
  shape: ShapeType;
  message: string;
}

// Export utility function for proper type handling
export const ensureGradientColors = (colors: string[] | GradientColors): GradientColors => {
  return Array.isArray(colors) && colors.length >= 2 
    ? createGradientColors(colors)
    : ['#007AFF', '#5856D6'] as GradientColors;
};