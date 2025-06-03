// src/components/index.ts - SIMPLIFIED TO AVOID MISSING COMPONENT ERRORS

// ✅ ONLY EXPORT COMPONENTS THAT ACTUALLY EXIST
export { Button } from './ui/Button';
export { AnimatedText } from './ui/AnimatedText';
export { ExternalLink } from './ui/ExternalLink';
export { MonoText } from './ui/StyledText';

// ✅ EXPORT UI COMPONENTS WE CREATED
export { Badge } from './ui/Badge';
export { Card } from './ui/Card';
export { Input } from './ui/Input';
export { LoadingSpinner } from './ui/LoadingSpinner';
export { Modal } from './ui/Modal';
export { ProgressBar } from './ui/ProgressBar';

// ✅ THEMED COMPONENTS
export { default as EditScreenInfo } from './EditScreenInfo';
export { Text, View } from './Themed';

// ✅ DRAWING COMPONENTS (ONLY EXPORT WHAT EXISTS)
export * from './drawing';

// ✅ PLACEHOLDER COMPONENTS (TO AVOID IMPORT ERRORS)
import React from 'react';

// Lesson Components Placeholders
export const LessonPlayer: React.FC = () => null;
export const AIFeedback: React.FC = () => null;
export const CompletionReward: React.FC = () => null;
export const ProgressTracker: React.FC = () => null;
export const StepByStep: React.FC = () => null;

// Social Components Placeholders
export const ArtworkCard: React.FC = () => null;
export const ChallengeCard: React.FC = () => null;
export const ReactionButton: React.FC = () => null;
export const ShareModal: React.FC = () => null;

// Subscription Components Placeholders
export const FeatureComparison: React.FC = () => null;
export const PaywallScreen: React.FC = () => null;
export const PurchaseButton: React.FC = () => null;
export const TrialBanner: React.FC = () => null;