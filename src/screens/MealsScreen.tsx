import { router } from "expo-router";
import { useUiVariant } from "@/src/context/UiVariantContext";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import MealIdeasExplorer from "@/src/screens/meals/MealIdeasExplorer";
import MealsClassic from "@/src/screens/meals/MealsClassic";
import { canLogMeals } from "@/src/services/labMembershipService";

export default function MealsScreen() {
  const { setCoachVariant } = useUiVariant();
  const { membership } = useLabMembership();

  if (!canLogMeals(membership.lifecycle)) {
    return <MealIdeasExplorer />;
  }

  return (
    <MealsClassic
      onAskCoach={() => {
        setCoachVariant("chat");
        router.push("/(tabs)/coach");
      }}
    />
  );
}
