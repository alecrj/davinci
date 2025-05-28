import React, { createContext, useContext, useState } from 'react';
import { DrawingPath, DrawingShape } from '@/types/drawing';

interface DrawingState {
  currentPaths: DrawingPath[];
  detectedShape: DrawingShape | null;
  isDrawing: boolean;
  strokeWidth: number;
  strokeColor: string;
}

interface DrawingContextType {
  drawingState: DrawingState;
  startDrawing: () => void;
  endDrawing: () => void;
  addPath: (path: DrawingPath) => void;
  clearDrawing: () => void;
  setDetectedShape: (shape: DrawingShape | null) => void;
  setStrokeWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    currentPaths: [],
    detectedShape: null,
    isDrawing: false,
    strokeWidth: 4,
    strokeColor: '#000000',
  });

  const startDrawing = () => {
    setDrawingState(prev => ({ ...prev, isDrawing: true }));
  };

  const endDrawing = () => {
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
  };

  const addPath = (path: DrawingPath) => {
    setDrawingState(prev => ({
      ...prev,
      currentPaths: [...prev.currentPaths, path],
    }));
  };

  const clearDrawing = () => {
    setDrawingState(prev => ({
      ...prev,
      currentPaths: [],
      detectedShape: null,
    }));
  };

  const setDetectedShape = (shape: DrawingShape | null) => {
    setDrawingState(prev => ({ ...prev, detectedShape: shape }));
  };

  const setStrokeWidth = (width: number) => {
    setDrawingState(prev => ({ ...prev, strokeWidth: width }));
  };

  const setStrokeColor = (color: string) => {
    setDrawingState(prev => ({ ...prev, strokeColor: color }));
  };

  return (
    <DrawingContext.Provider
      value={{
        drawingState,
        startDrawing,
        endDrawing,
        addPath,
        clearDrawing,
        setDetectedShape,
        setStrokeWidth,
        setStrokeColor,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within DrawingProvider');
  }
  return context;
};