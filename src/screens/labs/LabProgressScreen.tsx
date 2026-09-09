import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { completeStarterLab } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import ProgressBar from "@/src/ui/ProgressBar";
import LabFlowHeader from "./LabFlowHeader";

export default function LabProgressScreen() {
  const { membership } = useLabMembership();
  const day = membership.progress?.day ?? membership.day ?? 0;
  const total = membership.progress?.totalDays ?? 30;
  const percent = (membership.progress?.percent ?? 0) / 100;
  const done = membership.dailyTasks.filter((task) => task.complete).length;

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={membership.labName ?? "Starter Lab"} title="Progress" />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {`Day ${day} of ${total}`}
        </Text>
        <ProgressBar progress={percent} />
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {`Today ${done}/${membership.dailyTasks.length || 0} complete`}
        </Text>
        <BlueCta
          label="Mark Lab complete"
          onPress={() => {
            completeStarterLab();
            router.replace("/labs/results");
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
    gap: spacing.md,
  },
});
