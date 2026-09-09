import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import AppScreen from "@/src/layout/AppScreen";
import { useResponsiveLayout } from "@/src/layout/useResponsiveLayout";
import { useWorkoutRuntime } from "@/src/hooks/useWorkoutRuntime";
import { completeSet, leaveSession, startSession, tickTimer } from "@/src/services/workoutSessionService";
import { exerciseMeta } from "@/src/services/trainService";
import { trainPhoto } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import PrimaryButton from "@/src/ui/PrimaryButton";
import ScreenHeader from "@/src/ui/ScreenHeader";

/**
 * Workout
 * Reusable: AppScreen, ScreenHeader, PrimaryButton
 * Scrolls: no — primary Complete Set stays reachable. Safe area: top + bottom.
 * State does not depend on viewport size.
 */
export default function WorkoutScreen() {
  const runtime = useWorkoutRuntime();
  const { isCompact } = useResponsiveLayout();
  const exercise = runtime.session.exercises[runtime.step];

  useEffect(() => {
    if (runtime.view !== "session") startSession();
  }, [runtime.view]);

  useEffect(() => {
    if (runtime.view !== "session") return;
    const timer = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(timer);
  }, [runtime.view]);

  if (runtime.session.completed || !exercise) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <ScreenHeader title="Workout complete" onBack={() => router.back()} />
        <PrimaryButton label="Done" onPress={() => router.back()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={["top", "bottom"]}>
      <ScreenHeader
        title={runtime.session.title}
        subtitle={`${runtime.step + 1} of ${runtime.session.exercises.length}`}
        onBack={() => {
          leaveSession();
          router.back();
        }}
      />

      <View style={styles.body}>
        <Text style={typography.heading1} maxFontSizeMultiplier={1.25}>
          {exercise.name}
        </Text>
        <View style={[styles.demo, isCompact && styles.demoCompact]}>
          {trainPhoto(exercise.illustration) ? (
            <Image source={trainPhoto(exercise.illustration)} style={styles.demoImage} contentFit="contain" />
          ) : null}
        </View>
        <Text style={typography.bodySmall}>{exercise.detail}</Text>
        <Text style={typography.heading2} maxFontSizeMultiplier={1.2}>
          Set {runtime.currentSet} / {exercise.sets}
        </Text>
        <Text style={typography.body}>{exerciseMeta(exercise)}</Text>
        <Text style={typography.metricMedium} maxFontSizeMultiplier={1.1}>
          {runtime.remaining}s
        </Text>
      </View>

      <PrimaryButton label={runtime.session.completed ? "Completed" : "Complete set"} onPress={completeSet} disabled={runtime.session.completed} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  demo: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  demoImage: {
    width: "100%",
    height: "100%",
  },
  demoCompact: {
    aspectRatio: 16 / 9,
  },
});
