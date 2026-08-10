import { router } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing, typography } from "../../../constants/theme";
import { useAuth } from "../../../lib/auth-context";

export default function ProfilScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user?.displayName ?? user?.email ?? "?").slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text style={[typography.cardTitle, { marginTop: 14 }]}>
        {user?.displayName ?? "Étudiant"}
      </Text>
      <Text style={[typography.body, { marginTop: 2 }]}>{user?.email}</Text>

      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <LogOut size={18} color="#C33C2E" strokeWidth={2} />
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.screenX,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DCE7EE",
    borderWidth: 1,
    borderColor: "#CBD9E3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "IBMPlexSans_700Bold",
    fontSize: 22,
    color: colors.primary,
  },
  signOutBtn: {
    marginTop: 32,
    width: "100%",
    height: 52,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: "#E7C4BE",
    backgroundColor: "#FDF6F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 15,
    color: "#C33C2E",
  },
});
