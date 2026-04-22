import { BleManager, type Device, type Subscription } from "react-native-ble-plx";

export type TirePressureReading = {
  trailerId: string;
  pressuresPsi: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  receivedAt: string;
};

export class BleService {
  private readonly manager = new BleManager();
  private subscription: Subscription | null = null;

  scanForGateway(
    onDeviceFound: (device: Device) => void,
    onError?: (errorMessage: string) => void,
  ) {
    this.subscription?.remove();
    this.manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        onError?.(error.message);
        return;
      }

      if (!device?.name) {
        return;
      }

      const isLikelyGateway = device.name.toLowerCase().includes("trailer");
      if (isLikelyGateway) {
        onDeviceFound(device);
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
    this.subscription?.remove();
    this.subscription = null;
  }

  destroy() {
    this.stopScan();
    this.manager.destroy();
  }
}
