import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, CheckCircle2, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZoneKey } from "../../../../../components/3d/SkeletonViewer";
import { Button } from "../../../../../components/ui/Button";
import { CourseReaderModal } from "../../../../../components/ui/CourseReaderModal";

import {
  accents,
  colors,
  radii,
  spacing,
  typography,
} from "../../../../../constants/theme";

import { ZONE_DETAILS } from "../../../../../lib/bones-data";
import { COURSE_DOCUMENTS } from "../../../../../lib/course-data";

export default function QuizPreparationScreen() {
  const insets = useSafeAreaInsets();

  const { zoneKey } = useLocalSearchParams<{ zoneKey: string }>();

  const zone = (zoneKey as ZoneKey) ?? "sup";

  const detail = ZONE_DETAILS[zone] ?? ZONE_DETAILS.sup;

  const accent = accents[detail.accentKey];

  const course = COURSE_DOCUMENTS[zone];

  // If a course exists, open it automatically
  // before allowing the user to start the quiz.
  const [readerVisible, setReaderVisible] = useState(Boolean(course));

  const [courseConsulted, setCourseConsulted] = useState(false);

  const closeCourse = () => {
    setReaderVisible(false);
    setCourseConsulted(true);
  };

  const startQuiz = () => {
    router.replace(`/modules/osteologie/quiz/${zone}`);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2.2} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>{detail.eyebrow}</Text>

          <Text style={typography.headerTitle}>Préparation au quiz</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.iconTile,
            {
              backgroundColor: `${accent.color}18`,
            },
          ]}
        >
          {courseConsulted ? (
            <CheckCircle2 size={34} color={accent.color} strokeWidth={1.8} />
          ) : (
            <BookOpen size={34} color={accent.color} strokeWidth={1.8} />
          )}
        </View>

        <Text style={styles.title}>
          {courseConsulted
            ? "Cours consulté"
            : "Consultez le cours avant le quiz"}
        </Text>

        <Text style={styles.description}>
          {courseConsulted
            ? "Vous pouvez maintenant commencer le quiz ou relire le support de cours."
            : "Prenez quelques minutes pour revoir le support de cours avant de tester vos connaissances."}
        </Text>

        {course ? (
          <View style={styles.courseCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.courseLabel}>SUPPORT DE COURS</Text>

              <Text style={styles.courseTitle}>{course.title}</Text>

              <Text style={styles.coursePages}>
                {course.pages.length} pages
              </Text>
            </View>

            <BookOpen size={24} color={accent.color} />
          </View>
        ) : (
          <View style={styles.courseCard}>
            <Text style={styles.description}>
              Aucun support de cours n'est encore disponible pour ce module.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {course && (
          <Button
            label={courseConsulted ? "Relire le cours" : "Lire le cours"}
            variant="secondary"
            onPress={() => setReaderVisible(true)}
          />
        )}

        <Button
          label="Commencer le quiz"
          disabled={Boolean(course) && !courseConsulted}
          onPress={startQuiz}
          style={{
            backgroundColor: accent.color,
          }}
        />
      </View>

      {course && (
        <CourseReaderModal
          visible={readerVisible}
          title={course.title}
          pages={course.pages}
          onClose={closeCourse}
        />
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.iconTile,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  eyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 2,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconTile: {
    width: 78,
    height: 78,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginTop: 20,
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 22,
    color: colors.ink,
    textAlign: "center",
  },

  description: {
    marginTop: 8,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
  },

  courseCard: {
    width: "100%",
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  courseLabel: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.7,
    color: colors.muted,
  },

  courseTitle: {
    marginTop: 3,
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 16,
    color: colors.ink,
  },

  coursePages: {
    marginTop: 3,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12,
    color: colors.muted,
  },

  actions: {
    gap: 10,
  },
});
