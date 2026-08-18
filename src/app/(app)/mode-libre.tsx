import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, RotateCcw } from "lucide-react-native";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Image,
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

  const [skeletonLoading, setSkeletonLoading] =
    useState(true);

  const [resetKey, setResetKey] =
    useState(0);

  // Animation du loader
const skullRotation = useRef(
  new Animated.Value(0)
).current;

 useEffect(() => {
  if (!skeletonLoading) {
    skullRotation.stopAnimation();
    return;
  }

  skullRotation.setValue(0);

  const animation = Animated.loop(
    Animated.timing(skullRotation, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: true,
    })
  );

  animation.start();

  return () => {
    animation.stop();
  };
 }, [skeletonLoading, skullRotation]);
  
  const rotate = skullRotation.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

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
        onLoaded={() =>
          setSkeletonLoading(false)
        }
      />

      {/* Loader */}
      {skeletonLoading && (
        <View style={styles.loaderContainer}>
         <Animated.View
  style={{
    transform: [
      {
        rotate,
      },
    ],
  }}
>
            <Image
              source={require(
                "../../../assets/images/skeleton-head.png"
              )}
              style={styles.loaderImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={styles.loaderText}>
            Chargement du squelette 3D
          </Text>
        </View>
      )}

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

    loaderContainer: {
      ...StyleSheet.absoluteFillObject,

      justifyContent: "center",
      alignItems: "center",

      backgroundColor:
        "#FFFFFF",

      zIndex: 5,
    },

    loaderImage: {
      width: 110,
      height: 110,
      marginBottom: 20,
    },

    loaderText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#555555",
    },
  });