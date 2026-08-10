import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, RotateCcw } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkeletonViewer, ZoneKey } from "../../components/3d/SkeletonViewer";
import {
  AccentKey,
  accents,
  colors,
  radii,
  spacing,
  typography,
} from "../../constants/theme";

const ZONE_TABS: {
  key: ZoneKey | null;
  label: string;
  accentKey: AccentKey | null;
}[] = [
  { key: null, label: "Tout", accentKey: null },
  { key: "sup", label: "Sup.", accentKey: "red" },
  { key: "ax", label: "Axial", accentKey: "dark" },
  { key: "inf", label: "Inf.", accentKey: "green" },
];

export default function ModeLibreScreen() {
  const insets = useSafeAreaInsets();
  const [activeZone, setActiveZone] = useState<ZoneKey | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const activeAccent = activeZone
    ? accents[ZONE_TABS.find((t) => t.key === activeZone)!.accentKey!]
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <LinearGradient
        colors={[colors.stageWarmTop, colors.stageWarmBottomAlt]}
        style={StyleSheet.absoluteFill}
      />

      {/* Full-bleed 3D viewer */}
      <SkeletonViewer
        key={resetKey}
        activeZone={activeZone}
        accentColor={activeAccent?.color}
        interactive
        framing="full"
      />

      {/* Header overlay */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={typography.headerTitle}>Mode Libre</Text>
        <Pressable
          style={styles.iconBtn}
          onPress={() => setResetKey((k) => k + 1)}
          hitSlop={8}
        >
          <RotateCcw size={17} color={colors.ink} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Zone filter tabs, bottom */}
      <View style={[styles.tabsRow, { paddingBottom: insets.bottom + 18 }]}>
        {ZONE_TABS.map((tab) => {
          const isActive = activeZone === tab.key;
          const accent = tab.accentKey ? accents[tab.accentKey] : null;
          return (
            <Pressable
              key={tab.label}
              onPress={() => setActiveZone(tab.key)}
              style={[
                styles.tab,
                isActive && {
                  backgroundColor: accent?.color ?? colors.primary,
                  borderColor: accent?.color ?? colors.primary,
                },
              ]}
            >
              <Text
                style={[styles.tabText, isActive && { color: colors.surface }]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.iconTile,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: colors.stageBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  tabsRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.screenX,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: colors.stageBorder,
  },
  tabText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 13,
    color: colors.ink,
  },
});
