import { Image, ImageSource } from "expo-image";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  source: ImageSource | number;
  height?: number;

  // Conservées pour compatibilité avec les écrans existants.
  onGestureActiveChange?: (active: boolean) => void;
  isolateAtMinScale?: boolean;
  allowParentScrollAtEdges?: boolean;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const EDGE_EPSILON = 2;

export function ZoomableImage({
  source,
  height = 430,
  onGestureActiveChange,
  isolateAtMinScale = true,
  allowParentScrollAtEdges = false,
}: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const notifyGesture = useCallback(
    (active: boolean) => {
      onGestureActiveChange?.(active);
    },
    [onGestureActiveChange],
  );

  // =========================
  // PINCH
  // =========================

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      if (onGestureActiveChange) {
        runOnJS(notifyGesture)(true);
      }
    })
    .onUpdate((event) => {
      const nextScale = savedScale.value * event.scale;

      scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value <= MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);

        savedX.value = 0;
        savedY.value = 0;
      }
    })
    .onFinalize(() => {
      if (onGestureActiveChange) {
        runOnJS(notifyGesture)(false);
      }
    });

  // =========================
  // PAN
  // =========================

    const panGesture = Gesture.Pan()
  .minPointers(1)
  .maxPointers(1)

  // Important :
  // dans le cours, le Pan de l'image ne doit PAS s'activer à 1x.
  .manualActivation(!isolateAtMinScale)

  .onTouchesMove((event, stateManager) => {
    if (isolateAtMinScale) {
      return;
    }

    // COURS :
    // à 1x, on abandonne immédiatement ce gesture
    // pour laisser le FlatList récupérer le drag.
    if (scale.value <= MIN_SCALE + 0.001) {
      stateManager.fail();
      return;
    }

    // Image zoomée :
    // le Pan peut prendre le contrôle.
    stateManager.activate();
  })

  .onBegin(() => {
    if (onGestureActiveChange) {
      runOnJS(notifyGesture)(true);
    }
  })

  .onUpdate((event) => {
    const currentScale = scale.value;

    if (currentScale <= MIN_SCALE) {
      return;
    }

    const maxY =
      (height * (currentScale - MIN_SCALE)) / 2;

    const maxX = maxY;

    const requestedX =
      savedX.value + event.translationX;

    const requestedY =
      savedY.value + event.translationY;

    const nextX = Math.max(
      -maxX,
      Math.min(maxX, requestedX),
    );

    const nextY = Math.max(
      -maxY,
      Math.min(maxY, requestedY),
    );

    translateX.value = nextX;
    translateY.value = nextY;
  })

  .onEnd(() => {
    savedX.value = translateX.value;
    savedY.value = translateY.value;
  })

  .onFinalize(() => {
    savedX.value = translateX.value;
    savedY.value = translateY.value;

    if (onGestureActiveChange) {
      runOnJS(notifyGesture)(false);
    }
  });

  /*
   * Pinch et Pan sont deux gestes différents.
   * Le pinch prend les 2 doigts.
   * Le pan prend 1 doigt.
   */
  const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <View style={[styles.container, { height }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.imageWrapper, animatedStyle]}>
          <Image
            source={source}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  imageWrapper: {
    width: "100%",
    height: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
