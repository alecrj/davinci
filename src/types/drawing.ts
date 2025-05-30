// CRITICAL FIX 4: src/types/drawing.ts
// Adding all missing type exports that are causing import errors

import { ColorValue } from 'react-native';

// FIXED: Complete Point interface
export interface Point {
  x: number;
  y: number;
}

// FIXED: Complete Size interface
export interface Size {
  width: number;
  height: number;
}

// FIXED: Drawing path with all required properties
export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number; // Added missing width property
  timestamp: number;
}

// FIXED: Drawing stroke interface (was missing)
export interface DrawingStroke {
  id: string;
  path: DrawingPath;
  pressure?: number;
  velocity?: number;
}

// FIXED: Shape type with all possible shapes
export type ShapeType = 
  | 'circle' 
  | 'square' 
  | 'triangle' 
  | 'rectangle'  // Added missing rectangle
  | 'line' 
  | 'star' 
  | 'heart' 
  | 'squiggle'   // Added missing squiggle
  | 'spiral'     // Added missing spiral
  | 'unknown';

// FIXED: Detected shape interface
export interface DetectedShape {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// FIXED: Drawing shape with paths property
export interface DrawingShape {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paths: DrawingPath[]; // Added missing paths property
}

// FIXED: Drawing tool interface
export interface DrawingTool {
  id: string;
  name: string;
  color: string;
  width: number; // Added missing width property
  opacity: number;
}

// FIXED: Canvas settings interface
export interface CanvasSettings {
  backgroundColor: string;
  gridEnabled: boolean;
  gridColor: string;
  snapToGrid: boolean;
  gridSize: number;
}

// FIXED: Shape transformation with id property
export interface ShapeTransformation {
  id: string;           // Added missing id property
  fromShape: ShapeType;
  toObject: string;
  confidence: number;
  description: string;
  celebrationText: string;
}

// FIXED: Drawing session with all properties
export interface DrawingSession {
  id: string;
  startTime: number;
  endTime?: number;
  strokes: DrawingStroke[];        // Added missing strokes property
  transformations: ShapeTransformation[]; // Added missing transformations property
  isComplete: boolean;
  totalTime: number;
  shapesDetected: ShapeType[];
  finalScore?: number;
}

// FIXED: Drawing state interface
export interface DrawingState {
  currentSession: DrawingSession | null;
  sessions: DrawingSession[];
  currentTool: DrawingTool;
  canvasSettings: CanvasSettings;
  transformationQueue: ShapeTransformation[];
  undoStack: DrawingPath[][];
  redoStack: DrawingPath[][];
  isDrawing: boolean;
  lastDetectedShape?: DetectedShape;
}

// FIXED: Drawing context type with all methods
export interface DrawingContextType {
  // State
  drawingState: DrawingState;      // Added missing drawingState property
  
  // Drawing actions  
  addPath: (path: DrawingPath) => void;
  clearDrawing: () => void;        // Added missing clearDrawing method
  startNewSession: () => void;
  endCurrentSession: () => void;
  
  // Tool management
  setCurrentTool: (tool: DrawingTool) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  
  // Shape detection
  onShapeDetected: (shape: DetectedShape) => void;
  addTransformation: (transformation: Omit<ShapeTransformation, 'id'>) => void;
  completeTransformation: (transformationId: string) => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// FIXED: Lesson types (referenced in components but not defined)
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  objectives: string[];
  steps: LessonStep[];
  locked: boolean;
  color: readonly [ColorValue, ColorValue, ...ColorValue[]]; // FIXED: Proper LinearGradient type
}

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  expectedShape?: ShapeType;
  hints: string[];
  completed: boolean;
}

// FIXED: Drawing colors type for LinearGradient compatibility
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

// FIXED: Color palette helpers
export const createGradientColors = (colors: string[]): GradientColors => {
  if (colors.length < 2) {
    return [colors[0] || '#000000', colors[0] || '#000000'] as const;
  }
  return colors as GradientColors;
};