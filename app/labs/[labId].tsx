import { useLocalSearchParams } from "expo-router";
import ComingSoonLabDetailScreen from "@/src/screens/labs/ComingSoonLabDetailScreen";
import StarterLabDetailScreen from "@/src/screens/labs/StarterLabDetailScreen";

export default function LabDetailRoute() {
  const raw = useLocalSearchParams<{ labId: string | string[] }>();
  const labId = Array.isArray(raw.labId) ? raw.labId[0] : raw.labId;
  if (!labId) return null;
  if (labId === "starter") return <StarterLabDetailScreen />;
  return <ComingSoonLabDetailScreen />;
}
