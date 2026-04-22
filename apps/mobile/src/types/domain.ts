export type Trailer = {
  id: string;
  name: string;
  vin: string | null;
  barcode: string | null;
  identityLocked: boolean;
  currentMileage: number;
};

export type DashboardMetrics = {
  totalMileage: number;
  lowPressureCount: number;
  activeTrips: number;
  onlineTrailers: number;
};
