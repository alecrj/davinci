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
    | 'line' 
    | 'squiggle' 
    | 'spiral' 
    | 'star'
    | 'heart'
    | 'unknown';
  
  export interface DrawingShape {
    type: ShapeType;
    confidence: number; // 0-1
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    center: Point;
    paths: DrawingPath[];
  }
  
  export interface TransformationFrame {
    paths: DrawingPath[];
    duration: number;
    description: string;
  }
  
  export interface ShapeTransformation {
    from: ShapeType;
    to: string; // What it becomes (e.g., "smiley face", "sun", "flower")
    frames: TransformationFrame[];
    celebrationText: string;
  }