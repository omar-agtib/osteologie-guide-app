import { Tabs } from "expo-router";
import { Grid2x2, Home, User } from "lucide-react-native";
import { colors } from "../../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          height: 58,
        },
        tabBarLabelStyle: {
          fontFamily: "IBMPlexSans_600SemiBold",
          fontSize: 11.5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="modules/index"
        options={{
          title: "Modules",
          tabBarIcon: ({ color, size }) => (
            <Grid2x2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
