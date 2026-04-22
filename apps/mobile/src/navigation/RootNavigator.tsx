import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { DashboardScreen } from "../screens/app/DashboardScreen";
import { SettingsScreen } from "../screens/app/SettingsScreen";
import { TrailersScreen } from "../screens/app/TrailersScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { useAuthStore } from "../store/authStore";
import type { AppTabsParamList, AuthStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabsParamList>();

const tabIconNameMap: Record<keyof AppTabsParamList, string> = {
  Dashboard: "speedometer-outline",
  Trailers: "trail-sign-outline",
  Settings: "settings-outline",
};

function AppTabNavigator() {
  return (
    <AppTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0C111D",
          borderTopColor: "#1C2537",
        },
        tabBarActiveTintColor: "#7CC7FF",
        tabBarInactiveTintColor: "#7A869A",
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            color={color}
            name={tabIconNameMap[route.name as keyof AppTabsParamList]}
            size={size}
          />
        ),
      })}
    >
      <AppTabs.Screen component={DashboardScreen} name="Dashboard" />
      <AppTabs.Screen component={TrailersScreen} name="Trailers" />
      <AppTabs.Screen component={SettingsScreen} name="Settings" />
    </AppTabs.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={SignInScreen} name="SignIn" />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const session = useAuthStore((state) => state.session);
  return session ? <AppTabNavigator /> : <AuthNavigator />;
}
