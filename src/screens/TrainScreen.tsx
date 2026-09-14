import { useLabMembership } from "@/src/hooks/useLabMembership";
import TrainIdeasExplorer from "@/src/screens/train/TrainIdeasExplorer";
import { planForDay } from "@/src/content/starterProgram";
import { hasCuratedProgram } from "@/src/services/labMembershipService";
import { loadWorkout } from "@/src/services/workoutSessionService";
import { useEffect } from "react";

export default function TrainScreen() {
  const { membership } = useLabMembership();
  const curated = hasCuratedProgram(membership.lifecycle);

  useEffect(() => {
    if (membership.lifecycle !== "active") return;
    loadWorkout(planForDay(membership.day ?? 1).trainId);
  }, [membership.lifecycle, membership.day]);

  return <TrainIdeasExplorer curated={curated} />;
}
