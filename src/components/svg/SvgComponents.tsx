// src/components/svg/SvgComponents.tsx
import React from 'react';
import Svg, { Circle, SvgProps, CircleProps } from 'react-native-svg';

// Re-export Svg components with proper typing
export { default as Svg } from 'react-native-svg';
export { Circle } from 'react-native-svg';

// Create typed wrapper components if needed
interface CustomSvgProps extends SvgProps {
  children?: React.ReactNode;
}

interface CustomCircleProps extends CircleProps {
  // Additional custom props if needed
}

export const CustomSvg: React.FC<CustomSvgProps> = ({ children, ...props }) => {
  return <Svg {...props}>{children}</Svg>;
};

export const CustomCircle: React.FC<CustomCircleProps> = (props) => {
  return <Circle {...props} />;
};

// Export defaults for convenience
export default Svg;