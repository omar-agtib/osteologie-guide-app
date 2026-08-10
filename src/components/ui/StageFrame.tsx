import { LinearGradient } from "expo-linear-gradient";
import { RotateCcw, ZoomIn } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radii } from "../../constants/theme";
import { Pill } from "./Pill";

type Props = {
  children: React.ReactNode;
  radius?: number;
  flex?: boolean; // fills remaining height (Accueil) vs fixed height (Submodules)
  fixedHeight?: number; // used when flex=false, e.g. 300 on screen 4
  warmBottomAlt?: boolean; // screens 3/5 use the slightly cooler bottom stop
  showControls?: boolean; // rotate/zoom glass buttons, top-right
  onReset?: () => void;
  onZoom?: () => void;
  bottomLeftPillLabel?: string;
  topLeftPillLabel?: string;
  style?: ViewStyle;
};

export function StageFrame({
  children,
  radius = radii.stageCard,
  flex = true,
  fixedHeight,
  warmBottomAlt = false,
  showControls = true,
  onReset,
  onZoom,
  bottomLeftPillLabel,
  topLeftPillLabel,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.stageBorder,
        },
        flex ? { flex: 1 } : { height: fixedHeight ?? 300 },
        styles.shadow,
        style,
      ]}
    >
      <LinearGradient
        colors={[
          colors.stageWarmTop,
          warmBottomAlt ? colors.stageWarmBottomAlt : colors.stageWarmBottom,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial white glow behind the model */}
      <View pointerEvents="none" style={styles.glow} />

      {/* 3D content */}
      <View style={StyleSheet.absoluteFill}>{children}</View>

      {/* Contact shadow grounding the model */}
      <View pointerEvents="none" style={styles.contactShadow} />

      {showControls && (
        <View style={styles.controlsStack}>
          <Pressable style={styles.glassBtn} onPress={onReset} hitSlop={8}>
            <RotateCcw size={17} color={colors.ink} strokeWidth={2} />
          </Pressable>
          <Pressable style={styles.glassBtn} onPress={onZoom} hitSlop={8}>
            <ZoomIn size={17} color={colors.ink} strokeWidth={2} />
          </Pressable>
        </View>
      )}

      {bottomLeftPillLabel && (
        <Pill
          label={bottomLeftPillLabel}
          tone="light"
          style={styles.bottomLeftPill}
        />
      )}
      {topLeftPillLabel && (
        <Pill
          label={topLeftPillLabel}
          tone="light"
          style={styles.topLeftPill}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#102A3C",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 },
    elevation: 5,
  },
  glow: {
    position: "absolute",
    top: "18%",
    left: "20%",
    width: "60%",
    height: "55%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  contactShadow: {
    position: "absolute",
    bottom: "14%",
    left: "50%",
    marginLeft: -95,
    width: 190,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(43,49,56,0.10)",
  },
  controlsStack: {
    position: "absolute",
    top: 14,
    right: 14,
    gap: 8,
  },
  glassBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.iconTile,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: colors.stageBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLeftPill: {
    position: "absolute",
    bottom: 14,
    left: 14,
  },
  topLeftPill: {
    position: "absolute",
    top: 14,
    left: 14,
  },
});
