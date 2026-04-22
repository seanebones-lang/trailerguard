import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { useTrailerStore } from "../../store/trailerStore";

export function TrailersScreen() {
  const trailers = useTrailerStore((state) => state.trailers);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.heading}>Trailers</Text>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Add Trailer</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {trailers.map((trailer) => (
          <View key={trailer.id} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{trailer.name}</Text>
              <Text style={styles.cardSub}>VIN: {trailer.vin ?? "Not set"}</Text>
            </View>
            <View>
              <Text style={styles.cardMetric}>{trailer.currentMileage.toFixed(1)} mi</Text>
              <Text style={styles.cardStatus}>{trailer.identityLocked ? "Identity locked" : "Pending lock"}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
  },
  actionButton: {
    backgroundColor: "#1D4ED8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    color: "#DBEAFE",
    fontWeight: "700",
  },
  content: {
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1C2537",
    backgroundColor: "#0C111D",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 16,
  },
  cardSub: {
    color: "#94A3B8",
    marginTop: 4,
  },
  cardMetric: {
    color: "#E2E8F0",
    textAlign: "right",
    fontWeight: "700",
  },
  cardStatus: {
    color: "#7CC7FF",
    marginTop: 4,
    textAlign: "right",
    fontSize: 12,
  },
});
