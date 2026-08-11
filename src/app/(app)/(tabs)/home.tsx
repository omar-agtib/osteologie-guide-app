import { router } from "expo-router";
import { BookOpen, Box } from "lucide-react-native";

import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeSkeletonViewer } from "../../../components/3d/HomeSkeletonViewer";
import { CtaRow } from "../../../components/ui/CtaRow";
import { StageFrame } from "../../../components/ui/StageFrame";

import { colors, spacing, typography } from "../../../constants/theme";

import { useAuth } from "../../../lib/auth-context";

function greeting(hour: number) {
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";

  return "Bonsoir";
}

function initialsFrom(name: string | null) {
  if (!name) return "?";

  return name.trim().slice(0, 2).toUpperCase();
}

export default function HomeScreen() {
  const skullRotation = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();

  const insets = useSafeAreaInsets();

  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(skullRotation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [skullRotation]);

  const skullRotate = skullRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const greetLabel = useMemo(() => greeting(new Date().getHours()), []);

  const displayName = user?.displayName ?? "Étudiant";

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text>
            {greetLabel}, {displayName}
          </Text>

          <Text
            style={[
              typography.screenTitleHome,
              {
                marginTop: 2,
              },
            ]}
          >
            Squelette humain
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsFrom(displayName)}</Text>
        </View>
      </View>

      {/* =========================
          NEW 3D SKELETON
          ========================= */}

      <StageFrame
        style={styles.stage}
        bottomLeftPillLabel="MODÈLE 3D · 206 OS"
        showControls={false}
        transparentBackground
      >
        <View style={styles.viewerContainer}>
          <HomeSkeletonViewer
            onLoaded={() => {
              setSkeletonLoading(false);
            }}
          />

          {skeletonLoading && (
            <View style={styles.loader}>
              <View style={styles.loaderAnimationArea}>
                <Animated.Image
                  source={require("../../../../assets/images/skeleton-head.png")}
                  style={[
                    styles.loaderSkull,
                    {
                      transform: [
                        {
                          rotate: skullRotate,
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.loaderText}>
                Chargement du squelette 3D...
              </Text>
            </View>
          )}
        </View>
      </StageFrame>

      <View style={styles.ctas}>
        <CtaRow
          title="Mode Apprentissage"
          subtitle="Parcours guidé, module par module"
          variant="primary"
          icon={<BookOpen size={19} color={colors.surface} strokeWidth={2} />}
          onPress={() => router.push("/modules")}
        />

        <CtaRow
          title="Mode Libre"
          subtitle={
            skeletonLoading
              ? "Chargement du modèle 3D..."
              : "Exploration libre du squelette"
          }
          icon={
            <Box
              size={19}
              color={skeletonLoading ? "#A8AFB4" : colors.ink}
              strokeWidth={2}
            />
          }
          disabled={skeletonLoading}
          onPress={() => {
            if (skeletonLoading) return;

            router.push("/mode-libre");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DCE7EE",
    borderWidth: 1,
    borderColor: "#CBD9E3",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 14,
    color: colors.primary,
  },

  stage: {
    marginBottom: 14,
  },

  ctas: {
    gap: 12,
    paddingBottom: 8,
  },
  viewerContainer: {
    flex: 1,
    width: "100%",
  },

  loader: {
    ...StyleSheet.absoluteFillObject,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.bg,

    zIndex: 10,
  },

  loaderAnimationArea: {
    width: 220,
    height: 90,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  loaderSkull: {
    width: 70,
    height: 70,
  },

  loaderText: {
    fontFamily: "IBMPlexSans_500Medium",

    fontSize: 14,

    color: colors.ink,

    textAlign: "center",
  },
});
