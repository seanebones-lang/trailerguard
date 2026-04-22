import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { useAuthStore } from "../../store/authStore";

export function SettingsScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Screen>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.sectionBody}>Manage app access, notifications, and telemetry defaults.</Text>
      </View>

      <Pressable onPress={signOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1C2537",
    backgroundColor: "#0C111D",
    padding: 14,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionBody: {
    color: "#94A3B8",
    marginTop: 6,
  },
  signOutButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#7F1D1D",
  },
  signOutText: {
    color: "#FECACA",
    fontWeight: "700",
  },
});
