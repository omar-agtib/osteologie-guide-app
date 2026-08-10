import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
  secureToggle?: boolean;
};

export function TextField({
  label,
  error,
  secureToggle,
  secureTextEntry,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={[typography.eyebrow, styles.label]}>{label}</Text>

      {/* Container: style NEVER changes based on focus. This is the fix — the
          TextInput's direct parent must stay static or the New Architecture
          interrupts the focus handshake and swallows keystrokes. */}
      <View style={[styles.fieldBase, error && styles.fieldError]}>
        <TextInput
          {...inputProps}
          secureTextEntry={secureToggle ? !reveal : secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={styles.input}
          placeholderTextColor={colors.mutedLight}
          autoCapitalize="none"
        />
        {secureToggle && (
          <Pressable onPress={() => setReveal((v) => !v)} hitSlop={8}>
            <Text style={styles.toggle}>{reveal ? "Masquer" : "Afficher"}</Text>
          </Pressable>
        )}

        {/* Focus ring drawn as an absolute overlay, not a style change on the
            container itself — pointerEvents "none" so it never blocks taps. */}
        {focused && (
          <View pointerEvents="none" style={styles.focusRingOverlay} />
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  label: { marginBottom: spacing.xs },
  fieldBase: {
    height: 52,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldError: {
    borderColor: "#C33C2E",
  },
  focusRingOverlay: {
    position: "absolute",
    top: -1.5,
    left: -1.5,
    right: -1.5,
    bottom: -1.5,
    borderRadius: radii.input + 1.5,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    // Redraw the background under the border so the idle bg doesn't show through;
    // this sits *behind* the TextInput content visually since it's appended
    // after but TextInput/label already rendered above it in stacking order —
    // if it visually covers text, move this block to render first instead.
    zIndex: -1,
  },
  input: {
    flex: 1,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 15,
    color: colors.ink,
  },
  toggle: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 13,
    color: colors.primary,
  },
  errorText: {
    marginTop: 6,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12.5,
    color: "#C33C2E",
  },
});
