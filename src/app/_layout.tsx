import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
  useFonts,
} from "@expo-google-fonts/ibm-plex-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../lib/auth-context";
import { LogBox } from "react-native";


LogBox.ignoreLogs([
  "EXGL: gl.pixelStorei() doesn't support this parameter yet!",
  "THREE.Clock: This module has been deprecated",
  "THREE.WARNING: Multiple instances of Three.js being imported",
  "THREE.WebGLRenderer: EXT_color_buffer_float extension not supported",
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.",
]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, freezeOnBlur: true }} />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
