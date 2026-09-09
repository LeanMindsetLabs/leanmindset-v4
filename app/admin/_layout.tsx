import { Stack } from "expo-router";
import { colors } from "@/src/theme/colors";
import { RequireSession } from "@/src/ui/RequireSession";

export default function AdminLayout() {
  return (
    <RequireSession>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </RequireSession>
  );
}
