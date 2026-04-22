import { StyleSheet, Text, View } from "react-native";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#0C111D",
    borderColor: "#1C2537",
    borderWidth: 1,
    padding: 14,
    gap: 6,
    width: "48%",
  },
  label: {
    color: "#9AA4B2",
    fontSize: 12,
    fontWeight: "600",
  },
  value: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  hint: {
    color: "#7CC7FF",
    fontSize: 12,
  },
});
