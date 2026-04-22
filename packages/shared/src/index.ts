export type TrailerIdentity = {
  trailerId: string;
  vin: string | null;
  barcode: string | null;
  identityLockedAt: string | null;
};

export type MileageEventPayload = {
  trailerId: string;
  tripId: string;
  distanceMiles: number;
  recordedAt: string;
  eventHash: string;
};
