import { router } from "expo-router";
import { Bone } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../lib/auth-context";

const SOCIAL_LOGIN_ENABLED = true;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function SignInScreen() {
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Adresse e-mail requise.";
    else if (!isValidEmail(email)) next.email = "Adresse e-mail invalide.";
    if (!password) next.password = "Mot de passe requis.";
    else if (password.length < 8) next.password = "8 caractères minimum.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.replace("/home");
    } catch (e) {
      setErrors({
        password: "Impossible de se connecter. Vérifiez vos identifiants.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandMark}>
          <Bone color={colors.surface} size={30} strokeWidth={2} />
        </View>

        <Text style={[typography.display, styles.title]}>
          Ostéologie{"\n"}Guide
        </Text>
        <Text style={[typography.body, styles.subtitle]}>
          Atlas 3D du squelette humain pour les étudiants en médecine.
        </Text>

        <View style={styles.form}>
          <TextField
            label="ADRESSE E-MAIL"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="vous@exemple.com"
          />
          <TextField
            label="MOT DE PASSE"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureToggle
            placeholder="••••••••"
          />
          <Pressable
            style={styles.forgotWrap}
            hitSlop={8}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </Pressable>
        </View>

        <Button
          label="Se connecter"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
        />

        {SOCIAL_LOGIN_ENABLED && (
          <>
            <View style={styles.dividerRow}>
              <View style={styles.hairline} />
              <Text style={styles.dividerLabel}>ou continuer avec</Text>
              <View style={styles.hairline} />
            </View>

            <View style={styles.socialRow}>
              <Button
                label="Google"
                variant="social"
                onPress={signInWithGoogle}
                style={styles.socialBtn}
              />
              <Button
                label="Apple"
                variant="social"
                onPress={signInWithApple}
                style={styles.socialBtn}
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={typography.caption}>
          Pas encore de compte ?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/sign-up")}
          >
            Créer un compte
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: {
    paddingHorizontal: spacing.screenXAuth,
    paddingTop: 52,
    paddingBottom: 24,
  },
  brandMark: {
    width: 64,
    height: 64,
    borderRadius: radii.iconTile + 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: { marginTop: 26 },
  subtitle: { marginTop: 10 },
  form: { marginTop: 32, gap: spacing.md },
  forgotWrap: { alignSelf: "flex-end" },
  forgotText: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 13,
    color: colors.muted,
  },
  submitBtn: { marginTop: spacing.xxl },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    gap: 10,
  },
  hairline: { flex: 1, height: 1, backgroundColor: colors.borderSoft },
  dividerLabel: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 12.5,
    color: colors.mutedLight,
  },
  socialRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  socialBtn: { flex: 1 },
  footer: {
    paddingHorizontal: spacing.screenXAuth,
    paddingBottom: Platform.OS === "ios" ? 24 : 20,
    alignItems: "center",
  },
  footerLink: { fontFamily: "IBMPlexSans_600SemiBold", color: colors.primary },
});
