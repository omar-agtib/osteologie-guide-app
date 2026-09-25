import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Bookmark, ChevronLeft, Share2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LearningSkeletonViewer,
  ZoneKey,
} from "../../../../components/3d/LearningSkeletonViewer";
import { Button } from "../../../../components/ui/Button";
import { DraggableSheet } from "../../../../components/ui/DraggableSheet";
import { PillToggle } from "../../../../components/ui/PillToggle";
import {
  accents,
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from "../../../../constants/theme";
import { useAuth } from "../../../../lib/auth-context";
import { ZONE_DETAILS } from "../../../../lib/bones-data";
import {
  markBoneViewed,
  QuizResult,
  subscribeToQuizResult,
} from "../../../../lib/firestore";
// Default selected bone per zone, matching the README's example (Humérus, 3/6 for sup)
const DEFAULT_BONE_INDEX: Record<ZoneKey, number> = { sup: 2, ax: 0, inf: 0 };

function angleAndLength(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return { length, angle };
}

export default function SubmoduleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { zoneKey } = useLocalSearchParams<{ zoneKey: string }>();
  const zone = (zoneKey as ZoneKey) ?? "sup";
  const detail = ZONE_DETAILS[zone] ?? ZONE_DETAILS.sup;
  const accent = accents[detail.accentKey];

  const [selectedIndex, setSelectedIndex] = useState(
    DEFAULT_BONE_INDEX[zone] ?? 0,
  );
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [sectionView, setSectionView] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const selectedBone = detail.bones[selectedIndex];
  const { user } = useAuth();

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  React.useEffect(() => {
    if (user) markBoneViewed(user.uid, zone, selectedBone.id);
  }, [user, zone, selectedBone.id]);

  React.useEffect(() => {
    if (!user) {
      setQuizResult(null);
      return;
    }

    const unsubscribe = subscribeToQuizResult(user.uid, zone, setQuizResult);

    return unsubscribe;
  }, [user, zone]);

  const onStageLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setStageSize({ width, height });
  }, []);

  const pct = (p: { x: number; y: number }) => ({
    left: (p.x / 100) * stageSize.width,
    top: (p.y / 100) * stageSize.height,
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={styles.eyebrowRow}>
            <View
              style={[styles.accentDot, { backgroundColor: accent.color }]}
            />
            <Text style={[styles.eyebrow, { color: accent.color }]}>
              {detail.eyebrow}
            </Text>
          </View>
          <Text style={typography.headerTitle}>{detail.title}</Text>
        </View>
        <Pressable style={styles.backBtn} hitSlop={8}>
          <Share2 size={17} color={colors.ink} strokeWidth={2} />
        </Pressable>
      </View>

      {/* 3D stage, edge to edge, no radius */}
      <View style={{ flex: 1 }} onLayout={onStageLayout}>
        <LinearGradient
          colors={[colors.stageWarmTop, colors.stageWarmBottomAlt]}
          style={StyleSheet.absoluteFill}
        />
        <LearningSkeletonViewer
  activeZone={zone}
  accentColor="#E53935"
  interactive
  framing="small"
/>

        {/* Bone label chips + leader lines */}
        {labelsVisible &&
          stageSize.width > 0 &&
          detail.bones.map((bone, i) => {
            const isSelected = i === selectedIndex;
            const anchorPx = pct(bone.anchor);
            const chipPx = pct(bone.chip);
            const { length, angle } = angleAndLength(anchorPx, chipPx);

            return (
              <React.Fragment key={bone.id}>
                <View
                  pointerEvents="none"
                  style={[
                    styles.leaderLine,
                    {
                      left: anchorPx.left,
                      top: anchorPx.top,
                      width: length,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
                <Pressable
                  onPress={() => setSelectedIndex(i)}
                  style={[
                    styles.chip,
                    { left: chipPx.left - 40, top: chipPx.top - 14 },
                    isSelected && {
                      backgroundColor: accent.color,
                      borderColor: accent.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && { color: colors.surface },
                    ]}
                  >
                    {bone.name}
                  </Text>
                </Pressable>
              </React.Fragment>
            );
          })}

        {/* Bottom-left pill toggles */}
        <View style={styles.togglesRow}>
          <PillToggle
            label="Étiquettes"
            active={labelsVisible}
            onPress={() => setLabelsVisible((v) => !v)}
          />
          <PillToggle
            label="Coupe"
            active={sectionView}
            onPress={() => setSectionView((v) => !v)}
          />
        </View>
      </View>

      {/* Bottom sheet — drag up to expand */}
      <DraggableSheet collapsedHeight={285} expandedHeight={480}>
        <View style={styles.sheetHeaderRow}>
          <Text style={typography.sheetTitle}>{selectedBone.name}</Text>
          <Text style={styles.counter}>
            {selectedIndex + 1} / {detail.bones.length} os
          </Text>
        </View>
        <Text style={[typography.body, { marginTop: 6, marginBottom: 18 }]}>
          {selectedBone.description}
        </Text>
        <View style={styles.quizStatsCard}>
          <View style={styles.quizStatsHeader}>
            <Text style={styles.quizStatsTitle}>Quiz</Text>

            {quizResult && (
              <Text
                style={[
                  styles.quizStatsPercent,
                  {
                    color: accent.color,
                  },
                ]}
              >
                {quizResult.bestPercent}%
              </Text>
            )}
          </View>

          {quizResult ? (
            <View style={styles.quizStatsRow}>
              <View style={styles.quizStatItem}>
                <Text style={styles.quizStatLabel}>Meilleur score</Text>

                <Text style={styles.quizStatValue}>
                  {quizResult.bestScore}/{quizResult.bestTotal}
                </Text>
              </View>

              <View style={styles.quizStatDivider} />

              <View style={styles.quizStatItem}>
                <Text style={styles.quizStatLabel}>Tentatives</Text>

                <Text style={styles.quizStatValue}>{quizResult.attempts}</Text>
              </View>

              <View style={styles.quizStatDivider} />

              <View style={styles.quizStatItem}>
                <Text style={styles.quizStatLabel}>Dernier score</Text>

                <Text style={styles.quizStatValue}>
                  {quizResult.lastScore}/{quizResult.lastTotal}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.quizNoResult}>
              Aucun quiz terminé pour le moment.
            </Text>
          )}
        </View>
        <View style={styles.sheetActions}>
          <Button
            label="Quiz du sous-module"
            onPress={() => router.push(`/modules/osteologie/quiz-prep/${zone}`)}
            style={[
              styles.quizBtn,
              {
                backgroundColor: accent.color,
              },
            ]}
          />
          <Pressable style={styles.bookmarkBtn} hitSlop={8}>
            <Bookmark size={19} color={colors.ink} strokeWidth={2} />
          </Pressable>
        </View>
      </DraggableSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F5",
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
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  accentDot: { width: 6, height: 6, borderRadius: 3 },
  eyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 0.5,
  },
  leaderLine: {
    position: "absolute",
    height: 1,
    borderTopWidth: 1.2,
    borderStyle: "dashed",
    borderColor: "#C7B9B4",
  },
  chip: {
    position: "absolute",
    minWidth: 80,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#EDE3E1",
    alignItems: "center",
    ...shadows.card,
  },
  chipText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
    color: colors.ink,
  },
  togglesRow: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    gap: 8,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  counter: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 13,
    color: colors.muted,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 10,
  },
  quizBtn: {
    flex: 1,
    height: 50,
    ...shadows.redButton,
  },
  bookmarkBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  quizStatsCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.fillSoft,
  },

  quizStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  quizStatsTitle: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 14,
    color: colors.ink,
  },

  quizStatsPercent: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 15,
  },

  quizStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  quizStatItem: {
    flex: 1,
    alignItems: "center",
  },

  quizStatLabel: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 10.5,
    color: colors.muted,
    textAlign: "center",
  },

  quizStatValue: {
    marginTop: 4,
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 16,
    color: colors.ink,
  },

  quizStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },

  quizNoResult: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 13,
    color: colors.muted,
  },
});
