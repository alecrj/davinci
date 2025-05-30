import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Import our custom providers
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProgressProvider } from '@/context/UserProgressContext';
import { DrawingProvider } from '@/context/DrawingContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Start with index instead of tabs for proper onboarding flow
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Just use the fonts that definitely exist for now
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <DrawingProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding/draw-anything" options={{ headerShown: false }} />
            <Stack.Screen name="assessment/index" options={{ headerShown: false }} />
            <Stack.Screen name="assessment/questions" options={{ headerShown: false }} />
            <Stack.Screen name="assessment/drawing-test" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </DrawingProvider>
      </UserProgressProvider>
    </ThemeProvider>
  );
}