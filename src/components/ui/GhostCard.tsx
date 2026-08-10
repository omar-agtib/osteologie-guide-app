import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

type Props = { title: string; icon: React.ReactNode };

export function GhostCard({ title, icon }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconTile}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 104,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#CBD9E3",
    borderStyle: "dashed",
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 10,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.fillSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
    color: colors.disabled,
    textAlign: "center",
  },
});
