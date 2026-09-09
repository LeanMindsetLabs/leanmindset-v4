import { useLabMembership } from "@/src/hooks/useLabMembership";
import TrainIdeasExplorer from "@/src/screens/train/TrainIdeasExplorer";
import { hasCuratedProgram } from "@/src/services/labMembershipService";

export default function TrainScreen() {
  const { membership } = useLabMembership();
  const curated = hasCuratedProgram(membership.lifecycle);
  return <TrainIdeasExplorer curated={curated} />;
}
