import { router } from "expo-router";
import { Bone } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../lib/auth-context";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function SignUpScreen() {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Adresse e-mail requise.";
    else if (!isValidEmail(email)) next.email = "Adresse e-mail invalide.";
    if (!password) next.password = "Mot de passe requis.";
    else if (password.length < 8) next.password = "8 caractères minimum.";
    if (confirmPassword !== password)
      next.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signUpWithEmail(email.trim(), password);
      router.replace("/home");
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code === "auth/email-already-in-use") {
        setErrors({ email: "Un compte existe déjà avec cette adresse." });
      } else if (code === "auth/weak-password") {
        setErrors({ password: "Mot de passe trop faible." });
      } else {
        setErrors({ password: "Impossible de créer le compte. Réessayez." });
      }
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
          Créer un{"\n"}compte
        </Text>
        <Text style={[typography.body, styles.subtitle]}>
          Rejoignez Ostéologie Guide pour suivre votre progression.
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
          <TextField
            label="CONFIRMER LE MOT DE PASSE"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureToggle
            placeholder="••••••••"
          />
        </View>

        <Button
          label="Créer mon compte"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={typography.caption}>
          Déjà un compte ?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.replace("/sign-in")}
          >
            Se connecter
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
  submitBtn: { marginTop: spacing.xxl },
  footer: {
    paddingHorizontal: spacing.screenXAuth,
    paddingBottom: Platform.OS === "ios" ? 24 : 20,
    alignItems: "center",
  },
  footerLink: { fontFamily: "IBMPlexSans_600SemiBold", color: colors.primary },
});
