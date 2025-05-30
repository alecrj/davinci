import { DrawingPath, DrawingShape, ShapeType, Point } from '@/types/drawing';

/**
 * Advanced shape detection using geometric analysis
 * This is the core AI that recognizes what users draw
 */

export function detectShape(paths: DrawingPath[]): DrawingShape | null {
  if (!paths || paths.length === 0) return null;
  
  // Combine all points from all paths
  const allPoints = paths.flatMap(path => path.points);
  if (allPoints.length < 5) return null;
  
  // Calculate bounding box
  const boundingBox = calculateBoundingBox(allPoints);
  const center = {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
  
  // Try different shape detection algorithms
  const shapeTests = [
    () => detectCircle(allPoints, boundingBox),
    () => detectSquare(allPoints, boundingBox),
    () => detectTriangle(allPoints, boundingBox),
    () => detectStar(allPoints, boundingBox),
    () => detectHeart(allPoints, boundingBox),
    () => detectSpiral(allPoints, boundingBox),
    () => detectLine(allPoints, boundingBox),
  ];
  
  let bestMatch: { type: ShapeType; confidence: number } | null = null;
  
  for (const test of shapeTests) {
    const result = test();
    if (result && result.confidence > 0.6) {
      if (!bestMatch || result.confidence > bestMatch.confidence) {
        bestMatch = result;
      }
    }
  }
  
  // If no good match, classify as squiggle
  if (!bestMatch) {
    bestMatch = { type: 'squiggle', confidence: 0.5 };
  }
  
  return {
    type: bestMatch.type,
    confidence: bestMatch.confidence,
    boundingBox,
    center,
    paths,
  };
}

function calculateBoundingBox(points: Point[]) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function detectCircle(points: Point[], boundingBox: any) {
  const center = {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
  
  // Calculate average radius
  const avgRadius = (boundingBox.width + boundingBox.height) / 4;
  
  // Check how many points are close to the circle
  let closePoints = 0;
  for (const point of points) {
    const distance = Math.sqrt(
      Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)
    );
    const radiusDiff = Math.abs(distance - avgRadius) / avgRadius;
    if (radiusDiff < 0.3) closePoints++;
  }
  
  const confidence = closePoints / points.length;
  const aspectRatio = boundingBox.width / boundingBox.height;
  const roundnessBonus = 1 - Math.abs(1 - aspectRatio);
  
  return {
    type: 'circle' as ShapeType,
    confidence: confidence * 0.7 + roundnessBonus * 0.3,
  };
}

function detectSquare(points: Point[], boundingBox: any) {
  const aspectRatio = boundingBox.width / boundingBox.height;
  const isSquareish = Math.abs(1 - aspectRatio) < 0.3;
  
  // Check for corners (abrupt direction changes)
  const corners = findCorners(points);
  const hasEnoughCorners = corners >= 3;
  
  // Check if points roughly follow rectangle perimeter
  const perimeterPoints = getPerimeterPoints(points, boundingBox);
  const confidence = perimeterPoints * (isSquareish ? 1.2 : 0.8) * (hasEnoughCorners ? 1.1 : 0.7);
  
  return {
    type: 'square' as ShapeType,
    confidence: Math.min(confidence, 1.0),
  };
}

function detectTriangle(points: Point[], boundingBox: any) {
  const corners = findCorners(points);
  const hasThreeCorners = corners >= 2 && corners <= 4;
  
  // Check for triangular shape
  const aspectRatio = boundingBox.height / boundingBox.width;
  const isTriangular = aspectRatio > 0.6 && aspectRatio < 1.5;
  
  const confidence = (hasThreeCorners ? 0.6 : 0.3) + (isTriangular ? 0.4 : 0.2);
  
  return {
    type: 'triangle' as ShapeType,
    confidence,
  };
}

function detectStar(points: Point[], boundingBox: any) {
  const corners = findCorners(points);
  const hasManyCorners = corners >= 5;
  
  // Stars tend to have many direction changes
  const confidence = hasManyCorners ? 0.7 : 0.3;
  
  return {
    type: 'star' as ShapeType,
    confidence,
  };
}

function detectHeart(points: Point[], boundingBox: any) {
  // Hearts have a distinctive shape - wider at top, pointed at bottom
  const aspectRatio = boundingBox.height / boundingBox.width;
  const isHeartProportions = aspectRatio > 0.8 && aspectRatio < 1.3;
  
  // Look for curves in upper half
  const upperPoints = points.filter(p => p.y < boundingBox.y + boundingBox.height * 0.6);
  const curves = detectCurvature(upperPoints);
  
  const confidence = (isHeartProportions ? 0.4 : 0.2) + (curves > 0.3 ? 0.5 : 0.2);
  
  return {
    type: 'heart' as ShapeType,
    confidence,
  };
}

function detectSpiral(points: Point[], boundingBox: any) {
  if (points.length < 20) return { type: 'spiral' as ShapeType, confidence: 0.1 };
  
  // Check for increasing/decreasing radius pattern
  const center = {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
  
  let radiusPattern = 0;
  for (let i = 10; i < points.length - 10; i++) {
    const prevRadius = Math.sqrt(
      Math.pow(points[i-10].x - center.x, 2) + Math.pow(points[i-10].y - center.y, 2)
    );
    const currRadius = Math.sqrt(
      Math.pow(points[i].x - center.x, 2) + Math.pow(points[i].y - center.y, 2)
    );
    const nextRadius = Math.sqrt(
      Math.pow(points[i+10].x - center.x, 2) + Math.pow(points[i+10].y - center.y, 2)
    );
    
    if ((currRadius > prevRadius && nextRadius > currRadius) ||
        (currRadius < prevRadius && nextRadius < currRadius)) {
      radiusPattern++;
    }
  }
  
  const confidence = radiusPattern / (points.length - 20);
  
  return {
    type: 'spiral' as ShapeType,
    confidence: Math.min(confidence * 2, 1.0),
  };
}

function detectLine(points: Point[], boundingBox: any) {
  // Lines are thin and straight
  const aspectRatio = Math.max(boundingBox.width, boundingBox.height) / 
                     Math.min(boundingBox.width, boundingBox.height);
  const isThin = aspectRatio > 4;
  
  // Check straightness
  const straightness = calculateStraightness(points);
  
  const confidence = (isThin ? 0.6 : 0.3) + (straightness * 0.4);
  
  return {
    type: 'line' as ShapeType,
    confidence,
  };
}

// Helper functions
function findCorners(points: Point[]): number {
  if (points.length < 10) return 0;
  
  let corners = 0;
  const threshold = 45; // degrees
  
  for (let i = 5; i < points.length - 5; i++) {
    const angle1 = calculateAngle(points[i-5], points[i]);
    const angle2 = calculateAngle(points[i], points[i+5]);
    const angleDiff = Math.abs(angle1 - angle2);
    
    if (angleDiff > threshold && angleDiff < 360 - threshold) {
      corners++;
    }
  }
  
  return corners;
}

function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function getPerimeterPoints(points: Point[], boundingBox: any): number {
  const margin = Math.min(boundingBox.width, boundingBox.height) * 0.1;
  let perimeterPoints = 0;
  
  for (const point of points) {
    const nearLeft = Math.abs(point.x - boundingBox.x) < margin;
    const nearRight = Math.abs(point.x - (boundingBox.x + boundingBox.width)) < margin;
    const nearTop = Math.abs(point.y - boundingBox.y) < margin;
    const nearBottom = Math.abs(point.y - (boundingBox.y + boundingBox.height)) < margin;
    
    if (nearLeft || nearRight || nearTop || nearBottom) {
      perimeterPoints++;
    }
  }
  
  return perimeterPoints / points.length;
}

function detectCurvature(points: Point[]): number {
  if (points.length < 10) return 0;
  
  let curvature = 0;
  for (let i = 5; i < points.length - 5; i++) {
    const p1 = points[i-5];
    const p2 = points[i];
    const p3 = points[i+5];
    
    // Calculate curvature using three points
    const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const b = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));
    const c = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
    
    // Area of triangle
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    
    if (area > 0 && a > 0 && b > 0) {
      curvature += (4 * area) / (a * b * c);
    }
  }
  
  return curvature / (points.length - 10);
}

function calculateStraightness(points: Point[]): number {
  if (points.length < 3) return 1;
  
  const start = points[0];
  const end = points[points.length - 1];
  const lineLength = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  let totalDeviation = 0;
  for (const point of points) {
    const deviation = distanceToLine(start, end, point);
    totalDeviation += deviation;
  }
  
  const avgDeviation = totalDeviation / points.length;
  return Math.max(0, 1 - (avgDeviation / lineLength));
}

function distanceToLine(lineStart: Point, lineEnd: Point, point: Point): number {
  const A = lineEnd.y - lineStart.y;
  const B = lineStart.x - lineEnd.x;
  const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
  
  return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
}