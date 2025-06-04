import { Text } from '../Themed'; // ✅ CORRECT PATH (UP ONE LEVEL)
import { TextProps } from 'react-native'; // ✅ FIXED: Import TextProps from react-native directly

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono-Regular' }]} />;
}

export default MonoText;