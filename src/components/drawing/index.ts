// src/components/drawing/index.ts - FIXED CIRCULAR DEPENDENCY
// ✅ SAFE EXPORTS: Only export components that don't import from this index
export { DrawAnythingCanvas } from './DrawAnythingCanvas';
export { TouchDrawingCanvas } from './TouchDrawingCanvas';
export { MagicTransformation } from './MagicTransformation';
export { default as ApplePencilCanvas } from './ApplePencilCanvas';

// ✅ REMOVED: CircleChallenge export to break circular dependency
// Components should import CircleChallenge directly:
// import { CircleChallenge } from '@/components/drawing/CircleChallenge';

// ✅ NOTE: Other components can still be added here as long as they don't 
// import from this index file. Always import specific files to avoid cycles.