import { router, useLocalSearchParams } from "expo-router";
import { Check, RotateCcw, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZoneKey } from "../../../../../components/3d/SkeletonViewer";
import { Button } from "../../../../../components/ui/Button";
import {
  accents,
  colors,
  radii,
  spacing,
  typography,
} from "../../../../../constants/theme";
import { ZONE_DETAILS } from "../../../../../lib/bones-data";
import { QUIZ_QUESTIONS } from "../../../../../lib/quiz-data";

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { zoneKey } = useLocalSearchParams<{ zoneKey: string }>();
  const zone = (zoneKey as ZoneKey) ?? "sup";
  const detail = ZONE_DETAILS[zone] ?? ZONE_DETAILS.sup;
  const accent = accents[detail.accentKey];
  const questions = QUIZ_QUESTIONS[zone] ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const hasAnswered = selectedIndex !== null;

  const handleSelect = (i: number) => {
    if (hasAnswered) return; // lock in the first answer
    setSelectedIndex(i);
    if (i === current.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
  };

  if (questions.length === 0) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
        <Text style={typography.body}>
          Aucune question disponible pour ce module.
        </Text>
        <Button
          label="Retour"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 60;
    return (
      <View
        style={[
          styles.screen,
          {
            paddingTop: insets.top + 24,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={[
            styles.resultIconTile,
            { backgroundColor: passed ? "#1B8A5A" : accent.color },
          ]}
        >
          <Text style={styles.resultPercent}>{percent}%</Text>
        </View>
        <Text style={[typography.cardTitle, { marginTop: 20 }]}>
          {score} / {questions.length} bonnes réponses
        </Text>
        <Text style={[typography.body, { marginTop: 6, textAlign: "center" }]}>
          {passed
            ? "Bien joué ! Vous maîtrisez ce sous-module."
            : "Continuez à réviser ce sous-module."}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 28,
            width: "100%",
          }}
        >
          <Pressable style={styles.retryBtn} onPress={handleRetry}>
            <RotateCcw size={17} color={colors.ink} strokeWidth={2} />
            <Text style={styles.retryText}>Recommencer</Text>
          </Pressable>
          <Button
            label="Terminer"
            onPress={() => router.back()}
            style={{ flex: 1, backgroundColor: accent.color }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <X size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                backgroundColor: accent.color,
              },
            ]}
          />
        </View>
        <Text style={styles.counter}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>{detail.eyebrow}</Text>
        <Text
          style={[typography.cardTitle, { marginTop: 8, marginBottom: 28 }]}
        >
          {current.question}
        </Text>

        <View style={{ gap: 12 }}>
          {current.options.map((option, i) => {
            const isSelected = selectedIndex === i;
            const isCorrect = i === current.correctIndex;
            let stateStyle = styles.optionIdle;
            if (hasAnswered) {
              if (isCorrect) stateStyle = styles.optionCorrect;
              else if (isSelected) stateStyle = styles.optionWrong;
              else stateStyle = styles.optionDisabled;
            }
            return (
              <Pressable
                key={i}
                onPress={() => handleSelect(i)}
                style={[styles.option, stateStyle]}
              >
                <Text
                  style={[
                    styles.optionText,
                    hasAnswered &&
                      isCorrect && {
                        color: "#1B8A5A",
                        fontFamily: "IBMPlexSans_600SemiBold",
                      },
                    hasAnswered &&
                      isSelected &&
                      !isCorrect && {
                        color: "#C33C2E",
                        fontFamily: "IBMPlexSans_600SemiBold",
                      },
                  ]}
                >
                  {option}
                </Text>
                {hasAnswered && isCorrect && (
                  <Check size={18} color="#1B8A5A" strokeWidth={2.5} />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <X size={18} color="#C33C2E" strokeWidth={2.5} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {hasAnswered && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
          <Button
            label={isLast ? "Voir les résultats" : "Question suivante"}
            onPress={handleNext}
            style={{ backgroundColor: accent.color }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screenX,
  },
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
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.iconTile,
    backgroundColor: colors.fillSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.fillSoft,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
  counter: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
    color: colors.muted,
  },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 24, flex: 1 },
  eyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 0.5,
    color: colors.muted,
  },
  option: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionIdle: { backgroundColor: colors.surface, borderColor: colors.border },
  optionCorrect: { backgroundColor: "#F3FAF6", borderColor: "#B9DCCB" },
  optionWrong: { backgroundColor: "#FDF6F5", borderColor: "#E7C4BE" },
  optionDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    opacity: 0.5,
  },
  optionText: {
    fontFamily: "IBMPlexSans_500Medium",
    fontSize: 15,
    color: colors.ink,
    flex: 1,
  },
  footer: { paddingHorizontal: spacing.screenX, paddingTop: 12 },
  resultIconTile: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  resultPercent: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 22,
    color: colors.surface,
  },
  retryBtn: {
    width: 54,
    height: 54,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { display: "none" }, // icon-only button, label kept for accessibility tooling
});
