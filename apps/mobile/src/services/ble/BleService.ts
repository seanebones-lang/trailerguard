import { BleManager, type Device, type Subscription, type Characteristic } from "react-native-ble-plx";
import { Buffer } from "buffer";

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
  private deviceSubscription: Subscription | null = null;
  private connectedDevice: Device | null = null;

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

      const isLikelyGateway = device.name.toLowerCase().includes("trailer") || device.name.toLowerCase().includes("guard");
      if (isLikelyGateway) {
        onDeviceFound(device);
      }
    });
  }

  async connectToGateway(device: Device, onPressureUpdate: (reading: TirePressureReading) => void, onError?: (errorMessage: string) => void) {
    try {
      this.stopScan();
      const connected = await this.manager.connectToDevice(device.id);
      this.connectedDevice = connected;
      await connected.discoverAllServicesAndCharacteristics();

      // Subscribe to TPMS characteristics (standard environmental sensing or custom - adjust per your gateway)
      const serviceUUID = "0000181a-0000-1000-8000-00805f9b34fb"; // Environmental Sensing
      const pressureCharacteristicUUID = "00002a6e-0000-1000-8000-00805f9b34fb"; // Pressure

      const subscription = connected.monitorCharacteristicForService(
        serviceUUID,
        pressureCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            onError?.(error.message);
            return;
          }
          if (characteristic?.value) {
            const pressureData = this.parseTirePressure(characteristic.value);
            onPressureUpdate({
              trailerId: device.id,
              pressuresPsi: pressureData,
              receivedAt: new Date().toISOString(),
            });
          }
        }
      );
      this.deviceSubscription = subscription;

      console.log(`✅ Connected to gateway: ${device.name || device.id}`);
    } catch (error: any) {
      onError?.(error.message || "Connection failed");
    }
  }

  private parseTirePressure(base64Value: string): { frontLeft: number; frontRight: number; rearLeft: number; rearRight: number } {
    // Real parsing depends on your gateway's BLE protocol. This is a realistic placeholder.
    // Typical TPMS sends pressure in kPa or PSI in manufacturer data or specific characteristic.
    const bytes = Buffer.from(base64Value, "base64");
    return {
      frontLeft: (bytes[0] || 32) / 1.0,
      frontRight: (bytes[1] || 32) / 1.0,
      rearLeft: (bytes[2] || 35) / 1.0,
      rearRight: (bytes[3] || 35) / 1.0,
    };
  }

  stopScan() {
    this.manager.stopDeviceScan();
    this.subscription?.remove();
    this.subscription = null;
  }

  disconnect() {
    if (this.connectedDevice) {
      this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
    }
    this.deviceSubscription?.remove();
    this.deviceSubscription = null;
  }

  destroy() {
    this.disconnect();
    this.stopScan();
    this.manager.destroy();
  }
}
