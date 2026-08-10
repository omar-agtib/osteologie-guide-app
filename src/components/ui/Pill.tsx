import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radii, typography } from "../../constants/theme";

type Props = {
  label: string;
  tone?: "light" | "dark";
  style?: ViewStyle;
};

export function Pill({ label, tone = "dark", style }: Props) {
  const isLight = tone === "light";
  return (
    <View
      style={[styles.base, isLight ? styles.light : styles.darkTone, style]}
    >
      <Text
        style={[
          typography.caption,
          {
            color: isLight ? colors.ink : colors.surface,
            fontFamily: "IBMPlexSans_600SemiBold",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
  },
  light: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: colors.stageBorder,
  },
  darkTone: {
    backgroundColor: "rgba(18,34,46,0.55)",
  },
});
