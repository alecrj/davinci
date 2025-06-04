import { ColorValue } from 'react-native';

// Core drawing types
export interface Point {
  x: number;
  y: number;
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
  | 'spiral'
  | 'squiggle'
  | 'unknown';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ✅ FIXED: DetectedShape interface with pointCount property
export interface DetectedShape {
  type: ShapeType;
  confidence: number;
  boundingBox: BoundingBox;
  pointCount: number; // ✅ FIXED: Added missing pointCount property
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
}

export interface DrawingStroke {
  id: string;
  path: DrawingPath;
}

export interface DrawingTool {
  id: string;
  type: 'pen' | 'brush' | 'eraser' | 'pencil';
  opacity: number;
  color: string;
}

// Drawing context state
export interface DrawingState {
  isDrawing: boolean;
  currentTool: DrawingTool;
  brushSize: number;
  color: string;
  opacity: number;
  strokes: DrawingStroke[];
  currentPath: Point[];
  undoStack: Point[][];
  redoStack: Point[][];
  lastDetectedShape: DetectedShape | null;
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
}

// AI and feedback types
export interface DrawingAnalysis {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  improvements: string[];
  confidence: number;
  progression: number;
}

export interface AIFeedback {
  message: string;
  encouragement: string;
  tips?: string[];
  nextStep?: string;
  score?: number;
}

// Transformation and effects
export interface TransformationEffect {
  type: 'enhancement' | 'style' | 'color' | 'composition';
  name: string;
  description: string;
  before: string; // Image URI
  after: string;  // Image URI
}

// Lesson and assessment types
export interface DrawingChallenge {
  id: string;
  type: 'shape' | 'freeform' | 'trace' | 'creative';
  instruction: string;
  targetShape?: ShapeType;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssessmentResult {
  accuracy: number;
  speed: number;
  confidence: number;
  creativity: number;
  overallScore: number;
  feedback: AIFeedback;
}

// Canvas and rendering types
export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
}

export interface RenderOptions {
  antialias: boolean;
  smoothing: boolean;
  pressureSensitivity: boolean;
  showStrokes: boolean;
  showGuides: boolean;
}

// Export and sharing
export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number;
  background: 'transparent' | 'white' | 'custom';
  customBackground?: string;
  includeMetadata: boolean;
}

export interface ShareableArtwork {
  id: string;
  imageUri: string;
  thumbnailUri: string;
  metadata: {
    createdAt: Date;
    duration: number;
    strokeCount: number;
    tools: string[];
    colors: string[];
  };
  tags: string[];
  isPublic: boolean;
}

// Gradient types for UI components
export type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

// ✅ FIXED: Removed problematic gradient conversion function
// Instead, use the proper helper from utils/colors/gradientHelper.ts

// Utility functions
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const xCoords = points.map(p => p.x);
  const yCoords = points.map(p => p.y);
  
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function isValidShapeType(value: string): value is ShapeType {
  const validShapes: ShapeType[] = [
    'circle', 'square', 'triangle', 'rectangle', 'star',
    'heart', 'line', 'arrow', 'spiral', 'squiggle', 'unknown'
  ];
  return validShapes.includes(value as ShapeType);
}

export function sanitizeShapeType(value: string | null | undefined): ShapeType {
  if (!value || typeof value !== 'string') {
    return 'unknown';
  }
  
  return isValidShapeType(value) ? value : 'unknown';
}

// Animation and timing
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  repeat?: boolean;
  repeatCount?: number;
}

export interface DrawingAnimation {
  type: 'draw' | 'reveal' | 'transform' | 'celebrate';
  config: AnimationConfig;
  targetPaths: DrawingPath[];
}

// Performance and optimization
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  strokeCount: number;
  pointCount: number;
}

export interface OptimizationSettings {
  maxPoints: number;
  simplificationTolerance: number;
  enableBatching: boolean;
  useWebGL: boolean;
  cullOffscreenStrokes: boolean;
}

export default {
  createPoint,
  calculateDistance,
  calculateBoundingBox,
  isValidShapeType,
  sanitizeShapeType,
};