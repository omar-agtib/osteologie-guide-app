import { router } from "expo-router";
import { BookOpen, Box } from "lucide-react-native";

import { useMemo } from "react";

import { StyleSheet, Text, View } from "react-native";

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
  const { user } = useAuth();

  const insets = useSafeAreaInsets();

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
        <HomeSkeletonViewer />
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
          subtitle="Exploration libre du squelette"
          icon={<Box size={19} color={colors.ink} strokeWidth={2} />}
          onPress={() => router.push("/mode-libre")}
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
});
