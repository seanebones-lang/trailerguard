import { StyleSheet, Text, View } from "react-native";
import { MetricCard } from "../../components/MetricCard";
import { Screen } from "../../components/Screen";
import { useTrailerStore } from "../../store/trailerStore";

export function DashboardScreen() {
  const metrics = useTrailerStore((state) => state.dashboardMetrics);

  return (
    <Screen>
      <Text style={styles.heading}>Fleet Dashboard</Text>
      <Text style={styles.subheading}>Live trailer telemetry with immutable mileage</Text>

      <View style={styles.grid}>
        <MetricCard hint="Today" label="Mileage" value={`${metrics.totalMileage.toFixed(1)} mi`} />
        <MetricCard
          hint={metrics.lowPressureCount > 0 ? "Action needed" : "Healthy"}
          label="Tire Alerts"
          value={`${metrics.lowPressureCount}`}
        />
        <MetricCard label="Active Trips" value={`${metrics.activeTrips}`} />
        <MetricCard label="Online Trailers" value={`${metrics.onlineTrailers}`} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
  },
  subheading: {
    color: "#94A3B8",
    marginTop: 4,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
