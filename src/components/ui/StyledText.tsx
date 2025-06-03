// src/components/ui/StyledText.tsx - FIXED IMPORT PATH
import { Text, TextProps } from '../Themed'; // ✅ CORRECT PATH (UP ONE LEVEL)

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}