import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Point, DrawingPath, DrawingStroke, DetectedShape, DrawingTool } from '@/types/drawing';
import { detectShape } from '@/utils/drawing/shapeDetection';

// ✅ FIXED: DrawingTool interface with ALL required properties
interface DrawingToolWithName extends DrawingTool {
  name: string;
  size: number; // ✅ FIXED: Added missing size property
}

// ✅ FIXED: Drawing state with proper null initialization and consistent types
interface DrawingState {
  isDrawing: boolean;
  currentTool: DrawingToolWithName;
  brushSize: number;
  color: string;
  opacity: number;
  strokes: DrawingStroke[];
  currentPath: Point[];
  undoStack: DrawingPath[][];
  redoStack: DrawingPath[][];
  lastDetectedShape: DetectedShape | null;
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
}

// ✅ FIXED: Actions with proper typing
type DrawingAction =
  | { type: 'START_DRAWING'; payload: { point: Point } }
  | { type: 'ADD_POINT'; payload: { point: Point } }
  | { type: 'END_DRAWING' }
  | { type: 'CHANGE_TOOL'; payload: { tool: DrawingToolWithName } }
  | { type: 'CHANGE_BRUSH_SIZE'; payload: { size: number } }
  | { type: 'CHANGE_COLOR'; payload: { color: string } }
  | { type: 'CHANGE_OPACITY'; payload: { opacity: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'SET_DETECTED_SHAPE'; payload: { shape: DetectedShape | null } }
  | { type: 'SET_PROCESSING'; payload: { isProcessing: boolean } };

// ✅ FIXED: Initial state with ALL required properties
const initialState: DrawingState = {
  isDrawing: false,
  currentTool: {
    id: 'pen',
    name: 'Pen',
    type: 'pen',
    size: 5,     // ✅ FIXED: Added size property
    opacity: 1,
    color: '#000000',
  },
  brushSize: 5,
  color: '#000000',
  opacity: 1,
  strokes: [],
  currentPath: [],
  undoStack: [],
  redoStack: [],
  lastDetectedShape: null,
  canUndo: false,
  canRedo: false,
  isProcessing: false,
};

// ✅ FIXED: Reducer with proper type handling for undo/redo stacks
function drawingReducer(state: DrawingState, action: DrawingAction): DrawingState {
  switch (action.type) {
    case 'START_DRAWING':
      return {
        ...state,
        isDrawing: true,
        currentPath: [action.payload.point],
        redoStack: [], // Clear redo stack when starting new drawing
      };

    case 'ADD_POINT':
      if (!state.isDrawing) return state;
      return {
        ...state,
        currentPath: [...state.currentPath, action.payload.point],
      };

    case 'END_DRAWING': {
      if (!state.isDrawing || state.currentPath.length === 0) return state;

      // Create new stroke
      const newStroke: DrawingStroke = {
        id: Date.now().toString(),
        path: {
          id: Date.now().toString(),
          points: [...state.currentPath],
          color: state.color,
          width: state.brushSize,
          timestamp: Date.now(),
        },
      };

      // ✅ FIXED: Convert strokes to DrawingPath[] for undo stack
      const currentPaths: DrawingPath[] = state.strokes.map(stroke => stroke.path);
      const newUndoStack = [...state.undoStack, currentPaths];

      // Detect shape in current path
      const detectedShape = detectShape(state.currentPath);

      return {
        ...state,
        isDrawing: false,
        strokes: [...state.strokes, newStroke],
        currentPath: [],
        undoStack: newUndoStack,
        canUndo: true,
        lastDetectedShape: detectedShape,
      };
    }

    case 'UNDO': {
      if (!state.canUndo || state.undoStack.length === 0) return state;

      const previousPaths = state.undoStack[state.undoStack.length - 1];
      const pathUndoStack = state.undoStack.slice(0, -1);

      // ✅ FIXED: Convert DrawingPath[] back to DrawingStroke[] properly
      const restoredStrokes: DrawingStroke[] = previousPaths.map(path => ({
        id: path.id,
        path: path,
      }));

      // ✅ FIXED: Add current state to redo stack as DrawingPath[]
      const currentPaths: DrawingPath[] = state.strokes.map(stroke => stroke.path);
      const newRedoStack = [...state.redoStack, currentPaths];

      return {
        ...state,
        strokes: restoredStrokes,
        undoStack: pathUndoStack,
        redoStack: newRedoStack,
        canUndo: pathUndoStack.length > 0,
        canRedo: true,
      };
    }

    case 'REDO': {
      if (!state.canRedo || state.redoStack.length === 0) return state;

      const nextPaths = state.redoStack[state.redoStack.length - 1];
      const newRedoStack = state.redoStack.slice(0, -1);

      // ✅ FIXED: Convert DrawingPath[] back to DrawingStroke[] properly  
      const restoredStrokes: DrawingStroke[] = nextPaths.map(path => ({
        id: path.id,
        path: path,
      }));

      // ✅ FIXED: Add current state to undo stack as DrawingPath[]
      const currentPaths: DrawingPath[] = state.strokes.map(stroke => stroke.path);
      const newUndoStackAfterRedo = [...state.undoStack, currentPaths];

      return {
        ...state,
        strokes: restoredStrokes,
        redoStack: newRedoStack,
        undoStack: newUndoStackAfterRedo,
        canUndo: true,
        canRedo: newRedoStack.length > 0,
      };
    }

    case 'CLEAR_CANVAS': {
      // ✅ FIXED: Add current state to undo stack before clearing
      const currentPaths: DrawingPath[] = state.strokes.map(stroke => stroke.path);
      const clearedUndoStack = state.strokes.length > 0 
        ? [...state.undoStack, currentPaths] 
        : state.undoStack;

      return {
        ...state,
        strokes: [],
        currentPath: [],
        undoStack: clearedUndoStack,
        canUndo: clearedUndoStack.length > 0,
        redoStack: [],
        canRedo: false,
        lastDetectedShape: null,
      };
    }

    case 'CHANGE_TOOL':
      return {
        ...state,
        currentTool: action.payload.tool,
        brushSize: action.payload.tool.size, // ✅ FIXED: Use size property from tool
        color: action.payload.tool.color,
        opacity: action.payload.tool.opacity,
      };

    case 'CHANGE_BRUSH_SIZE':
      return {
        ...state,
        brushSize: action.payload.size,
        currentTool: {
          ...state.currentTool,
          size: action.payload.size, // ✅ FIXED: Update tool size property
        },
      };

    case 'CHANGE_COLOR':
      return {
        ...state,
        color: action.payload.color,
        currentTool: {
          ...state.currentTool,
          color: action.payload.color,
        },
      };

    case 'CHANGE_OPACITY':
      return {
        ...state,
        opacity: action.payload.opacity,
        currentTool: {
          ...state.currentTool,
          opacity: action.payload.opacity,
        },
      };

    case 'SET_DETECTED_SHAPE':
      return {
        ...state,
        lastDetectedShape: action.payload.shape,
      };

    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload.isProcessing,
      };

    default:
      return state;
  }
}

// Context creation
interface DrawingContextType {
  state: DrawingState;
  startDrawing: (point: Point) => void;
  addPoint: (point: Point) => void;
  endDrawing: () => void;
  changeTool: (tool: DrawingToolWithName) => void;
  changeBrushSize: (size: number) => void;
  changeColor: (color: string) => void;
  changeOpacity: (opacity: number) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  setDetectedShape: (shape: DetectedShape | null) => void;
  setProcessing: (isProcessing: boolean) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

// Provider component
interface DrawingProviderProps {
  children: ReactNode;
}

export const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(drawingReducer, initialState);

  const contextValue: DrawingContextType = {
    state,
    startDrawing: (point: Point) => dispatch({ type: 'START_DRAWING', payload: { point } }),
    addPoint: (point: Point) => dispatch({ type: 'ADD_POINT', payload: { point } }),
    endDrawing: () => dispatch({ type: 'END_DRAWING' }),
    changeTool: (tool: DrawingToolWithName) => dispatch({ type: 'CHANGE_TOOL', payload: { tool } }),
    changeBrushSize: (size: number) => dispatch({ type: 'CHANGE_BRUSH_SIZE', payload: { size } }),
    changeColor: (color: string) => dispatch({ type: 'CHANGE_COLOR', payload: { color } }),
    changeOpacity: (opacity: number) => dispatch({ type: 'CHANGE_OPACITY', payload: { opacity } }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    clearCanvas: () => dispatch({ type: 'CLEAR_CANVAS' }),
    setDetectedShape: (shape: DetectedShape | null) => dispatch({ type: 'SET_DETECTED_SHAPE', payload: { shape } }),
    setProcessing: (isProcessing: boolean) => dispatch({ type: 'SET_PROCESSING', payload: { isProcessing } }),
  };

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

// Hook to use drawing context
export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

export default DrawingContext;