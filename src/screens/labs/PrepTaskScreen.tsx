import { type Href, router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { prepTasks } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { nextPrepTaskId } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import PrepStepPanel from "./PrepStepPanel";
import LabFlowHeader from "./LabFlowHeader";

type PrepTaskId = keyof typeof prepTasks;

export default function PrepTaskScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const copy = (taskId && taskId in prepTasks ? prepTasks[taskId as PrepTaskId] : null) ?? {
    title: "Preparation",
  };
  const resource = taskId === "grocery" || taskId === "supplements";

  function goNext() {
    const next = nextPrepTaskId(taskId ?? "");
    if (next) {
      router.replace(`/labs/prep/${next}` as Href);
      return;
    }
    router.replace("/labs/prep");
  }

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={resource ? "Preparation resource" : "Preparation"} title={copy.title} />
      <View style={styles.card}>
        <PrepStepPanel key={taskId} taskId={taskId ?? ""} onDone={goNext} />
      </View>
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
