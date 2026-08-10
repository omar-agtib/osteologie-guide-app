import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AccentKey, accents, colors, typography } from "../../constants/theme";

type Props = {
  title: string;
  subtitle: string;
  accentKey: AccentKey;
  active: boolean;
  onActivate: () => void;
  onNavigate: () => void;
};

export function SubmoduleRow({
  title,
  subtitle,
  accentKey,
  active,
  onActivate,
  onNavigate,
}: Props) {
  const accent = accents[accentKey];

  return (
    <Pressable
      // Tapping the row body ONLY highlights/colorizes the zone now —
      // it never navigates, regardless of whether it was already active.
      onPress={onActivate}
      style={[
        styles.row,
        active
          ? { backgroundColor: accent.tintBg, borderColor: accent.borderActive }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.colorBar, { backgroundColor: accent.color }]} />
      <View style={{ flex: 1 }}>
        <Text style={typography.rowTitle}>{title}</Text>
        <Text style={typography.caption}>{subtitle}</Text>
      </View>
      {/* Only the chevron navigates to detail */}
      <Pressable
        onPress={onNavigate}
        hitSlop={8}
        style={[
          styles.chevronChip,
          { backgroundColor: active ? accent.chipBg : colors.fillSoft },
        ]}
      >
        <ChevronRight
          size={16}
          color={active ? accent.color : colors.muted}
          strokeWidth={2.2}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 10,
  },
  colorBar: {
    width: 6,
    height: 38,
    borderRadius: 3,
  },
  chevronChip: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
