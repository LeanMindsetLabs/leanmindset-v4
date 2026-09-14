import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { activeHome, openDailyTask } from "@/src/content/labs";
import { planForDay } from "@/src/content/starterProgram";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { completeStarterLab } from "@/src/services/labMembershipService";
import { loadWorkout } from "@/src/services/workoutSessionService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import PlanCard from "@/src/ui/PlanCard";
import ProgressBar from "@/src/ui/ProgressBar";
import LabFlowHeader from "./LabFlowHeader";

export default function LabProgressScreen() {
  const { membership } = useLabMembership();
  const day = membership.progress?.day ?? membership.day ?? 1;
  const totalDays = membership.progress?.totalDays ?? 30;
  const percent = (membership.progress?.percent ?? 0) / 100;
  const done = membership.dailyTasks.filter((task) => task.complete).length;
  const total = membership.dailyTasks.length || 5;
  const next = membership.dailyTasks.find((task) => !task.complete);

  useEffect(() => {
    if (membership.lifecycle !== "active") return;
    loadWorkout(planForDay(day).trainId);
  }, [day, membership.lifecycle]);

  if (membership.lifecycle !== "active") {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={`Day ${day} of ${totalDays}`} title={activeHome.todayTitle} />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {`${activeHome.todayTitle} — ${done}/${total}`}
        </Text>
        <ProgressBar progress={total ? done / total : percent} />
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {next ? `Next up: ${next.title}` : "Today’s plan is complete."}
        </Text>
      </View>
      <View style={styles.tasks}>
        {membership.dailyTasks.map((task) => (
          <PlanCard
            key={task.id}
            title={task.title}
            meta={task.meta ?? ""}
            complete={task.complete}
            onPress={() => openDailyTask(task.id)}
          />
        ))}
      </View>
      {__DEV__ ? (
        <BlueCta
          label="Mark Lab complete"
          onPress={() => {
            completeStarterLab();
            router.replace("/labs/results");
          }}
        />
      ) : null}
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
  tasks: {
    gap: spacing.sm,
  },
});
