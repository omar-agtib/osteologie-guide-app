import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bone, ChevronLeft, Dumbbell, Puzzle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../../../components/ui/Button";
import { GhostCard } from "../../../../components/ui/GhostCard";
import { ProgressBar } from "../../../../components/ui/ProgressBar";
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from "../../../../constants/theme";
import { useAuth } from "../../../../lib/auth-context";
import { ZONE_DETAILS } from "../../../../lib/bones-data";
import { ProgressMap, subscribeToProgress } from "../../../../lib/firestore";

const TOTAL_BONES = Object.values(ZONE_DETAILS).reduce(
  (sum, z) => sum + z.bones.length,
  0,
);

export default function ModulesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProgress(user.uid, setProgress);
    return unsub;
  }, [user]);

  const viewedCount = Object.values(progress).reduce(
    (sum, z) => sum + (z?.viewedBoneIds.length ?? 0),
    0,
  );
  const percent =
    TOTAL_BONES > 0 ? Math.round((viewedCount / TOTAL_BONES) * 100) : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.eyebrow}>MODE APPRENTISSAGE</Text>
      </View>

      <Text style={typography.screenTitle}>Modules</Text>
      <Text style={[typography.body, { marginTop: 8, marginBottom: 20 }]}>
        Choisissez un domaine d'étude. Chaque module se compose de sous-modules
        et de quiz.
      </Text>

      <View style={styles.osteologieCard}>
        <LinearGradient
          colors={[colors.stageWarmTop, colors.stageWarmBottomAlt]}
          style={styles.heroBand}
        >
          <View style={styles.heroIconTile}>
            <Bone size={22} color={colors.surface} strokeWidth={2} />
          </View>
          <View style={styles.subCountPill}>
            <Text style={styles.subCountText}>3 SOUS-MODULES</Text>
          </View>
        </LinearGradient>

        <View style={styles.cardBody}>
          <Text style={typography.cardTitle}>Ostéologie</Text>
          <Text style={[typography.body, { marginTop: 4, marginBottom: 14 }]}>
            Étude des os : squelette axial et appendiculaire.
          </Text>
          <ProgressBar percent={percent} />
          <Button
            label="Continuer ›"
            onPress={() => router.push("/modules/osteologie")}
            style={{ height: 48, marginTop: 16 }}
          />
        </View>
      </View>

      <View style={styles.soonRow}>
        <Text style={styles.soonEyebrow}>BIENTÔT DISPONIBLE</Text>
        <Pressable hitSlop={8}>
          <Text style={styles.notifyLink}>Me prévenir</Text>
        </Pressable>
      </View>

      <View style={styles.ghostGrid}>
        <GhostCard
          title="Arthrologie / Articulations"
          icon={<Puzzle size={17} color={colors.disabled} strokeWidth={2} />}
        />
        <GhostCard
          title="Myologie / Muscles"
          icon={<Dumbbell size={17} color={colors.disabled} strokeWidth={2} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.screenX, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.iconTile,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.muted,
  },
  osteologieCard: {
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginTop: 4,
    ...shadows.card,
  },
  heroBand: {
    height: 108,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE8DE",
    padding: 16,
    justifyContent: "space-between",
  },
  heroIconTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  subCountPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  subCountText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11,
    color: colors.ink,
  },
  cardBody: { padding: 18, paddingTop: 16 },
  soonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  soonEyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 0.5,
    color: colors.mutedLight,
  },
  notifyLink: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
    color: colors.primary,
  },
  ghostGrid: { flexDirection: "row", gap: 12 },
});
