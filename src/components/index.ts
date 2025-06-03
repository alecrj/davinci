// src/components/index.ts - FIXED MAIN COMPONENT EXPORTS
// ✅ UI COMPONENTS - DIRECT EXPORTS
export { Button } from './ui/Button';
export { AnimatedText } from './ui/AnimatedText';
export { ExternalLink } from './ui/ExternalLink';
export { MonoText } from './ui/StyledText'; // ✅ CORRECT EXPORT NAME

// ✅ DRAWING COMPONENTS  
export { DrawAnythingCanvas } from './drawing/DrawAnythingCanvas';
export { MagicTransformation } from './drawing/MagicTransformation';
export { TouchDrawingCanvas } from './drawing/TouchDrawingCanvas';
export { CircleChallenge } from './drawing/CircleChallenge';
export { DrawingCelebration } from './drawing/DrawingCelebration';

// ✅ SVG COMPONENTS - PROPER EXPORT
export { Svg, Circle } from './svg/SvgComponents';

// ✅ CORE COMPONENTS - PROPER EXPORTS
export { Text, View } from './Themed'; // ✅ NAMED EXPORTS NOT DEFAULT
export { default as EditScreenInfo } from './EditScreenInfo';

// src/components/ui/index.ts - FIXED UI COMPONENT EXPORTS
export { Button } from './Button';
export { AnimatedText } from './AnimatedText';
export { ExternalLink } from './ExternalLink';
export { MonoText } from './StyledText'; // ✅ CORRECT EXPORT NAME

// src/utils/index.ts - FIXED UTILS EXPORTS
export * from './colors';
export * from './drawing';
export * from './platform';
export * from './common';
export * from './ai';

// ✅ SPECIFIC HAPTICS EXPORT
export * from './haptics';