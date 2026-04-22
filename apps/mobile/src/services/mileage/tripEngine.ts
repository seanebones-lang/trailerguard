import * as Location from "expo-location";

export type TripState = "inactive" | "arming" | "active" | "paused" | "ended";

export type MileagePoint = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export type MileageEvent = {
  trailerId: string;
  distanceMiles: number;
  state: TripState;
  pointCount: number;
  hash: string;
};

export const MAX_ACCEPTED_ACCURACY_METERS = 25;
export const MAX_ACCEPTED_SPEED_MPS = 47;

export function filterMileagePoints(points: MileagePoint[]) {
  return points.filter((point) => {
    const isAccurate =
      point.accuracy === null || point.accuracy <= MAX_ACCEPTED_ACCURACY_METERS;
    return isAccurate;
  });
}

export function haversineMiles(a: MileagePoint, b: MileagePoint) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latDelta = toRadians(b.latitude - a.latitude);
  const lonDelta = toRadians(b.longitude - a.longitude);
  const latA = toRadians(a.latitude);
  const latB = toRadians(b.latitude);

  const h =
    Math.sin(latDelta / 2) ** 2 +
    Math.sin(lonDelta / 2) ** 2 * Math.cos(latA) * Math.cos(latB);
  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(h));
}

export function computeMileageMiles(points: MileagePoint[]) {
  if (points.length < 2) {
    return 0;
  }

  return points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    return sum + haversineMiles(previous, point);
  }, 0);
}

export async function requestMileagePermissions() {
  const [foreground, background] = await Promise.all([
    Location.requestForegroundPermissionsAsync(),
    Location.requestBackgroundPermissionsAsync(),
  ]);

  return {
    foregroundGranted: foreground.granted,
    backgroundGranted: background.granted,
  };
}
