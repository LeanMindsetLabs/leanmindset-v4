import { Redirect } from "expo-router";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import DailyCheckIn from "@/src/screens/coach/DailyCheckIn";
import { canCheckIn } from "@/src/services/labMembershipService";

export default function CheckInRoute() {
  const { membership } = useLabMembership();
  if (!canCheckIn(membership.lifecycle)) {
    return <Redirect href="/(tabs)/coach" />;
  }
  return <DailyCheckIn />;
}
