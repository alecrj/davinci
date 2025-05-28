import { Point, DrawingPath, DrawingShape, ShapeType } from '@/types/drawing';

export function detectShape(paths: DrawingPath[]): DrawingShape | null {
  if (paths.length === 0) return null;
  
  // Combine all paths into one set of points
  const allPoints: Point[] = paths.flatMap(path => path.points);
  
  if (allPoints.length < 10) return null;
  
  // Calculate bounding box
  const boundingBox = calculateBoundingBox(allPoints);
  const center = calculateCenter(allPoints);
  
  // Detect shape type
  const shapeDetectors = [
    { detector: isCircle, type: 'circle' as ShapeType },
    { detector: isSquare, type: 'square' as ShapeType },
    { detector: isTriangle, type: 'triangle' as ShapeType },
    { detector: isLine, type: 'line' as ShapeType },
    { detector: isStar, type: 'star' as ShapeType },
    { detector: isHeart, type: 'heart' as ShapeType },
    { detector: isSpiral, type: 'spiral' as ShapeType },
  ];
  
  for (const { detector, type } of shapeDetectors) {
    const confidence = detector(allPoints, boundingBox, center);
    if (confidence > 0.6) {
      return {
        type,
        confidence,
        boundingBox,
        center,
        paths,
      };
    }
  }
  
  // Default to squiggle if no specific shape detected
  return {
    type: 'squiggle',
    confidence: 0.8,
    boundingBox,
    center,
    paths,
  };
}

function calculateBoundingBox(points: Point[]) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function calculateCenter(points: Point[]): Point {
  const sum = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

function isCircle(points: Point[], boundingBox: any, center: Point): number {
  // Calculate average distance from center
  const distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
  );
  
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
  
  // Check if width and height are similar (circular)
  const aspectRatio = boundingBox.width / boundingBox.height;
  const isSquareish = aspectRatio > 0.8 && aspectRatio < 1.2;
  
  // Low variance and square aspect ratio indicates circle
  const normalizedVariance = variance / (avgDistance * avgDistance);
  
  if (isSquareish && normalizedVariance < 0.15) {
    return 1 - normalizedVariance;
  }
  
  return 0;
}

function isSquare(points: Point[], boundingBox: any, center: Point): number {
  // Check for 4 corners
  const corners = findCorners(points);
  
  if (corners.length !== 4) return 0;
  
  // Check if corners form a rectangle
  const aspectRatio = boundingBox.width / boundingBox.height;
  const isSquareish = aspectRatio > 0.8 && aspectRatio < 1.2;
  
  // Check if sides are roughly straight
  const straightness = calculateStraightness(points, corners);
  
  if (isSquareish && straightness > 0.7) {
    return straightness;
  }
  
  return 0;
}

function isTriangle(points: Point[], boundingBox: any, center: Point): number {
  const corners = findCorners(points);
  
  if (corners.length !== 3) return 0;
  
  const straightness = calculateStraightness(points, corners);
  
  if (straightness > 0.7) {
    return straightness;
  }
  
  return 0;
}

function isLine(points: Point[], boundingBox: any, center: Point): number {
  // Calculate line fit using least squares
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = points.reduce((sum, p) => {
    const yPredicted = slope * p.x + intercept;
    return sum + Math.pow(p.y - yPredicted, 2);
  }, 0);
  
  const rSquared = 1 - (ssResidual / ssTotal);
  
  // High R-squared indicates a line
  if (rSquared > 0.8) {
    return rSquared;
  }
  
  return 0;
}

function isStar(points: Point[], boundingBox: any, center: Point): number {
  const corners = findCorners(points);
  
  if (corners.length >= 5 && corners.length <= 10) {
    // Check for alternating distances from center (star pattern)
    const distances = corners.map(c => 
      Math.sqrt(Math.pow(c.x - center.x, 2) + Math.pow(c.y - center.y, 2))
    );
    
    let alternating = true;
    for (let i = 0; i < distances.length - 2; i++) {
      const d1 = distances[i];
      const d2 = distances[i + 1];
      const d3 = distances[i + 2];
      
      if (!((d1 > d2 && d3 > d2) || (d1 < d2 && d3 < d2))) {
        alternating = false;
        break;
      }
    }
    
    if (alternating) {
      return 0.8;
    }
  }
  
  return 0;
}

function isHeart(points: Point[], boundingBox: any, center: Point): number {
  // Simple heart detection: check for two bumps at top and point at bottom
  const topPoints = points.filter(p => p.y < center.y);
  const bottomPoints = points.filter(p => p.y > center.y);
  
  if (topPoints.length > points.length * 0.4 && bottomPoints.length > points.length * 0.3) {
    // Check for two peaks in top half
    const leftTop = topPoints.filter(p => p.x < center.x);
    const rightTop = topPoints.filter(p => p.x > center.x);
    
    if (leftTop.length > 10 && rightTop.length > 10) {
      // Check for single point at bottom
      const bottomCenter = bottomPoints.filter(p => 
        Math.abs(p.x - center.x) < boundingBox.width * 0.2
      );
      
      if (bottomCenter.length > bottomPoints.length * 0.3) {
        return 0.7;
      }
    }
  }
  
  return 0;
}

function isSpiral(points: Point[], boundingBox: any, center: Point): number {
  // Check if distance from center increases over time
  const distances = points.map(p => 
    Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
  );
  
  let increasingCount = 0;
  for (let i = 1; i < distances.length; i++) {
    if (distances[i] > distances[i - 1]) {
      increasingCount++;
    }
  }
  
  const increasingRatio = increasingCount / (distances.length - 1);
  
  if (increasingRatio > 0.6) {
    return increasingRatio;
  }
  
  return 0;
}

// Helper functions
function findCorners(points: Point[]): Point[] {
  const corners: Point[] = [];
  const angleThreshold = 45; // degrees
  
  for (let i = 5; i < points.length - 5; i++) {
    const p1 = points[i - 5];
    const p2 = points[i];
    const p3 = points[i + 5];
    
    const angle = calculateAngle(p1, p2, p3);
    
    if (angle < angleThreshold) {
      corners.push(p2);
    }
  }
  
  return corners;
}

function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const a = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  const b = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
  const c = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
  
  const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
  return (angle * 180) / Math.PI;
}

function calculateStraightness(points: Point[], corners: Point[]): number {
  // Calculate how straight the lines are between corners
  let totalStraightness = 0;
  
  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    
    // Find points between these corners
    const segmentPoints = points.filter(p => {
      // Simple distance-based filtering
      const distToStart = Math.sqrt(Math.pow(p.x - start.x, 2) + Math.pow(p.y - start.y, 2));
      const distToEnd = Math.sqrt(Math.pow(p.x - end.x, 2) + Math.pow(p.y - end.y, 2));
      const totalDist = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
      
      return distToStart + distToEnd < totalDist * 1.2;
    });
    
    if (segmentPoints.length > 0) {
      // Calculate average distance from line
      const distances = segmentPoints.map(p => {
        return distanceToLine(p, start, end);
      });
      
      const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
      const lineLength = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
      
      const straightness = 1 - (avgDistance / lineLength);
      totalStraightness += Math.max(0, straightness);
    }
  }
  
  return totalStraightness / corners.length;
}

function distanceToLine(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
  let xx, yy;
  
  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }
  
  const dx = point.x - xx;
  const dy = point.y - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
}