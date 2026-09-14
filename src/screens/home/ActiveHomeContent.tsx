import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { planForDay } from "@/src/content/starterProgram";
import { activeHome, homeLabStatus } from "@/src/content/labs";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { loadWorkout } from "@/src/services/workoutSessionService";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import HomeHeroChart from "@/src/ui/HomeHeroChart";
import InsightCard from "@/src/ui/InsightCard";
import PlanCard from "@/src/ui/PlanCard";
import HomeGreeting from "./HomeGreeting";
import LabCard from "./LabCard";

export default function ActiveHomeContent() {
  const { membership } = useLabMembership();
  const done = membership.dailyTasks.filter((task) => task.complete).length;
  const total = membership.dailyTasks.length;
  const next = membership.dailyTasks.find((task) => !task.complete);
  const day = membership.progress?.day ?? membership.day ?? 1;
  const totalDays = membership.progress?.totalDays ?? 30;

  useEffect(() => {
    loadWorkout(planForDay(day).trainId);
  }, [day]);

  function openTask(id: string) {
    if (id === "train") {
      router.push("/(tabs)/train");
      return;
    }
    if (id === "checkin") {
      router.push("/(tabs)/checkin");
      return;
    }
    router.push("/(tabs)/meals");
  }

  return (
    <View style={styles.root}>
      <HomeGreeting subgreeting={homeLabStatus.active.subgreeting} />
      <HomeHeroChart />
      <InsightCard
        title={`${homeLabStatus.active.title} — ${membership.labName ?? "Starter Lab"}`}
        body={`Day ${day} of ${totalDays}. ${
          next ? `Next up: ${next.title}.` : "Today’s plan is complete."
        } ${homeLabStatus.active.body}`}
        cta={homeLabStatus.active.cta}
        ctaLayout="stack"
        onPress={() => {
          if (next) openTask(next.id);
        }}
      />
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
            if (next) openTask(next.id);
          }}
          disabled={!next}
        />
      </LabCard>
      <View style={styles.tasks}>
        {membership.dailyTasks.map((task) => (
          <PlanCard
            key={task.id}
            title={task.title}
            meta={task.meta ?? ""}
            complete={task.complete}
            onPress={() => openTask(task.id)}
          />
        ))}
      </View>
      <BlueCta label={activeHome.progressCta} onPress={() => router.push("/labs/progress")} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.sectionGap,
    paddingBottom: layout.tabBarContentInset,
  },
  tasks: {
    gap: spacing.sm,
  },
});
