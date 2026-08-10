import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "../../constants/theme";

type Props = { label: string; active: boolean; onPress: () => void };

export function PillToggle({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Text
        style={[styles.text, { color: active ? colors.primary : colors.muted }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  active: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  inactive: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  text: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
  },
});
