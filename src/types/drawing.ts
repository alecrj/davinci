/**
 * FIXED - Complete drawing type definitions
 * Exports ALL types referenced throughout the codebase
 */

import { SkillLevel } from '@/constants/app';

// Basic geometric types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Shape types
export type ShapeType = 
  | 'circle'
  | 'square' 
  | 'triangle'
  | 'line'
  | 'heart'
  | 'star'
  | 'rectangle'
  | 'oval'
  | 'unknown';

// Drawing path structure
export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  strokeWidth: number;
  timestamp: number;
}

// Shape detection result
export interface DrawingShape {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  center: Point;
  properties?: {
    radius?: number;
    width?: number;
    height?: number;
    angle?: number;
  };
}

// Drawing session state
export interface DrawingSession {
  id: string;
  startTime: number;
  endTime?: number;
  paths: DrawingPath[];
  detectedShapes: DrawingShape[];
  canvasSize: Size;
  totalDrawingTime: number;
  isComplete: boolean;
}

// Drawing statistics
export interface DrawingStats {
  totalSessions: number;
  totalDrawingTime: number;
  shapesDetected: number;
  averageConfidence: number;
  favoriteShapes: ShapeType[];
  improvementRate: number;
}

// User progress in drawing skills
export interface DrawingProgress {
  currentSkillLevel: SkillLevel;
  totalShapesDrawn: number;
  accuracyRate: number;
  speed: number;
  creativity: number;
  consistency: number;
  lastDrawingDate: number;
  streak: number;
  personalBest: {
    accuracy: number;
    speed: number;
    shapesInSession: number;
  };
}

// Drawing tool configuration
export interface DrawingTool {
  type: 'pen' | 'pencil' | 'brush' | 'marker';
  size: number;
  color: string;
  opacity: number;
  smoothing: number;
}

// Canvas configuration
export interface CanvasConfig {
  size: Size;
  backgroundColor: string;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  maxPaths: number;
  enableUndo: boolean;
  autoClear: boolean;
}

// Shape transformation data
export interface ShapeTransformation {
  from: ShapeType;
  to: string;
  emoji: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Drawing context type
export interface DrawingContextType {
  // Current session
  currentSession: DrawingSession | null;
  
  // Drawing state
  isDrawing: boolean;
  currentTool: DrawingTool;
  canvasConfig: CanvasConfig;
  
  // Progress tracking
  progress: DrawingProgress;
  stats: DrawingStats;
  
  // Actions
  startNewSession: () => void;
  endSession: () => void;
  addPath: (path: DrawingPath) => void;
  removePath: (pathId: string) => void;
  clearCanvas: () => void;
  undoLastPath: () => void;
  
  // Shape detection
  detectShapes: (paths: DrawingPath[]) => DrawingShape[];
  onShapeDetected: (shape: DrawingShape) => void;
  
  // Tool management
  setTool: (tool: DrawingTool) => void;
  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
  
  // Progress tracking
  updateProgress: (progress: Partial<DrawingProgress>) => void;
  incrementShapeCount: (shape: ShapeType) => void;
  
  // Session management
  saveSession: (session: DrawingSession) => Promise<void>;
  loadSession: (sessionId: string) => Promise<DrawingSession | null>;
  
  // Export/Import
  exportDrawing: (format: 'png' | 'svg' | 'json') => Promise<string>;
  importDrawing: (data: string) => Promise<void>;
}

// Animation types for shape transformations
export interface ShapeAnimation {
  type: 'fadeIn' | 'slideIn' | 'bounce' | 'rotate' | 'scale';
  duration: number;
  delay: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

// Drawing lesson structure
export interface DrawingLesson {
  id: string;
  title: string;
  description: string;
  targetShape: ShapeType;
  difficulty: SkillLevel;
  instructions: string[];
  hints: string[];
  successCriteria: {
    minAccuracy: number;
    maxTime: number;
    requiredShapes: ShapeType[];
  };
  rewards: {
    points: number;
    badges: string[];
    unlocks: string[];
  };
}

// Assessment result structure
export interface AssessmentResult {
  skillLevel: SkillLevel;
  strengths: string[];
  improvementAreas: string[];
  recommendedLessons: string[];
  overallScore: number;
  categoryScores: {
    accuracy: number;
    speed: number;
    creativity: number;
    technique: number;
  };
}