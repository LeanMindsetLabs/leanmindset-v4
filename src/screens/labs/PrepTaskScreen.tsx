import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { prepTasks } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { completePrepTask } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

type PrepTaskId = keyof typeof prepTasks;

export default function PrepTaskScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const copy = (taskId && taskId in prepTasks ? prepTasks[taskId as PrepTaskId] : null) ?? {
    title: "Preparation",
    body: "Complete this step to keep getting ready.",
    cta: "Mark done",
  };

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow="Preparation" title={copy.title} />
      <View style={styles.card}>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {copy.body}
        </Text>
        <BlueCta
          label={copy.cta}
          onPress={() => {
            if (taskId) completePrepTask(taskId);
            if (router.canGoBack()) router.back();
            else router.replace("/(tabs)");
          }}
        />
      </View>
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
