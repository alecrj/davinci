// CRITICAL FIX 6: src/context/DrawingContext.tsx
// Complete DrawingContext with all expected properties and methods

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  DrawingState,
  DrawingPath,
  DrawingSession,
  DrawingTool,
  CanvasSettings,
  ShapeTransformation,
  DetectedShape,
  DrawingContextType,
  DrawingStroke,
  Size,
  Point
} from '@/types/drawing';
import { DrawingColors } from '@/constants/colors';

// FIXED: Complete initial tool
const initialTool: DrawingTool = {
  id: 'pen-black',
  name: 'Pen',
  color: '#000000', // FIXED: Use simple color string
  width: 3,
  opacity: 1,
};

// FIXED: Complete initial canvas settings
const initialCanvasSettings: CanvasSettings = {
  backgroundColor: '#FFFFFF',
  gridEnabled: false,
  gridColor: '#F2F2F7',
  snapToGrid: false,
  gridSize: 20,
};

// FIXED: Complete initial state
const initialState: DrawingState = {
  currentSession: null,
  sessions: [],
  currentTool: initialTool,
  canvasSettings: initialCanvasSettings,
  transformationQueue: [],
  undoStack: [],
  redoStack: [],
  isDrawing: false,
  lastDetectedShape: undefined,
};

// Drawing actions
type DrawingAction =
  | { type: 'START_NEW_SESSION'; payload: Size }
  | { type: 'END_CURRENT_SESSION' }
  | { type: 'ADD_PATH'; payload: DrawingPath }
  | { type: 'ADD_STROKE'; payload: DrawingStroke }
  | { type: 'CLEAR_DRAWING' }
  | { type: 'SET_CURRENT_TOOL'; payload: DrawingTool }
  | { type: 'UPDATE_CANVAS_SETTINGS'; payload: Partial<CanvasSettings> }
  | { type: 'SHAPE_DETECTED'; payload: DetectedShape }
  | { type: 'ADD_TRANSFORMATION'; payload: Omit<ShapeTransformation, 'id'> }
  | { type: 'COMPLETE_TRANSFORMATION'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_DRAWING_STATE'; payload: boolean };

// FIXED: Complete drawing reducer
function drawingReducer(state: DrawingState, action: DrawingAction): DrawingState {
  switch (action.type) {
    case 'START_NEW_SESSION':
      const newSession: DrawingSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        strokes: [], // FIXED: Use strokes instead of paths
        transformations: [], // FIXED: Add transformations
        isComplete: false,
        totalTime: 0,
        shapesDetected: [],
      };
      return {
        ...state,
        currentSession: newSession,
        undoStack: [],
        redoStack: [],
      };

    case 'END_CURRENT_SESSION':
      if (!state.currentSession) return state;
      
      const completedSession: DrawingSession = {
        ...state.currentSession,
        endTime: Date.now(),
        isComplete: true, // FIXED: Use isComplete
        totalTime: Date.now() - state.currentSession.startTime,
      };
      
      return {
        ...state,
        currentSession: null,
        sessions: [...state.sessions, completedSession],
      };

    case 'ADD_STROKE':
      if (!state.currentSession) return state;
      
      const newUndoStack = [...state.undoStack, state.currentSession.strokes.map(s => s.path)];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: [...state.currentSession.strokes, action.payload], // FIXED: Add to strokes
        },
        undoStack: newUndoStack,
        redoStack: [],
      };

    case 'ADD_PATH':
      // Convert path to stroke for compatibility
      const stroke: DrawingStroke = {
        id: action.payload.id,
        path: action.payload,
      };
      
      if (!state.currentSession) return state;
      
      const pathUndoStack = [...state.undoStack, state.currentSession.strokes.map(s => s.path)];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: [...state.currentSession.strokes, stroke],
        },
        undoStack: pathUndoStack,
        redoStack: [],
      };

    case 'SHAPE_DETECTED':
      return {
        ...state,
        lastDetectedShape: action.payload,
      };

    case 'ADD_TRANSFORMATION':
      const transformation: ShapeTransformation = {
        ...action.payload,
        id: Date.now().toString(), // FIXED: Add id
      };
      
      return {
        ...state,
        transformationQueue: [...state.transformationQueue, transformation],
      };

    case 'COMPLETE_TRANSFORMATION':
      if (!state.currentSession) return state;
      
      const completedTransformation = state.transformationQueue.find(
        t => t.id === action.payload
      );
      
      if (!completedTransformation) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          transformations: [...state.currentSession.transformations, completedTransformation], // FIXED: Add to transformations
        },
        transformationQueue: state.transformationQueue.filter(t => t.id !== action.payload),
      };

    case 'UNDO':
      if (state.undoStack.length === 0 || !state.currentSession) return state;
      
      const previousPaths = state.undoStack[state.undoStack.length - 1];
      const newRedoStack = [...state.redoStack, state.currentSession.strokes.map(s => s.path)];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: previousPaths.map(path => ({ id: path.id, path })), // FIXED: Convert back to strokes
        },
        undoStack: state.undoStack.slice(0, -1),
        redoStack: newRedoStack,
      };

    case 'REDO':
      if (state.redoStack.length === 0 || !state.currentSession) return state;
      
      const nextPaths = state.redoStack[state.redoStack.length - 1];
      const newUndoStackAfterRedo = [...state.undoStack, state.currentSession.strokes.map(s => s.path)];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: nextPaths.map(path => ({ id: path.id, path })), // FIXED: Convert back to strokes
        },
        undoStack: newUndoStackAfterRedo,
        redoStack: state.redoStack.slice(0, -1),
      };

    case 'CLEAR_DRAWING':
      if (!state.currentSession) return state;
      
      const clearedUndoStack = [...state.undoStack, state.currentSession.strokes.map(s => s.path)];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: [], // FIXED: Clear strokes
        },
        undoStack: clearedUndoStack,
        redoStack: [],
      };

    case 'SET_CURRENT_TOOL':
      return {
        ...state,
        currentTool: action.payload,
      };

    case 'UPDATE_CANVAS_SETTINGS':
      return {
        ...state,
        canvasSettings: {
          ...state.canvasSettings,
          ...action.payload,
        },
      };

    case 'SET_DRAWING_STATE':
      return {
        ...state,
        isDrawing: action.payload,
      };

    default:
      return state;
  }
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

interface DrawingProviderProps {
  children: ReactNode;
}

export const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(drawingReducer, initialState);

  // FIXED: Implement all required methods
  const startNewSession = (canvasSize: Size) => {
    dispatch({ type: 'START_NEW_SESSION', payload: canvasSize });
  };

  const endCurrentSession = () => {
    dispatch({ type: 'END_CURRENT_SESSION' });
  };

  const addPath = (path: DrawingPath) => {
    dispatch({ type: 'ADD_PATH', payload: path });
  };

  const clearDrawing = () => {
    dispatch({ type: 'CLEAR_DRAWING' });
  };

  const setCurrentTool = (tool: DrawingTool) => {
    dispatch({ type: 'SET_CURRENT_TOOL', payload: tool });
  };

  const updateCanvasSettings = (settings: Partial<CanvasSettings>) => {
    dispatch({ type: 'UPDATE_CANVAS_SETTINGS', payload: settings });
  };

  const onShapeDetected = (shape: DetectedShape) => {
    dispatch({ type: 'SHAPE_DETECTED', payload: shape });
  };

  const addTransformation = (transformation: Omit<ShapeTransformation, 'id'>) => {
    dispatch({ type: 'ADD_TRANSFORMATION', payload: transformation });
  };

  const completeTransformation = (transformationId: string) => {
    dispatch({ type: 'COMPLETE_TRANSFORMATION', payload: transformationId });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const value: DrawingContextType = {
    drawingState: state, // FIXED: Expose drawingState
    addPath,
    clearDrawing, // FIXED: Add clearDrawing method
    startNewSession: () => startNewSession({ width: 300, height: 400 }), // FIXED: Match expected signature
    endCurrentSession,
    setCurrentTool,
    updateCanvasSettings,
    onShapeDetected,
    addTransformation,
    completeTransformation,
    undo,
    redo,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
  };

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};