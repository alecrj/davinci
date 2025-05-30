/**
 * DaVinci Drawing Context
 * Manages drawing state, shape detection, and transformations
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  DrawingContextType,
  DrawingSession,
  DrawingStroke,
  DrawingTool,
  CanvasSettings,
  DetectedShape,
  ShapeTransformation,
  Point,
  Size,
} from '@/types/drawing';
import { SKILL_LEVELS } from '@/constants/app';
import { DrawingColors } from '@/constants/colors';

// Drawing context state
interface DrawingState {
  currentSession: DrawingSession | null;
  activeTool: DrawingTool;
  canvasSettings: CanvasSettings;
  isDrawing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isDetectionEnabled: boolean;
  detectionSensitivity: number;
  transformationQueue: ShapeTransformation[];
  isTransforming: boolean;
  currentFPS: number;
  frameDrops: number;
  undoStack: DrawingStroke[][];
  redoStack: DrawingStroke[][];
}

// Action types for reducer
type DrawingAction =
  | { type: 'START_SESSION'; payload: { canvasSize: Size } }
  | { type: 'END_SESSION' }
  | { type: 'ADD_STROKE'; payload: DrawingStroke }
  | { type: 'SET_DRAWING'; payload: boolean }
  | { type: 'SET_TOOL'; payload: DrawingTool }
  | { type: 'UPDATE_CANVAS_SETTINGS'; payload: Partial<CanvasSettings> }
  | { type: 'TOGGLE_DETECTION' }
  | { type: 'SET_DETECTION_SENSITIVITY'; payload: number }
  | { type: 'ADD_DETECTED_SHAPE'; payload: DetectedShape }
  | { type: 'QUEUE_TRANSFORMATION'; payload: ShapeTransformation }
  | { type: 'COMPLETE_TRANSFORMATION'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'UPDATE_PERFORMANCE'; payload: { fps: number; frameDrops: number } };

// Default tool configuration
const defaultTool: DrawingTool = {
  type: 'brush',
  color: DrawingColors.brushes[0], // Black
  width: 3,
  opacity: 1,
};

// Default canvas settings
const defaultCanvasSettings: CanvasSettings = {
  backgroundColor: '#FFFFFF',
  showGrid: false,
  showGuides: false,
  snapToGrid: false,
  gridSize: 20,
  zoomLevel: 1,
  maxZoom: 3,
  minZoom: 0.5,
};

// Initial state
const initialState: DrawingState = {
  currentSession: null,
  activeTool: defaultTool,
  canvasSettings: defaultCanvasSettings,
  isDrawing: false,
  canUndo: false,
  canRedo: false,
  isDetectionEnabled: true,
  detectionSensitivity: 0.6,
  transformationQueue: [],
  isTransforming: false,
  currentFPS: 60,
  frameDrops: 0,
  undoStack: [],
  redoStack: [],
};

// Reducer function
const drawingReducer = (state: DrawingState, action: DrawingAction): DrawingState => {
  switch (action.type) {
    case 'START_SESSION':
      const newSession: DrawingSession = {
        id: Date.now().toString(),
        strokes: [],
        detectedShapes: [],
        transformations: [],
        canvasSize: action.payload.canvasSize,
        startTime: Date.now(),
        totalDrawingTime: 0,
        skillLevel: SKILL_LEVELS.BEGINNER,
        isCompleted: false,
      };
      
      return {
        ...state,
        currentSession: newSession,
        undoStack: [],
        redoStack: [],
        canUndo: false,
        canRedo: false,
      };
      
    case 'END_SESSION':
      if (!state.currentSession) return state;
      
      const completedSession: DrawingSession = {
        ...state.currentSession,
        endTime: Date.now(),
        isCompleted: true,
      };
      
      return {
        ...state,
        currentSession: completedSession,
      };
      
    case 'ADD_STROKE':
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        strokes: [...state.currentSession.strokes, action.payload],
      };
      
      // Update undo stack
      const newUndoStack = [...state.undoStack, state.currentSession.strokes];
      if (newUndoStack.length > 50) {
        newUndoStack.shift(); // Limit undo stack size
      }
      
      return {
        ...state,
        currentSession: updatedSession,
        undoStack: newUndoStack,
        redoStack: [], // Clear redo stack when new action is performed
        canUndo: true,
        canRedo: false,
      };
      
    case 'SET_DRAWING':
      return {
        ...state,
        isDrawing: action.payload,
      };
      
    case 'SET_TOOL':
      return {
        ...state,
        activeTool: action.payload,
      };
      
    case 'UPDATE_CANVAS_SETTINGS':
      return {
        ...state,
        canvasSettings: {
          ...state.canvasSettings,
          ...action.payload,
        },
      };
      
    case 'TOGGLE_DETECTION':
      return {
        ...state,
        isDetectionEnabled: !state.isDetectionEnabled,
      };
      
    case 'SET_DETECTION_SENSITIVITY':
      return {
        ...state,
        detectionSensitivity: action.payload,
      };
      
    case 'ADD_DETECTED_SHAPE':
      if (!state.currentSession) return state;
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          detectedShapes: [...state.currentSession.detectedShapes, action.payload],
        },
      };
      
    case 'QUEUE_TRANSFORMATION':
      return {
        ...state,
        transformationQueue: [...state.transformationQueue, action.payload],
        isTransforming: true,
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
          transformations: [...state.currentSession.transformations, completedTransformation],
        },
        transformationQueue: state.transformationQueue.filter(t => t.id !== action.payload),
        isTransforming: state.transformationQueue.length > 1,
      };
      
    case 'UNDO':
      if (!state.currentSession || state.undoStack.length === 0) return state;
      
      const previousStrokes = state.undoStack[state.undoStack.length - 1];
      const newRedoStack = [...state.redoStack, state.currentSession.strokes];
      const newUndoStackAfterUndo = state.undoStack.slice(0, -1);
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: previousStrokes,
        },
        undoStack: newUndoStackAfterUndo,
        redoStack: newRedoStack,
        canUndo: newUndoStackAfterUndo.length > 0,
        canRedo: true,
      };
      
    case 'REDO':
      if (!state.currentSession || state.redoStack.length === 0) return state;
      
      const nextStrokes = state.redoStack[state.redoStack.length - 1];
      const newUndoStackAfterRedo = [...state.undoStack, state.currentSession.strokes];
      const newRedoStackAfterRedo = state.redoStack.slice(0, -1);
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: nextStrokes,
        },
        undoStack: newUndoStackAfterRedo,
        redoStack: newRedoStackAfterRedo,
        canUndo: true,
        canRedo: newRedoStackAfterRedo.length > 0,
      };
      
    case 'CLEAR_CANVAS':
      if (!state.currentSession) return state;
      
      const clearedUndoStack = [...state.undoStack, state.currentSession.strokes];
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          strokes: [],
          detectedShapes: [],
        },
        undoStack: clearedUndoStack,
        redoStack: [],
        canUndo: true,
        canRedo: false,
      };
      
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        currentFPS: action.payload.fps,
        frameDrops: action.payload.frameDrops,
      };
      
    default:
      return state;
  }
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export interface DrawingProviderProps {
  children: React.ReactNode;
}

export const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(drawingReducer, initialState);
  
  // Session management
  const startNewSession = useCallback((canvasSize: Size) => {
    dispatch({ type: 'START_SESSION', payload: { canvasSize } });
  }, []);
  
  const endCurrentSession = useCallback(() => {
    dispatch({ type: 'END_SESSION' });
  }, []);
  
  const saveSession = useCallback(async (session: DrawingSession) => {
    // In a real app, this would save to backend/storage
    console.log('Saving session:', session.id);
  }, []);
  
  // Drawing operations
  const addStroke = useCallback((stroke: DrawingStroke) => {
    dispatch({ type: 'ADD_STROKE', payload: stroke });
  }, []);
  
  const setIsDrawing = useCallback((isDrawing: boolean) => {
    dispatch({ type: 'SET_DRAWING', payload: isDrawing });
  }, []);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const clearCanvas = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, []);
  
  // Tool management
  const setActiveTool = useCallback((tool: DrawingTool) => {
    dispatch({ type: 'SET_TOOL', payload: tool });
  }, []);
  
  const updateCanvasSettings = useCallback((settings: Partial<CanvasSettings>) => {
    dispatch({ type: 'UPDATE_CANVAS_SETTINGS', payload: settings });
  }, []);
  
  // Shape detection
  const toggleShapeDetection = useCallback(() => {
    dispatch({ type: 'TOGGLE_DETECTION' });
  }, []);
  
  const setDetectionSensitivity = useCallback((sensitivity: number) => {
    dispatch({ type: 'SET_DETECTION_SENSITIVITY', payload: sensitivity });
  }, []);
  
  const addDetectedShape = useCallback((shape: DetectedShape) => {
    dispatch({ type: 'ADD_DETECTED_SHAPE', payload: shape });
  }, []);
  
  // Transformations
  const triggerTransformation = useCallback((shape: DetectedShape) => {
    const transformation: ShapeTransformation = {
      id: Date.now().toString(),
      fromShape: shape.type,
      toObject: `transformed_${shape.type}`,
      animation: 'morph',
      duration: 1000,
      celebration: 'sparkles',
    };
    
    dispatch({ type: 'QUEUE_TRANSFORMATION', payload: transformation });
  }, []);
  
  const completeTransformation = useCallback((transformationId: string) => {
    dispatch({ type: 'COMPLETE_TRANSFORMATION', payload: transformationId });
  }, []);
  
  // Performance monitoring
  const updatePerformance = useCallback((fps: number, frameDrops: number) => {
    dispatch({ type: 'UPDATE_PERFORMANCE', payload: { fps, frameDrops } });
  }, []);
  
  const value: DrawingContextType = {
    // State
    currentSession: state.currentSession,
    activeTool: state.activeTool,
    canvasSettings: state.canvasSettings,
    isDrawing: state.isDrawing,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    isDetectionEnabled: state.isDetectionEnabled,
    detectionSensitivity: state.detectionSensitivity,
    transformationQueue: state.transformationQueue,
    isTransforming: state.isTransforming,
    currentFPS: state.currentFPS,
    frameDrops: state.frameDrops,
    
    // Actions
    startNewSession,
    endCurrentSession,
    saveSession,
    addStroke,
    undo,
    redo,
    clearCanvas,
    setActiveTool,
    updateCanvasSettings,
    toggleShapeDetection,
    setDetectionSensitivity,
    triggerTransformation,
    completeTransformation,
  };
  
  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

/**
 * Hook to access drawing context
 */
export const useDrawing = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  
  if (context === undefined) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  
  return context;
};