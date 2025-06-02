// src/utils/drawing/shapeDetection.ts
import { Point, DrawingPath, ShapeType } from '@/types/drawing';

export interface ShapeDetectionResult {
  type: ShapeType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // ✅ REMOVE CENTER PROPERTY (not in DrawingShape interface)
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

// ✅ FIXED FUNCTION SIGNATURE TO ACCEPT DrawingPath[]
export function detectShape(paths: DrawingPath[]): ShapeDetectionResult | null {
  if (!paths || paths.length === 0) return null;

  // Extract all points from all paths
  const allPoints: Point[] = paths.flatMap(path => path.points);
  
  if (allPoints.length < 3) return null;

  // Calculate bounding box
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));
  
  const width = maxX - minX;
  const height = maxY - minY;
  const boundingBox = { x: minX, y: minY, width, height };

  // Shape detection algorithms
  const circleConfidence = detectCircle(allPoints, boundingBox);
  const squareConfidence = detectSquare(allPoints, boundingBox);
  const triangleConfidence = detectTriangle(allPoints, boundingBox);
  const rectangleConfidence = detectRectangle(allPoints, boundingBox);
  const lineConfidence = detectLine(allPoints, boundingBox);

  // Find the shape with highest confidence
  const detections = [
    { type: 'circle' as ShapeType, confidence: circleConfidence },
    { type: 'square' as ShapeType, confidence: squareConfidence },
    { type: 'triangle' as ShapeType, confidence: triangleConfidence },
    { type: 'rectangle' as ShapeType, confidence: rectangleConfidence },
    { type: 'line' as ShapeType, confidence: lineConfidence },
  ];

  const bestDetection = detections.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );

  // Only return if confidence is above threshold
  if (bestDetection.confidence < 0.3) return null;

  return {
    type: bestDetection.type,
    confidence: bestDetection.confidence,
    boundingBox,
    // ✅ REMOVED CENTER PROPERTY
  };
}

function detectCircle(points: Point[], boundingBox: { width: number; height: number }): number {
  const { width, height } = boundingBox;
  
  // Circle should have similar width and height
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  if (aspectRatio < 0.7) return 0;

  // Check if points form a roughly circular pattern
  const centerX = boundingBox.x + width / 2;
  const centerY = boundingBox.y + height / 2;
  const expectedRadius = Math.min(width, height) / 2;

  let circularityScore = 0;
  for (const point of points) {
    const distance = Math.sqrt(
      Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
    );
    const radiusDeviation = Math.abs(distance - expectedRadius) / expectedRadius;
    if (radiusDeviation < 0.3) {
      circularityScore++;
    }
  }

  return (circularityScore / points.length) * aspectRatio;
}

function detectSquare(points: Point[], boundingBox: { width: number; height: number }): number {
  const { width, height } = boundingBox;
  
  // Square should have similar width and height
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  if (aspectRatio < 0.8) return 0;

  // Check for corners (simplified)
  return aspectRatio * 0.8; // Base confidence for square-like aspect ratio
}

function detectTriangle(points: Point[], boundingBox: { width: number; height: number }): number {
  // Simplified triangle detection
  if (points.length < 10) return 0;
  
  // Look for three main corners/peaks
  return 0.3; // Basic triangle detection
}

function detectRectangle(points: Point[], boundingBox: { width: number; height: number }): number {
  const { width, height } = boundingBox;
  
  // Rectangle should NOT have similar width and height (that's a square)
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  if (aspectRatio > 0.8) return 0; // Too square-like

  return (1 - aspectRatio) * 0.7; // Higher confidence for more rectangular shapes
}

function detectLine(points: Point[], boundingBox: { width: number; height: number }): number {
  const { width, height } = boundingBox;
  
  // Line should be very thin in one dimension
  const aspectRatio = Math.min(width, height) / Math.max(width, height);
  if (aspectRatio > 0.2) return 0;

  return (1 - aspectRatio) * 0.9; // High confidence for very thin shapes
}

// Helper function for backward compatibility
export function detectShapeFromPoints(points: Point[]): ShapeDetectionResult | null {
  const mockPath: DrawingPath = {
    id: 'detection-path',
    points,
    color: '#000000',
    width: 2,
    timestamp: Date.now(),
  };
  
  return detectShape([mockPath]);
}