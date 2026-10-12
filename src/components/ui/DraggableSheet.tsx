
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors, shadows } from "../../constants/theme";

type Props = {
  children: React.ReactNode;
  collapsedHeight: number;
  expandedHeight: number;
};

export function DraggableSheet({
  children,
  collapsedHeight,
  expandedHeight,
}: Props) {
  // Distance the sheet can move upwards.
  const maxDrag = Math.max(0, expandedHeight - collapsedHeight);

  const translateY = useSharedValue(0);
  const gestureStart = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      gestureStart.value = translateY.value;
    })
    .onUpdate((event) => {
      const next = gestureStart.value + event.translationY;

      translateY.value = Math.max(
        -maxDrag,
        Math.min(0, next)
      );
    })
    .onEnd((event) => {
      const shouldExpand =
        translateY.value < -maxDrag / 2 ||
        event.velocityY < -500;

      const shouldCollapse = event.velocityY > 500;

      const target =
        shouldCollapse ? 0 : shouldExpand ? -maxDrag : 0;

      translateY.value = withSpring(target, {
        damping: 18,
        stiffness: 180,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { height: collapsedHeight },
      ]}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            shadows.bottomSheet,
            { height: expandedHeight },
            animatedStyle,
          ]}
        >
          <View style={styles.grabHandle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    overflow: "visible",
  },

  sheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

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
