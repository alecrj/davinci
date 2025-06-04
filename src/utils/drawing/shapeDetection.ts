import { Point, DetectedShape, ShapeType } from '@/types/drawing';

// ✅ FIXED: Proper bounding box interface with x, y properties
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate bounding box for a set of points
 */
function calculateBoundingBox(points: Point[]): BoundingBox {
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

/**
 * Calculate distance between two points
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Check if shape is approximately circular
 */
function isCircular(points: Point[], boundingBox: BoundingBox): boolean {
  const { x, y, width, height } = boundingBox;
  
  // ✅ FIXED: Use x, y properties from boundingBox
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const expectedRadius = Math.min(width, height) / 2;
  
  // Check if points are roughly equidistant from center
  const toleranceFactor = 0.3;
  let validPoints = 0;
  
  for (const point of points) {
    const dist = distance(point, { x: centerX, y: centerY });
    const deviation = Math.abs(dist - expectedRadius) / expectedRadius;
    
    if (deviation <= toleranceFactor) {
      validPoints++;
    }
  }
  
  // Require at least 60% of points to be valid for circle detection
  return validPoints / points.length >= 0.6;
}

/**
 * Check if shape is approximately rectangular
 */
function isRectangular(points: Point[], boundingBox: BoundingBox): boolean {
  const { width, height } = boundingBox;
  
  // Check aspect ratio (avoid perfect squares for now)
  const aspectRatio = width / height;
  if (aspectRatio > 0.8 && aspectRatio < 1.2) {
    return false; // Likely a square
  }
  
  // Check if points are mostly along the perimeter
  // This is a simplified check - could be enhanced
  return points.length > 10 && width > 30 && height > 20;
}

/**
 * Check if shape is approximately square
 */
function isSquare(points: Point[], boundingBox: BoundingBox): boolean {
  const { width, height } = boundingBox;
  
  // Check if dimensions are roughly equal
  const aspectRatio = width / height;
  return aspectRatio > 0.8 && aspectRatio < 1.2 && width > 20 && height > 20;
}

/**
 * Check if shape is approximately triangular
 */
function isTriangular(points: Point[]): boolean {
  // Simplified triangle detection
  // Look for three distinct peak points
  if (points.length < 6) return false;
  
  // This is a basic implementation - could be enhanced with corner detection
  const boundingBox = calculateBoundingBox(points);
  const { width, height } = boundingBox;
  
  return width > 20 && height > 20 && points.length > 8 && points.length < 50;
}

/**
 * Check if shape is approximately linear
 */
function isLinear(points: Point[], boundingBox: BoundingBox): boolean {
  const { width, height } = boundingBox;
  
  // Check if one dimension is much larger than the other
  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  return aspectRatio > 3 && points.length > 5;
}

/**
 * Detect the shape type from a series of points
 */
export function detectShape(points: Point[]): DetectedShape | null {
  if (points.length < 3) {
    return null;
  }

  const boundingBox = calculateBoundingBox(points);
  const { width, height } = boundingBox;
  
  // Skip very small drawings
  if (width < 10 || height < 10) {
    return null;
  }

  let shapeType: ShapeType = 'unknown';
  let confidence = 0;

  // Check for circle first (most specific)
  if (isCircular(points, boundingBox)) {
    shapeType = 'circle';
    confidence = 0.8;
  }
  // Check for square
  else if (isSquare(points, boundingBox)) {
    shapeType = 'square';
    confidence = 0.75;
  }
  // Check for rectangle
  else if (isRectangular(points, boundingBox)) {
    shapeType = 'rectangle';
    confidence = 0.7;
  }
  // Check for triangle
  else if (isTriangular(points)) {
    shapeType = 'triangle';
    confidence = 0.65;
  }
  // Check for line
  else if (isLinear(points, boundingBox)) {
    shapeType = 'line';
    confidence = 0.6;
  }

  // Only return detection if confidence is above threshold
  if (confidence > 0.5) {
    return {
      type: shapeType,
      confidence,
      boundingBox,
      pointCount: points.length, // ✅ FIXED: Include pointCount property
    };
  }

  return null;
}

/**
 * Enhanced shape detection with multiple algorithms
 */
export function detectShapeAdvanced(points: Point[]): DetectedShape | null {
  // Use the basic detection for now
  // This can be enhanced with more sophisticated algorithms
  return detectShape(points);
}

/**
 * Get shape detection feedback message
 */
export function getShapeDetectionMessage(shape: DetectedShape): string {
  const confidence = Math.round(shape.confidence * 100);
  
  switch (shape.type) {
    case 'circle':
      return `Great circle! ${confidence}% match`;
    case 'square':
      return `Nice square! ${confidence}% match`;
    case 'rectangle':
      return `Good rectangle! ${confidence}% match`;
    case 'triangle':
      return `Excellent triangle! ${confidence}% match`;
    case 'line':
      return `Straight line detected! ${confidence}% match`;
    default:
      return `Shape detected! ${confidence}% confidence`;
  }
}

/**
 * Check if two shapes are similar
 */
export function areShapesSimilar(shape1: DetectedShape, shape2: DetectedShape): boolean {
  if (shape1.type !== shape2.type) {
    return false;
  }
  
  // Compare bounding box similarity
  const box1 = shape1.boundingBox;
  const box2 = shape2.boundingBox;
  
  const widthRatio = Math.min(box1.width, box2.width) / Math.max(box1.width, box2.width);
  const heightRatio = Math.min(box1.height, box2.height) / Math.max(box1.height, box2.height);
  
  // Shapes are similar if dimensions are within 20% of each other
  return widthRatio > 0.8 && heightRatio > 0.8;
}

export default {
  detectShape,
  detectShapeAdvanced,
  getShapeDetectionMessage,
  areShapesSimilar,
};