import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const settings = await Notifications.requestPermissionsAsync();
  return settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function scheduleLowPressureAlert(
  trailerName: string,
  tirePosition: string,
  pressurePsi: number,
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Low tire pressure detected",
      body: `${trailerName} ${tirePosition} is at ${pressurePsi.toFixed(1)} PSI`,
    },
    trigger: null,
  });
}
