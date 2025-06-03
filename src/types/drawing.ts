// src/types/drawing.ts - COMPLETE DRAWING TYPES
import { ColorValue } from 'react-native';

// ✅ CORE DRAWING TYPES
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
}

// ✅ PROPER GRADIENT COLORS TYPE  
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

// ✅ SHAPE TYPES
export type ShapeType = 
  | 'circle'
  | 'square' 
  | 'triangle'
  | 'rectangle'
  | 'star'
  | 'heart'
  | 'line'
  | 'arrow'
  | 'spiral'  // ✅ ADD MISSING SPIRAL
  | 'squiggle' // ✅ ADD MISSING SQUIGGLE
  | 'unknown';

// ✅ DRAWING TOOL INTERFACE
export interface DrawingTool {
  id: string;
  type: 'pen' | 'brush' | 'eraser' | 'highlighter';
  color: string;
  width: number;
  opacity: number;
}

// ✅ DRAWING STROKE INTERFACE  
export interface DrawingStroke {
  id: string;
  path: DrawingPath;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  tool?: string;
  timestamp?: number;
}

// ✅ CANVAS SETTINGS INTERFACE
export interface CanvasSettings {
  backgroundColor: string;
  gridEnabled: boolean;
  gridColor: string;
  snapToGrid: boolean;
  gridSize: number;
}

// ✅ DETECTED SHAPE INTERFACE
export interface DetectedShape {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

// ✅ SHAPE TRANSFORMATION INTERFACE
export interface ShapeTransformation {
  id: string;
  type: 'magic' | 'celebration' | 'enhancement';
  fromShape: ShapeType;
  toShape: string;
  duration: number;
  timestamp: number;
}

// ✅ DRAWING SESSION INTERFACE
export interface DrawingSession {
  id: string;
  startTime: number;
  endTime?: number;
  totalTime: number;
  strokes: DrawingStroke[];
  transformations: ShapeTransformation[];
  shapesDetected: DetectedShape[];
  isComplete: boolean;
}

// ✅ COMPLETE DRAWING STATE INTERFACE
export interface DrawingState {
  currentSession: DrawingSession | null;
  sessions: DrawingSession[];
  currentTool: DrawingTool;
  canvasSettings: CanvasSettings;
  transformationQueue: ShapeTransformation[];
  undoStack: Point[][];
  redoStack: Point[][];
  isDrawing: boolean;
  lastDetectedShape: DetectedShape | null;
}

// ✅ DRAWING CONTEXT TYPE INTERFACE
export interface DrawingContextType {
  drawingState: DrawingState;
  addPath: (path: DrawingPath) => void;
  clearDrawing: () => void;
  startNewSession: () => void;
  endCurrentSession: () => void;
  setCurrentTool: (tool: DrawingTool) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  onShapeDetected: (shape: DetectedShape) => void;
  addTransformation: (transformation: Omit<ShapeTransformation, 'id'>) => void;
  completeTransformation: (transformationId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// ✅ SHAPE DETECTION RESULT
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

// ✅ LESSON AND PROGRESS TYPES
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
  color: GradientColors;
  locked: boolean;
  completed: boolean;
  accuracy?: number;
}

// ✅ TRANSFORMATION AND MAGIC EFFECTS
export interface TransformationEffect {
  type: 'magic' | 'celebration' | 'encouragement';
  duration: number;
  shape: ShapeType;
  message: string;
}

// ✅ HELPER FUNCTIONS FOR TYPE CONVERSION
export const createGradientColors = (colors: string[]): GradientColors => {
  if (colors.length < 2) {
    return ['#007AFF', '#5856D6'] as GradientColors;
  }
  return colors as GradientColors;
};

export const ensureGradientColors = (colors: string[] | GradientColors): GradientColors => {
  return Array.isArray(colors) && colors.length >= 2 
    ? createGradientColors(colors)
    : ['#007AFF', '#5856D6'] as GradientColors;
};