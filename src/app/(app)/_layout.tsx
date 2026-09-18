import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        contentStyle: {
          backgroundColor: colors.bg,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          contentStyle: { backgroundColor: colors.bg, paddingBottom: 0 },
        }}
      />
      {/* The quiz footer already applies insets.bottom itself. */}
      <Stack.Screen
        name="modules/osteologie/quiz/[zoneKey]"
        options={{
          contentStyle: { backgroundColor: colors.bg, paddingBottom: 0 },
        }}
      />
    </Stack>
  );
}
