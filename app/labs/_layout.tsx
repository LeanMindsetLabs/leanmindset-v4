import { Stack } from "expo-router";
import { colors } from "@/src/theme/colors";
import { RequireSession } from "@/src/ui/RequireSession";

export default function LabsLayout() {
  return (
    <RequireSession>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[labId]" />
        <Stack.Screen name="join" />
        <Stack.Screen name="submitted" />
        <Stack.Screen name="prep" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="results" />
      </Stack>
    </RequireSession>
  );
}
