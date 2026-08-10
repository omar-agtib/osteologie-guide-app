import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

type Props = { percent: number };

export function ProgressBar({ percent }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(100, Math.max(0, percent))}%` },
          ]}
        />
      </View>
      <Text style={styles.label}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.fillSoft,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 12.5,
    color: colors.muted,
    minWidth: 32,
    textAlign: "right",
  },
});
