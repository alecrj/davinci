/**
 * DaVinci Drawing System Types
 * Comprehensive type definitions for the drawing engine
 */

import { SkillLevel } from '@/constants/app';

// Core geometric types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Drawing stroke data
export interface DrawingStroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
  pressure?: number[];
}

// Shape detection types
export type DetectedShapeType = 
  | 'circle'
  | 'square' 
  | 'triangle'
  | 'rectangle'
  | 'star'
  | 'heart'
  | 'arrow'
  | 'house'
  | 'flower'
  | 'unknown';

export interface DetectedShape {
  type: DetectedShapeType;
  confidence: number;
  boundingBox: Rect;
  center: Point;
  originalStrokes: string[]; // stroke IDs
}

// Transformation data
export interface ShapeTransformation {
  id: string;
  fromShape: DetectedShapeType;
  toObject: string;
  animation: 'morph' | 'explode' | 'grow' | 'sparkle';
  duration: number;
  celebration: CelebrationStyle;
}

export type CelebrationStyle = 
  | 'confetti'
  | 'fireworks' 
  | 'sparkles'
  | 'bounce'
  | 'glow';

// Complete drawing session data
export interface DrawingSession {
  id: string;
  strokes: DrawingStroke[];
  detectedShapes: DetectedShape[];
  transformations: ShapeTransformation[];
  canvasSize: Size;
  startTime: number;
  endTime?: number;
  totalDrawingTime: number; // milliseconds of active drawing
  skillLevel: SkillLevel;
  isCompleted: boolean;
}

// Drawing tool configuration
export interface DrawingTool {
  type: 'brush' | 'eraser' | 'highlighter';
  color: string;
  width: number;
  opacity: number;
}

// Canvas settings
export interface CanvasSettings {
  backgroundColor: string;
  showGrid: boolean;
  showGuides: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoomLevel: number;
  maxZoom: number;
  minZoom: number;
}

// Drawing context state
export interface DrawingContextState {
  // Current session
  currentSession: DrawingSession | null;
  
  // Tool settings
  activeTool: DrawingTool;
  canvasSettings: CanvasSettings;
  
  // Drawing state
  isDrawing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  
  // Shape detection
  isDetectionEnabled: boolean;
  detectionSensitivity: number;
  
  // Transformation system
  transformationQueue: ShapeTransformation[];
  isTransforming: boolean;
  
  // Performance tracking
  currentFPS: number;
  frameDrops: number;
}

// Drawing context actions
export interface DrawingContextActions {
  // Session management
  startNewSession: () => void;
  endCurrentSession: () => void;
  saveSession: (session: DrawingSession) => Promise<void>;
  
  // Drawing operations
  addStroke: (stroke: DrawingStroke) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  
  // Tool management
  setActiveTool: (tool: DrawingTool) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  
  // Shape detection
  toggleShapeDetection: () => void;
  setDetectionSensitivity: (sensitivity: number) => void;
  
  // Transformations
  triggerTransformation: (shape: DetectedShape) => void;
  completeTransformation: (transformationId: string) => void;
}

// Combined drawing context type
export type DrawingContextType = DrawingContextState & DrawingContextActions;

// Assessment types
export interface DrawingAssessment {
  userId: string;
  sessionId: string;
  skillLevel: SkillLevel;
  scores: {
    accuracy: number;      // 0-100
    creativity: number;    // 0-100
    technique: number;     // 0-100
    confidence: number;    // 0-100
  };
  improvements: string[];
  encouragement: string;
  nextLessonRecommendation: string;
  timestamp: number;
}

// Lesson integration types
export interface DrawingExercise {
  id: string;
  title: string;
  description: string;
  targetShape: DetectedShapeType;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // seconds
  requiredAccuracy: number; // 0-100
  hints: string[];
  successCriteria: {
    minShapes: number;
    minAccuracy: number;
    maxTime?: number;
  };
}

// Export types
export interface DrawingExport {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number; // 0-1
  size: Size;
  includeBackground: boolean;
  includeGuides: boolean;
}

// Performance monitoring
export interface DrawingPerformance {
  averageFPS: number;
  frameDropCount: number;
  memoryUsage: number; // bytes
  renderTime: number; // milliseconds
  inputLatency: number; // milliseconds
  sessionDuration: number; // milliseconds
}