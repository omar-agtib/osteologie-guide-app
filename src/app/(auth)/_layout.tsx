import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

export default function AuthLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["bottom", "left", "right"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
