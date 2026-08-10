import { router } from "expo-router";
import { CheckCircle2, Mail } from "lucide-react-native";
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

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Adresse e-mail requise.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Adresse e-mail invalide.");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      // Firebase intentionally doesn't reveal whether an email exists, for
      // privacy — so most errors here are just network/rate-limit issues.
      const code = e?.code as string | undefined;
      if (code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez plus tard.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.screen}>
        <View style={styles.confirmWrap}>
          <View style={styles.successIconTile}>
            <CheckCircle2 size={30} color={colors.surface} strokeWidth={2} />
          </View>
          <Text
            style={[
              typography.cardTitle,
              { marginTop: 20, textAlign: "center" },
            ]}
          >
            E-mail envoyé
          </Text>
          <Text
            style={[typography.body, { marginTop: 8, textAlign: "center" }]}
          >
            Si un compte existe pour {email.trim()}, un lien de réinitialisation
            vient d'être envoyé. Vérifiez aussi vos spams.
          </Text>
          <Button
            label="Retour à la connexion"
            onPress={() => router.replace("/sign-in")}
            style={{ marginTop: 28, alignSelf: "stretch" }}
          />
        </View>
      </View>
    );
  }

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
          <Mail color={colors.surface} size={26} strokeWidth={2} />
        </View>

        <Text style={[typography.display, styles.title]}>
          Mot de passe{"\n"}oublié
        </Text>
        <Text style={[typography.body, styles.subtitle]}>
          Entrez votre adresse e-mail, nous vous envoyons un lien de
          réinitialisation.
        </Text>

        <View style={styles.form}>
          <TextField
            label="ADRESSE E-MAIL"
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="vous@exemple.com"
          />
        </View>

        <Button
          label="Envoyer le lien"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={typography.caption}>
          <Text style={styles.footerLink} onPress={() => router.back()}>
            Retour à la connexion
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
  confirmWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenXAuth,
  },
  successIconTile: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1B8A5A",
    alignItems: "center",
    justifyContent: "center",
  },
});
