import { RequireSession } from "@/src/ui/RequireSession";
import WorkoutScreen from "@/src/screens/WorkoutScreen";

export default function WorkoutRoute() {
  return (
    <RequireSession>
      <WorkoutScreen />
    </RequireSession>
  );
}
