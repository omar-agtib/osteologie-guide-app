import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

export function SkeletonLoader({
  backgroundColor = colors.bg,
}: {
  backgroundColor?: string;
}) {
  const position = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    position.setValue(0);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(position, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: -1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [position]);

  return (
    <View
      style={[styles.overlay, { backgroundColor }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Chargement du squelette 3D"
    >
      <View style={styles.centerAnchor}>
        <Animated.Image
          source={require("../../../assets/images/skeleton-head.png")}
          resizeMode="contain"
          style={[
            styles.skull,
            {
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-38, 38],
                  }),
                },
              ],
            },
          ]}
        />
        <Text style={styles.text}>Chargement du squelette 3D…</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  // Only this 70-point anchor participates in centering. The caption is
  // absolutely positioned so its height cannot move the skull upward.
  centerAnchor: { width: "100%", height: 70, alignItems: "center" },
  skull: { width: 70, height: 70 },
  text: {
    position: "absolute",
    top: 86,
    left: 0,
    right: 0,
    fontFamily: "IBMPlexSans_500Medium",
    fontSize: 14,
    color: colors.ink,
    textAlign: "center",
  },
});
