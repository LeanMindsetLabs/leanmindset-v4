import { Tabs } from "expo-router";
import AppTabBar from "@/src/ui/AppTabBar";
import { RequireSession } from "@/src/ui/RequireSession";
import { colors } from "@/src/theme/colors";

export default function TabLayout() {
  return (
    <RequireSession>
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarLabel: () => null, tabBarShowLabel: false }}
      />
      <Tabs.Screen name="today" options={{ href: null }} />
      <Tabs.Screen name="meals" options={{ title: "Meals" }} />
      <Tabs.Screen name="checkin" options={{ href: null }} />
      <Tabs.Screen name="coach" options={{ title: "Coach" }} />
      <Tabs.Screen name="train" options={{ title: "Train" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
    </RequireSession>
  );
}
