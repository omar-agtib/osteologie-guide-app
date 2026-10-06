import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ZoomableImage } from "../ui/ZoomableImage";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { accents, colors } from "../../constants/theme";
import { ZONE_DETAILS } from "../../lib/bones-data";
import {
  IDENTIFICATION_EXERCISES,
  IdentificationLandmark,
} from "../../lib/identification-data";
import { ZoneKey } from "../3d/SkeletonViewer";
import { Button } from "../ui/Button";

type Props = {
  zone: ZoneKey;
  boneId: string;
};

function normalizeAnswer(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isCorrect(value: string, landmark: IdentificationLandmark) {
  const normalizedValue = normalizeAnswer(value);

  return landmark.answers.some(
    (answer) => normalizeAnswer(answer) === normalizedValue,
  );
}

export function AnatomicalIdentification({ zone, boneId }: Props) {
  const detail = ZONE_DETAILS[zone] ?? ZONE_DETAILS.sup;

  const accent = accents[detail.accentKey];

  // Tous les exercices de la zone
  const zoneExercises = IDENTIFICATION_EXERCISES[zone] ?? [];

  // On garde uniquement l'os sélectionné.
  // Exemple :
  // femur -> femur-anterior + femur-posterior
  const exercises = useMemo(() => {
    return zoneExercises.filter(
      (exercise) =>
        exercise.id === boneId || exercise.id.startsWith(`${boneId}-`),
    );
  }, [zoneExercises, boneId]);

  const [exerciseIndex, setExerciseIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [submitted, setSubmitted] = useState(false);

  const [imageGestureActive, setImageGestureActive] = useState(false);

  const exercise = exercises[exerciseIndex];

  // Si on change d'os, on repart de la première planche.
  useEffect(() => {
    setExerciseIndex(0);
    setAnswers({});
    setSubmitted(false);
  }, [boneId]);

  // Si on change de planche, on vide les réponses.
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [exerciseIndex]);

  const result = useMemo(() => {
    if (!exercise) {
      return {
        correct: 0,
        total: 0,
        percentage: 0,
      };
    }

    const correct = exercise.landmarks.filter((landmark) =>
      isCorrect(answers[landmark.number] ?? "", landmark),
    ).length;

    const total = exercise.landmarks.length;

    return {
      correct,
      total,
      percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    };
  }, [answers, exercise]);

  if (!exercise) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Aucun exercice disponible</Text>

        <Text style={styles.emptyText}>
          Les exercices d'identification de cet os seront bientôt disponibles.
        </Text>
      </View>
    );
  }

  const updateAnswer = (number: number, value: string) => {
    setAnswers((current) => ({
      ...current,
      [number]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  const goToNextExercise = () => {
    if (exerciseIndex >= exercises.length - 1) {
      return;
    }

    setExerciseIndex((current) => current + 1);
  };

  const goToPreviousExercise = () => {
    if (exerciseIndex <= 0) {
      return;
    }

    setExerciseIndex((current) => current - 1);
  };

  const hasPrevious = exerciseIndex > 0;

  const hasNext = exerciseIndex < exercises.length - 1;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!imageGestureActive}
      >
        {/* PLANche / PROGRESSION */}

        {exercises.length > 1 && (
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Planche {exerciseIndex + 1} / {exercises.length}
            </Text>
          </View>
        )}

        {/* TITRE */}

        <View style={styles.heading}>
          <Text style={styles.title}>{exercise.title}</Text>

          <Text style={styles.subtitle}>{exercise.subtitle}</Text>

          <Text style={styles.instructions}>
            Observez les numéros sur la planche puis indiquez le nom anatomique
            correspondant.
          </Text>
        </View>

        {/* IMAGE */}

        <View
          style={styles.imageCard}
          onTouchStart={() => setImageGestureActive(true)}
          onTouchEnd={() => setImageGestureActive(false)}
          onTouchCancel={() => setImageGestureActive(false)}
        >
          <ZoomableImage
            source={exercise.image}
            height={430}
            onGestureActiveChange={setImageGestureActive}
          />
              </View>
              {exercises.length > 1 && (
  <View style={styles.plateNavigation}>
    <Pressable
      style={[
        styles.plateArrow,
        !hasPrevious && styles.plateArrowDisabled,
      ]}
      disabled={!hasPrevious}
      onPress={goToPreviousExercise}
    >
      <ChevronLeft
        size={20}
        color={hasPrevious ? colors.ink : colors.muted}
      />
    </Pressable>

    <View style={styles.plateIndicator}>
      <Text style={styles.plateIndicatorText}>
        Planche {exerciseIndex + 1} / {exercises.length}
      </Text>

      <View style={styles.dots}>
        {exercises.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === exerciseIndex && [
                styles.dotActive,
                { backgroundColor: accent.color },
              ],
            ]}
          />
        ))}
      </View>
    </View>

    <Pressable
      style={[
        styles.plateArrow,
        !hasNext && styles.plateArrowDisabled,
      ]}
      disabled={!hasNext}
      onPress={goToNextExercise}
    >
      <ChevronRight
        size={20}
        color={hasNext ? colors.ink : colors.muted}
      />
    </Pressable>
  </View>
)}

        {/* RÉPONSES */}

        <View style={styles.answers}>
          {exercise.landmarks.map((landmark) => {
            const value = answers[landmark.number] ?? "";

            const correct = submitted ? isCorrect(value, landmark) : undefined;

            return (
              <View key={landmark.number} style={styles.answerBlock}>
                <View style={styles.answerRow}>
                  <View
                    style={[
                      styles.numberBadge,
                      {
                        backgroundColor: `${accent.color}18`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.number,
                        {
                          color: accent.color,
                        },
                      ]}
                    >
                      {landmark.number}
                    </Text>
                  </View>

                  <TextInput
                    value={value}
                    onChangeText={(text) => updateAnswer(landmark.number, text)}
                    placeholder="Nom du repère anatomique"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    style={[
                      styles.input,
                      submitted &&
                        (correct ? styles.inputCorrect : styles.inputWrong),
                    ]}
                  />
                </View>

                {submitted && (
                  <Text
                    style={[
                      styles.feedback,
                      correct ? styles.feedbackCorrect : styles.feedbackWrong,
                    ]}
                  >
                    {correct
                      ? "✓ Bonne réponse"
                      : `✕ Bonne réponse : ${landmark.answers[0]}`}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* VALIDATION */}

        {!submitted ? (
          <Button
            label="Valider mes réponses"
            onPress={() => setSubmitted(true)}
            style={{
              backgroundColor: accent.color,
            }}
          />
        ) : (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>RÉSULTAT</Text>

              <Text style={styles.resultScore}>
                {result.correct} / {result.total}
              </Text>

              <Text
                style={[
                  styles.resultPercentage,
                  {
                    color: accent.color,
                  },
                ]}
              >
                {result.percentage} %
              </Text>
            </View>

            {/* NAVIGATION ENTRE LES PLANCHES */}

            {exercises.length > 1 && (
              <View style={styles.navigation}>
                {hasPrevious && (
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Planche précédente"
                      onPress={goToPreviousExercise}
                    />
                  </View>
                )}

                {hasNext && (
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Planche suivante"
                      onPress={goToNextExercise}
                      style={{
                        backgroundColor: accent.color,
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  progressRow: {
    alignItems: "flex-end",
    marginBottom: 8,
  },

  progressText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12,
    color: colors.muted,
  },

  heading: {
    marginBottom: 16,
  },

  title: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 22,
    color: colors.ink,
  },

  subtitle: {
    marginTop: 2,
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 14,
    color: colors.muted,
  },

  instructions: {
    marginTop: 10,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },

  imageCard: {
    width: "100%",
    height: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 22,
  },

  answers: {
    gap: 14,
    marginBottom: 22,
  },

  answerBlock: {
    gap: 6,
  },

  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  numberBadge: {
    width: 42,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  number: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 16,
  },

  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
    color: colors.ink,
  },

  inputCorrect: {
    borderColor: "#1B8A5A",
  },

  inputWrong: {
    borderColor: "#C33C2E",
  },

  feedback: {
    marginLeft: 52,
    fontFamily: "IBMPlexSans_500Medium",
    fontSize: 12,
  },

  feedbackCorrect: {
    color: "#1B8A5A",
  },

  feedbackWrong: {
    color: "#C33C2E",
  },

  resultCard: {
    padding: 22,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  resultLabel: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
  },

  resultScore: {
    marginTop: 8,
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 28,
    color: colors.ink,
  },

  resultPercentage: {
    marginTop: 3,
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 18,
  },

  navigation: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 20,
    color: colors.ink,
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: "center",
    },
  plateNavigation: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  marginTop: -10,
  marginBottom: 22,
},

plateArrow: {
  width: 42,
  height: 42,
  borderRadius: 14,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: "center",
  justifyContent: "center",
},

plateArrowDisabled: {
  opacity: 0.35,
},

plateIndicator: {
  minWidth: 110,
  alignItems: "center",
},

plateIndicatorText: {
  fontFamily: "IBMPlexSans_600SemiBold",
  fontSize: 12,
  color: colors.ink,
},

dots: {
  flexDirection: "row",
  gap: 5,
  marginTop: 6,
},

dot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: colors.border,
},

dotActive: {
  width: 16,
},
});
