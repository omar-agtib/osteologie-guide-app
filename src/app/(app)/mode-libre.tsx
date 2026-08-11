import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, RotateCcw } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ModeLibreSkeletonViewer from "../../components/3d/ModeLibreSkeletonViewer";

import {
  colors,
  radii,
  spacing,
  typography,
} from "../../constants/theme";

export default function ModeLibreScreen() {
  const insets = useSafeAreaInsets();

  const [resetKey, setResetKey] =
    useState(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.ink,
      }}
    >
      <LinearGradient
        colors={[
          colors.stageWarmTop,
          colors.stageWarmBottomAlt,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* 3D Skeleton */}
      <ModeLibreSkeletonViewer
        key={resetKey}
      />

      {/* Header */}
      <View
        style={[
          styles.headerRow,
          {
            paddingTop:
              insets.top + 12,
          },
        ]}
      >
        <Pressable
          style={styles.iconBtn}
          onPress={() =>
            router.back()
          }
          hitSlop={8}
        >
          <ChevronLeft
            size={19}
            color={colors.ink}
            strokeWidth={2.2}
          />
        </Pressable>

        <Text
          style={
            typography.headerTitle
          }
        >
          Mode Libre
        </Text>

        <Pressable
          style={styles.iconBtn}
          onPress={() =>
            setResetKey(
              (k) => k + 1
            )
          }
          hitSlop={8}
        >
          <RotateCcw
            size={17}
            color={colors.ink}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    headerRow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal:
        spacing.screenX,

      zIndex: 10,
    },

    iconBtn: {
      width: 38,
      height: 38,

      borderRadius:
        radii.iconTile,

      backgroundColor:
        "rgba(255,255,255,0.9)",

      borderWidth: 1,
      borderColor:
        colors.stageBorder,

      alignItems: "center",
      justifyContent:
        "center",
    },
  });