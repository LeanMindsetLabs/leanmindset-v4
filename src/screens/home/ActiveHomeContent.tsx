import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { activeHome } from "@/src/content/labs";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { toggleDailyTask } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import PlanCard from "@/src/ui/PlanCard";
import LabCard from "./LabCard";

export default function ActiveHomeContent() {
  const { membership } = useLabMembership();
  const done = membership.dailyTasks.filter((task) => task.complete).length;
  const total = membership.dailyTasks.length;
  const next = membership.dailyTasks.find((task) => !task.complete);
  const day = membership.progress?.day ?? membership.day ?? 1;
  const totalDays = membership.progress?.totalDays ?? 30;

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        {`${activeHome.eyebrowPrefix} ${day} of ${totalDays}`}
      </Text>
      <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
        {membership.labName ?? "Starter Lab"}
      </Text>
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {`${activeHome.todayTitle} — ${done}/${total || 0}`}
        </Text>
        {next ? (
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            {`Next up: ${next.title}`}
          </Text>
        ) : (
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            Today’s plan is complete.
          </Text>
        )}
        <BlueCta
          label={activeHome.continueCta}
          onPress={() => {
            if (next?.id === "train") {
              router.push("/(tabs)/train");
              return;
            }
            if (next?.id === "checkin") {
              router.push("/(tabs)/checkin");
              return;
            }
            if (next) {
              router.push("/(tabs)/meals");
            }
          }}
        />
      </LabCard>
      <View style={styles.tasks}>
        {membership.dailyTasks.map((task) => (
          <PlanCard
            key={task.id}
            title={task.title}
            meta={task.meta ?? ""}
            complete={task.complete}
            onPress={() => toggleDailyTask(task.id)}
          />
        ))}
      </View>
      <BlueCta label={activeHome.progressCta} onPress={() => router.push("/labs/progress")} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
    paddingBottom: layout.tabBarContentInset,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  tasks: {
    gap: spacing.sm,
  },
});
