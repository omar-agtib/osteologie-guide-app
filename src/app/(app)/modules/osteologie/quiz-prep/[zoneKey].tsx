import { router, useLocalSearchParams } from "expo-router";
import { Bone, BookOpen, Brain, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZoneKey } from "../../../../../components/3d/SkeletonViewer";
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

  const [readerVisible, setReaderVisible] = useState(false);

  const closeCourse = () => {
    setReaderVisible(false);
  };

  const startQuiz = () => {
    router.replace(`/modules/osteologie/quiz/${zone}`);
  };
  const startIdentification = () => {
    router.push(`/modules/osteologie/identification/${zone}`);
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
          <Bone size={36} color={accent.color} strokeWidth={1.8} />
        </View>

        <Text style={styles.title}>Choisissez votre activité</Text>

        <Text style={styles.description}>
          Consultez le cours, testez vos connaissances avec le quiz ou
          entraînez-vous à identifier les repères anatomiques.
        </Text>

        {course && (
          <View style={styles.courseInfo}>
            <Text style={styles.courseLabel}>MODULE</Text>

            <Text style={styles.courseTitle}>{course.title}</Text>

            <Text style={styles.coursePages}>
              {course.pages.length} pages de cours
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {course && (
          <Pressable
            style={styles.actionCard}
            onPress={() => setReaderVisible(true)}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: `${accent.color}18` },
              ]}
            >
              <BookOpen size={23} color={accent.color} strokeWidth={2} />
            </View>

            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Consulter le cours</Text>
              <Text style={styles.actionDescription}>
                Relire le support de cours
              </Text>
            </View>

            <Text style={[styles.actionArrow, { color: accent.color }]}>›</Text>
          </Pressable>
        )}

        <Pressable style={styles.actionCard} onPress={startQuiz}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: `${accent.color}18` },
            ]}
          >
            <Brain size={23} color={accent.color} strokeWidth={2} />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Passer le quiz</Text>
            <Text style={styles.actionDescription}>
              Tester vos connaissances
            </Text>
          </View>

          <Text style={[styles.actionArrow, { color: accent.color }]}>›</Text>
        </Pressable>

        <Pressable style={styles.actionCard} onPress={startIdentification}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: `${accent.color}18` },
            ]}
          >
            <Bone size={23} color={accent.color} strokeWidth={2} />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Identification anatomique</Text>
            <Text style={styles.actionDescription}>
              Identifier les repères sur les planches
            </Text>
          </View>

          <Text style={[styles.actionArrow, { color: accent.color }]}>›</Text>
        </Pressable>
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

  courseInfo: {
    width: "100%",
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  actionCard: {
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 15,
    color: colors.ink,
  },

  actionDescription: {
    marginTop: 2,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12,
    color: colors.muted,
  },

  actionArrow: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 28,
    lineHeight: 30,
  },

  actions: {
    gap: 10,
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
