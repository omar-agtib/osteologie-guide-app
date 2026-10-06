import { router, useLocalSearchParams } from "expo-router";
import {
  Bone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZoneKey } from "../../../../../components/3d/SkeletonViewer";
import { AnatomicalIdentification } from "../../../../../components/learning/AnatomicalIdentification";
import {
  colors,
  radii,
  spacing,
  typography,
} from "../../../../../constants/theme";
import { ZONE_DETAILS } from "../../../../../lib/bones-data";

type BoneOption = {
  id: string;
  title: string;
  subtitle: string;
};

const IDENTIFICATION_BONES: Partial<
  Record<ZoneKey, BoneOption[]>
    > = {
    sup: [
  {
    id: "clavicle",
    title: "Clavicule",
    subtitle: "1 planche d'identification",
  },
  {
    id: "scapula",
    title: "Scapula",
    subtitle: "2 planches d'identification",
  },
  {
    id: "humerus",
    title: "Humérus",
    subtitle: "1 planche d'identification",
  },
  {
    id: "radius",
    title: "Radius",
    subtitle: "1 planche d'identification",
  },
  {
    id: "ulna",
    title: "Ulna (Cubitus)",
    subtitle: "1 planche d'identification",
  },
  {
    id: "hand",
    title: "Squelette de la main",
    subtitle: "2 planches d'identification",
  },
],
  ax: [
    {
      id: "sternum",
      title: "Sternum",
      subtitle: "1 planche d'identification",
    },
    {
      id: "ribs",
      title: "Côtes",
      subtitle: "2 planches d'identification",
    },
    {
      id: "cervical",
      title: "Rachis cervical",
      subtitle: "4 planches d'identification",
    },
    {
      id: "thoracic",
      title: "Rachis thoracique",
      subtitle: "1 planche d'identification",
    },
    {
      id: "lumbar",
      title: "Rachis lombaire",
      subtitle: "1 planche d'identification",
    },
    {
      id: "sacrum",
      title: "Sacrum",
      subtitle: "1 planche d'identification",
    },
    {
      id: "coccyx",
      title: "Coccyx",
      subtitle: "1 planche d'identification",
    },
  ],

  inf: [
    {
      id: "coxal",
      title: "Os coxal",
      subtitle: "2 planches d'identification",
    },
    {
      id: "femur",
      title: "Fémur",
      subtitle: "2 planches d'identification",
    },
    {
      id: "patella",
      title: "Patella",
      subtitle: "1 planche d'identification",
    },
    {
      id: "tibia",
      title: "Tibia",
      subtitle: "2 planches d'identification",
    },
    {
      id: "fibula",
      title: "Fibula",
      subtitle: "1 planche d'identification",
    },
    {
      id: "foot",
      title: "Pied",
      subtitle: "2 planches d'identification",
    },
  ],
};

export default function IdentificationScreen() {
  const insets = useSafeAreaInsets();

  const { zoneKey } =
    useLocalSearchParams<{ zoneKey: string }>();

  const zone = (zoneKey as ZoneKey) ?? "sup";

  const detail =
    ZONE_DETAILS[zone] ?? ZONE_DETAILS.sup;

  const [selectedBone, setSelectedBone] =
    useState<string | null>(null);

  const bones = IDENTIFICATION_BONES[zone] ?? [];

  const handleBack = () => {
    // Si on est dans un exercice,
    // retour à la liste des os.
    if (selectedBone) {
      setSelectedBone(null);
      return;
    }

    // Sinon retour à l'écran précédent.
    router.back();
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={8}
        >
          <ChevronLeft
            size={20}
            color={colors.ink}
            strokeWidth={2.2}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>
            {detail.eyebrow}
          </Text>

          <Text style={typography.headerTitle}>
            Identification anatomique
          </Text>
        </View>
      </View>

      {/* =============================== */}
      {/* EXERCICE */}
      {/* =============================== */}

      {selectedBone ? (
        <AnatomicalIdentification
          zone={zone}
          boneId={selectedBone}
        />
      ) : (
        /* =============================== */
        /* CHOIX DE L'OS */
        /* =============================== */

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              Choisissez un os
            </Text>

            <Text style={styles.introText}>
              Sélectionnez l'os que vous souhaitez
              réviser puis identifiez les repères
              anatomiques indiqués sur les planches.
            </Text>
          </View>

          <View style={styles.bonesList}>
            {bones.map((bone) => (
              <Pressable
                key={bone.id}
                style={({ pressed }) => [
                  styles.boneCard,
                  pressed && styles.boneCardPressed,
                ]}
                onPress={() =>
                  setSelectedBone(bone.id)
                }
              >
                <View style={styles.iconContainer}>
                  <Bone
                    size={22}
                    color={colors.ink}
                    strokeWidth={1.9}
                  />
                </View>

                <View style={styles.boneInfo}>
                  <Text style={styles.boneTitle}>
                    {bone.title}
                  </Text>

                  <Text style={styles.boneSubtitle}>
                    {bone.subtitle}
                  </Text>
                </View>

                <ChevronRight
                  size={20}
                  color={colors.muted}
                  strokeWidth={2}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
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
    marginBottom: 16,
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
    paddingBottom: 32,
  },

  intro: {
    marginBottom: 20,
  },

  introTitle: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 20,
    color: colors.ink,
    marginBottom: 6,
  },

  introText: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },

  bonesList: {
    gap: 10,
  },

  boneCard: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,

    gap: 12,
  },

  boneCardPressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.iconTile,

    backgroundColor: colors.fillSoft,

    alignItems: "center",
    justifyContent: "center",
  },

  boneInfo: {
    flex: 1,
  },

  boneTitle: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 15,
    color: colors.ink,
  },

  boneSubtitle: {
    marginTop: 3,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12,
    color: colors.muted,
  },
});