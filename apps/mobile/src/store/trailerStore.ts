import { create } from "zustand";
import type { DashboardMetrics, Trailer } from "../types/domain";

type TrailerStore = {
  trailers: Trailer[];
  dashboardMetrics: DashboardMetrics;
};

const demoTrailers: Trailer[] = [
  {
    id: "trlr_1",
    name: "West Haul 12A",
    vin: "1HGBH41JXMN109186",
    barcode: "TG-12A-WH",
    identityLocked: true,
    currentMileage: 18249.3,
  },
  {
    id: "trlr_2",
    name: "Northline 8F",
    vin: null,
    barcode: null,
    identityLocked: false,
    currentMileage: 0,
  },
];

export const useTrailerStore = create<TrailerStore>(() => ({
  trailers: demoTrailers,
  dashboardMetrics: {
    totalMileage: demoTrailers.reduce((acc, t) => acc + t.currentMileage, 0),
    lowPressureCount: 1,
    activeTrips: 2,
    onlineTrailers: 3,
  },
}));
