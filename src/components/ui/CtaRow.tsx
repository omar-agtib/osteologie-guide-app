import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radii, typography } from "../../constants/theme";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  disabled?: boolean;
};

export function CtaRow({
  title,
  subtitle,
  icon,
  onPress,
  variant = "secondary",
  style,
  disabled = false,
}: Props) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.row,
        isPrimary ? styles.primary : styles.secondary,
        style,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.iconTile,
          {
            backgroundColor: isPrimary
              ? "rgba(255,255,255,0.18)"
              : colors.fillSoftAlt,
          },
        ]}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            typography.rowTitle,
            isPrimary && {
              color: colors.surface,
            },
            disabled && {
              color: "#8F979D",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            typography.caption,
            isPrimary && {
              color: "rgba(255,255,255,0.75)",
            },
            disabled && {
              color: "#A8AFB4",
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight
        size={18}
        color={disabled ? "#A8AFB4" : isPrimary ? colors.surface : colors.muted}
        strokeWidth={2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 62,
    borderRadius: radii.ctaRow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: radii.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#E8EAEC",
    borderColor: "#D5D9DC",
  },
});
