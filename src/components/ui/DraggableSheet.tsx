import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, shadows } from "../../constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type Props = {
  children: React.ReactNode;
  collapsedHeight: number; // height when at rest (what you see by default)
  expandedHeight: number; // height when dragged up fully
};

export function DraggableSheet({
  children,
  collapsedHeight,
  expandedHeight,
}: Props) {
  // translateY is negative-up: 0 = collapsed position, negative = dragged up
  const translateY = useSharedValue(0);
  const maxDrag = collapsedHeight - expandedHeight; // negative number

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const next = e.translationY;
      // Clamp between fully expanded (maxDrag) and collapsed (0), with a little rubber-band past 0
      translateY.value = Math.min(20, Math.max(maxDrag, next));
    })
    .onEnd((e) => {
      // Snap to whichever state is closer, factoring in velocity for a natural flick
      const shouldExpand = translateY.value < maxDrag / 2 || e.velocityY < -500;
      translateY.value = withSpring(shouldExpand ? maxDrag : 0, {
        damping: 18,
        stiffness: 180,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: expandedHeight,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.sheet, shadows.bottomSheet, animatedStyle]}>
        <Animated.View style={styles.grabHandle} />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  grabHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDE5EA",
    alignSelf: "center",
    marginBottom: 14,
  },
});
