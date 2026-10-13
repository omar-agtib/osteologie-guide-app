import { router, useLocalSearchParams } from "expo-router";
import { Check, RotateCcw, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ZoneKey } from "../../../../../components/3d/SkeletonViewer";
import { Button } from "../../../../../components/ui/Button";
import { accents, colors, radii, spacing, typography } from "../../../../../constants/theme";
import { useAuth } from "../../../../../lib/auth-context";
import { ZONE_DETAILS } from "../../../../../lib/bones-data";
import { saveQuizResult } from "../../../../../lib/firestore";
import { QUIZ_QUESTIONS } from "../../../../../lib/quiz-data";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { zoneKey } = useLocalSearchParams<{ zoneKey: string }>();
  const zone: ZoneKey = zoneKey === "ax" || zoneKey === "inf" ? zoneKey : "sup";
  const detail = ZONE_DETAILS[zone];
  const accent = accents[detail.accentKey];
  const questions = QUIZ_QUESTIONS[zone] ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const current = questions[currentIndex];
  const hasSelection = selectedIndexes.length > 0;
  const isLast = currentIndex === questions.length - 1;
  const isCurrentCorrect = current
    ? selectedIndexes.length === current.correctIndexes.length &&
      selectedIndexes.every((index) => current.correctIndexes.includes(index))
    : false;

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelectedIndexes((existing) =>
      existing.includes(index)
        ? existing.filter((value) => value !== index)
        : [...existing, index],
    );
  };

  const handleValidate = () => {
    if (submitted || !hasSelection || !current) return;
    if (isCurrentCorrect) setScore((value) => value + 1);
    setSubmitted(true);
  };

  const handleNext = async () => {
    if (isLast) {
      setSavingResult(true);
      setSaveError(null);
      try {
        // if (!user) throw new Error("Utilisateur non connecté");
        // await saveQuizResult(user.uid, zone, score, questions.length);
        // setResultSaved(true);
      } catch (error) {
        console.error("Erreur sauvegarde quiz :", error);
        setResultSaved(false);
        setSaveError("Le résultat n'a pas pu être sauvegardé.");
      } finally {
        setSavingResult(false);
        setFinished(true);
      }
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedIndexes([]);
    setSubmitted(false);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedIndexes([]);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    setSavingResult(false);
    setResultSaved(false);
    setSaveError(null);
  };

  if (!current) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
        <Text style={typography.body}>Aucune question disponible pour ce module.</Text>
        <Button label="Retour" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 60;
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top + 24 }]}>
        <View style={[styles.resultIconTile, { backgroundColor: passed ? "#1B8A5A" : accent.color }]}>
          <Text style={styles.resultPercent}>{percent}%</Text>
        </View>
        <Text style={[typography.cardTitle, { marginTop: 20 }]}>
          {score} / {questions.length} bonnes réponses
        </Text>
        <Text style={[typography.body, styles.resultDescription]}>
          {passed
            ? "Bien joué ! Vous maîtrisez ce sous-module."
            : "Continuez à réviser ce sous-module."}
        </Text>
        {resultSaved && <Text style={styles.saveSuccess}>Résultat enregistré</Text>}
        {saveError && <Text style={styles.saveError}>{saveError}</Text>}
        <View style={styles.resultActions}>
          <Pressable style={styles.retryBtn} onPress={handleRetry}>
            <RotateCcw size={19} color={colors.ink} />
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
        <Pressable style={styles.iconBtn} onPress={() => router.back()} hitSlop={8}>
          <X size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, {
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              backgroundColor: accent.color,
            }]}
          />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{questions.length}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>
          {zone === "sup" ? (currentIndex < 13 ? "LA CLAVICULE" : "LA SCAPULA") : detail.eyebrow}
        </Text>
        <Text style={[typography.cardTitle, styles.question]}>{current.question}</Text>
        <Text style={styles.instruction}>Une ou plusieurs réponses peuvent être correctes.</Text>

        <View style={styles.options}>
          {current.options.map((option, index) => {
            const isSelected = selectedIndexes.includes(index);
            const isCorrect = current.correctIndexes.includes(index);
            const stateStyle = submitted
              ? isCorrect ? styles.optionCorrect : isSelected ? styles.optionWrong : styles.optionDisabled
              : isSelected ? styles.optionSelected : styles.optionIdle;
            return (
              <Pressable
                key={`${current.id}-${index}`}
                disabled={submitted}
                onPress={() => handleSelect(index)}
                style={[styles.option, stateStyle]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected, disabled: submitted }}
              >
                <Text style={[
                  styles.optionText,
                  submitted && isCorrect && styles.correctText,
                  submitted && isSelected && !isCorrect && styles.wrongText,
                ]}>
                  {LETTERS[index] ?? index + 1}. {option}
                </Text>
                {submitted && isCorrect && <Check size={18} color="#1B8A5A" strokeWidth={2.5} />}
                {submitted && isSelected && !isCorrect && <X size={18} color="#C33C2E" strokeWidth={2.5} />}
              </Pressable>
            );
          })}
        </View>

        {submitted && !isCurrentCorrect && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Réponse incorrecte</Text>
            <Text style={styles.feedbackText}>
              {current.correctIndexes.length > 1 ? "Les bonnes réponses sont :" : "La bonne réponse est :"}
            </Text>
            {current.correctIndexes.map((index) => (
              <Text key={index} style={styles.correctAnswer}>
                {LETTERS[index]}. {current.options[index]}
              </Text>
            ))}

            <Text style={styles.explanationTitle}>Pourquoi ta réponse est-elle incorrecte ?</Text>
            {selectedIndexes
              .filter((index) => !current.correctIndexes.includes(index))
              .map((index) => (
                <Text key={`wrong-${index}`} style={styles.explanation}>
                  <Text style={styles.strong}>{LETTERS[index]}. </Text>
                  {current.explanations?.[index] ??
                    "Cette proposition est incorrecte et ne fait pas partie des bonnes réponses."}
                </Text>
              ))}
            {current.correctIndexes
              .filter((index) => !selectedIndexes.includes(index))
              .map((index) => (
                <Text key={`missing-${index}`} style={styles.explanation}>
                  <Text style={styles.strong}>{LETTERS[index]}. </Text>
                  Tu as oublié cette proposition correcte : {current.options[index]}
                </Text>
              ))}
          </View>
        )}

        {submitted && isCurrentCorrect && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>Bonne réponse ! Toutes les propositions ont été correctement identifiées.</Text>
          </View>
        )}
      </ScrollView>

      {hasSelection && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
          {!submitted ? (
            <Button
              label="Valider ma réponse"
              onPress={handleValidate}
              style={{ backgroundColor: accent.color }}
            />
          ) : (
            <Button
              label={savingResult ? "Sauvegarde..." : isLast ? "Voir les résultats" : "Question suivante"}
              disabled={savingResult}
              onPress={handleNext}
              style={{ backgroundColor: accent.color }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.screenX },
  centered: { alignItems: "center", justifyContent: "center" },
  headerRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: spacing.screenX, paddingBottom: 14,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: "#EEF2F5",
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radii.iconTile,
    backgroundColor: colors.fillSoft, alignItems: "center", justifyContent: "center",
  },
  progressTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: colors.fillSoft, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999 },
  counter: { fontFamily: "IBMPlexSans_600SemiBold", fontSize: 12.5, color: colors.muted },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 24, paddingBottom: 24 },
  eyebrow: { fontFamily: "IBMPlexSans_600SemiBold", fontSize: 11.5, letterSpacing: 0.5, color: colors.muted },
  question: { marginTop: 8, marginBottom: 8 },
  instruction: { fontFamily: "IBMPlexSans_400Regular", fontSize: 13, color: colors.muted, marginBottom: 20 },
  options: { gap: 12 },
  option: {
    borderRadius: 16, borderWidth: 1.5, paddingVertical: 16, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  optionIdle: { backgroundColor: colors.surface, borderColor: colors.border },
  optionSelected: { backgroundColor: "#F3F6FA", borderColor: colors.ink },
  optionCorrect: { backgroundColor: "#F3FAF6", borderColor: "#B9DCCB" },
  optionWrong: { backgroundColor: "#FDF6F5", borderColor: "#E7C4BE" },
  optionDisabled: { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.55 },
  optionText: { fontFamily: "IBMPlexSans_500Medium", fontSize: 15, color: colors.ink, flex: 1, marginRight: 8 },
  correctText: { color: "#1B8A5A", fontFamily: "IBMPlexSans_600SemiBold" },
  wrongText: { color: "#C33C2E", fontFamily: "IBMPlexSans_600SemiBold" },
  footer: { paddingHorizontal: spacing.screenX, paddingTop: 12, backgroundColor: colors.bg },
  feedbackCard: {
    marginTop: 20, backgroundColor: "#FFF8F6", borderWidth: 1,
    borderColor: "#E7C4BE", borderRadius: 16, padding: 16, gap: 7,
  },
  feedbackTitle: { fontFamily: "IBMPlexSans_600SemiBold", color: "#A52B1F", fontSize: 17 },
  feedbackText: { fontFamily: "IBMPlexSans_500Medium", color: colors.ink, fontSize: 14 },
  correctAnswer: { fontFamily: "IBMPlexSans_500Medium", color: "#19784C", fontSize: 14, lineHeight: 21 },
  explanationTitle: {
    marginTop: 12, fontFamily: "IBMPlexSans_600SemiBold", fontSize: 15, color: colors.ink,
  },
  explanation: { fontFamily: "IBMPlexSans_400Regular", color: colors.ink, fontSize: 14, lineHeight: 21 },
  strong: { fontFamily: "IBMPlexSans_600SemiBold" },
  successCard: {
    marginTop: 20, padding: 16, borderWidth: 1, borderRadius: 16,
    backgroundColor: "#F3FAF6", borderColor: "#B9DCCB",
  },
  successText: { fontFamily: "IBMPlexSans_500Medium", fontSize: 14, color: "#19784C" },
  resultIconTile: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  resultPercent: { fontFamily: "IBMPlexSans_700Bold", fontSize: 22, color: colors.surface },
  resultDescription: { marginTop: 6, textAlign: "center" },
  resultActions: { flexDirection: "row", gap: 10, marginTop: 28, width: "100%" },
  retryBtn: {
    width: 54, height: 54, borderRadius: radii.button, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface,
    alignItems: "center", justifyContent: "center",
  },
  saveSuccess: { marginTop: 12, fontFamily: "IBMPlexSans_500Medium", fontSize: 13, color: "#1B8A5A", textAlign: "center" },
  saveError: { marginTop: 12, fontFamily: "IBMPlexSans_500Medium", fontSize: 13, color: "#C33C2E", textAlign: "center" },
});
