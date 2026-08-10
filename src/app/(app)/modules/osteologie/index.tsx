import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SkeletonViewer,
  ZoneKey,
} from "../../../../components/3d/SkeletonViewer";
import { StageFrame } from "../../../../components/ui/StageFrame";
import { SubmoduleRow } from "../../../../components/ui/SubmoduleRow";
import {
  AccentKey,
  accents,
  colors,
  radii,
  spacing,
  typography,
} from "../../../../constants/theme";

type Submodule = {
  zoneKey: ZoneKey;
  accentKey: AccentKey;
  title: string;
  subtitle: string;
  zoneLabel: string;
};

const SUBMODULES: Submodule[] = [
  {
    zoneKey: "sup",
    accentKey: "red",
    title: "Squelette du Membre Supérieur",
    subtitle: "64 os · clavicule → phalanges",
    zoneLabel: "Membre Supérieur",
  },
  {
    zoneKey: "ax",
    accentKey: "dark",
    title: "Squelette Axial",
    subtitle: "80 os · crâne, rachis, thorax",
    zoneLabel: "Axial",
  },
  {
    zoneKey: "inf",
    accentKey: "green",
    title: "Squelette du Membre Inférieur",
    subtitle: "62 os · bassin → phalanges",
    zoneLabel: "Membre Inférieur",
  },
];

export default function OsteologieSubmodulesScreen() {
  const insets = useSafeAreaInsets();
  const [activeZone, setActiveZone] = useState<ZoneKey>("sup");

  const activeSubmodule = SUBMODULES.find((s) => s.zoneKey === activeZone)!;
  const activeAccent = accents[activeSubmodule.accentKey];

  const goToDetail = (zoneKey: ZoneKey) => {
    router.push(`/modules/osteologie/${zoneKey}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={19} color={colors.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={typography.headerTitle}>Ostéologie</Text>
      </View>

      <StageFrame
        flex={false}
        fixedHeight={300}
        warmBottomAlt
        showControls={false}
        topLeftPillLabel={`Zone : ${activeSubmodule.zoneLabel}`}
        style={styles.stage}
      >
        <SkeletonViewer
          activeZone={activeZone}
          accentColor={activeAccent.color}
          interactive={false}
          framing="small"
        />
      </StageFrame>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.eyebrow}>SOUS-MODULES</Text>
        <View style={{ gap: 10 }}>
          {SUBMODULES.map((s) => (
            <SubmoduleRow
              key={s.zoneKey}
              title={s.title}
              subtitle={s.subtitle}
              accentKey={s.accentKey}
              active={activeZone === s.zoneKey}
              onActivate={() => setActiveZone(s.zoneKey)}
              onNavigate={() => goToDetail(s.zoneKey)}
            />
          ))}
        </View>
        <Text style={styles.helper}>
          Maintenez une ligne pour situer la zone sur le modèle.
        </Text>
      </ScrollView>
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
  stage: {
    marginHorizontal: 0,
  },
  list: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 18,
    paddingBottom: 32,
  },
  eyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 11.5,
    letterSpacing: 0.5,
    color: colors.muted,
    marginBottom: 10,
  },
  helper: {
    textAlign: "center",
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12.5,
    color: colors.mutedLight,
    marginTop: 18,
  },
});
