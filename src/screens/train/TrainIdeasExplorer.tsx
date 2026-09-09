import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { explorerTrain } from "@/src/content/labs";
import { useWorkoutRuntime } from "@/src/hooks/useWorkoutRuntime";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import {
  describeWorkoutSearch,
  exerciseMeta,
  getExplorerWorkoutCatalog,
  searchWorkouts,
  workoutCardForSession,
  workoutFocusLabel,
  type ExplorerWorkoutCard,
  type WorkoutFocus,
  type WorkoutSession,
} from "@/src/services/trainService";
import { loadWorkout, markWorkoutDone, startSession } from "@/src/services/workoutSessionService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import AiSearchBar, { type AiSearchPrompt } from "@/src/ui/AiSearchBar";
import BlueCta from "@/src/ui/BlueCta";
import LabsPlanCta from "@/src/ui/LabsPlanCta";
import SecondaryButton from "@/src/ui/SecondaryButton";
import TrainThumb from "@/src/ui/TrainThumb";

const FOCUSES: Array<"all" | WorkoutFocus> = ["all", "walk", "core", "strength", "mobility"];

const SEARCH_PROMPTS: AiSearchPrompt[] = [
  { label: "20 min walk", query: "20 min walk" },
  { label: "Core", query: "core workout" },
  { label: "Beginner", query: "beginner workout" },
  { label: "Mobility", query: "mobility stretch" },
];

type Props = {
  curated: boolean;
};

export default function TrainIdeasExplorer({ curated }: Props) {
  const catalog = useMemo(() => getExplorerWorkoutCatalog(), []);
  const runtime = useWorkoutRuntime();
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<(typeof FOCUSES)[number]>("all");
  const [selected, setSelected] = useState<ExplorerWorkoutCard | null>(null);
  const [loading, setLoading] = useState(false);
  const searching = query.trim().length > 0;
  const visible = useMemo(() => {
    if (searching) return searchWorkouts(query, catalog, focus);
    return focus === "all" ? catalog : catalog.filter((entry) => entry.focus === focus);
  }, [catalog, focus, query, searching]);

  function startWorkout(session: WorkoutSession) {
    if (loading || (runtime.session.id === session.id && runtime.session.completed)) return;
    setLoading(true);
    if (runtime.session.id === session.id && runtime.session.inProgress) {
      startSession();
    } else {
      loadWorkout(session.id, true);
    }
    setTimeout(() => {
      setLoading(false);
      router.push("/workout");
    }, 180);
  }

  if (selected) {
    const session = selected.session;
    return (
      <ScrollableScreen>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => setSelected(null)}
          style={styles.back}
        >
          <Text style={styles.backLabel} maxFontSizeMultiplier={1.3}>
            ← Train
          </Text>
        </Pressable>
        <TrainThumb illustration={session.illustration} height={120} radius={radius.lg} />
        <Text style={styles.slotKicker} maxFontSizeMultiplier={1.2}>
          {workoutFocusLabel(selected.focus)}
        </Text>
        <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
          {session.title}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {session.durationMin}–{session.durationMax} min · {session.difficulty}
        </Text>
        <View style={styles.card}>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            Moves
          </Text>
          {session.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.moveRow}>
              <TrainThumb illustration={exercise.illustration} height={44} width={44} radius={radius.sm} />
              <View style={styles.mealCopy}>
                <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
                  {exercise.name}
                </Text>
                <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
                  {exerciseMeta(exercise)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <BlueCta
          label={loading ? "Starting…" : "Start workout"}
          disabled={loading}
          onPress={() => startWorkout(session)}
        />
        {!curated ? (
          <View style={styles.card}>
            <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
              {explorerTrain.ctaTitle}
            </Text>
            <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
              {explorerTrain.ctaBody}
            </Text>
            <BlueCta label={explorerTrain.cta} onPress={() => router.push("/labs")} />
          </View>
        ) : null}
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen
      footer={
        curated ? undefined : (
          <LabsPlanCta title={explorerTrain.ctaTitle} body={explorerTrain.ctaBody} cta={explorerTrain.cta} />
        )
      }
    >
      {curated ? (
        <>
          <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
            Train
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={runtime.session.title}
            onPress={() => setSelected(workoutCardForSession(runtime.session))}
            style={({ pressed }) => [styles.mealCard, pressed ? styles.pressed : null]}
          >
            <TrainThumb illustration={runtime.session.illustration} height={56} width={56} radius={radius.md} />
            <View style={styles.mealCopy}>
              <Text style={styles.slotKicker} maxFontSizeMultiplier={1.2}>
                Today
              </Text>
              <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
                {runtime.session.title}
              </Text>
              <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
                {runtime.session.durationMin}–{runtime.session.durationMax} min · {runtime.session.difficulty}
              </Text>
            </View>
          </Pressable>
          <BlueCta
            label={runtime.session.inProgress ? "Resume session" : runtime.session.completed ? "Completed ✓" : "Start session"}
            disabled={runtime.session.completed || loading}
            onPress={() => startWorkout(runtime.session)}
          />
          <SecondaryButton
            label={runtime.session.completed ? "Completed ✓" : "Mark as done"}
            disabled={runtime.session.completed}
            onPress={markWorkoutDone}
          />
          <View style={styles.card}>
            <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
              Training adherence
            </Text>
            <View style={styles.week}>
              {runtime.week.map((day) => (
                <View key={day.date} style={styles.day}>
                  <View style={[styles.bar, day.completed && styles.barDone]} />
                  <Text style={styles.dayLabel}>{day.dayLabel}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
            {explorerTrain.title}
          </Text>
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            {explorerTrain.body}
          </Text>
        </>
      )}

      <AiSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Ask AI for workouts or exercises"
        prompts={SEARCH_PROMPTS}
      />

      {searching ? (
        <Text style={styles.searchSummary} maxFontSizeMultiplier={1.3}>
          {describeWorkoutSearch(query)}
        </Text>
      ) : (
        <Text style={styles.searchSummary} maxFontSizeMultiplier={1.3}>
          {curated ? "More workouts" : "Workout ideas"}
        </Text>
      )}

      <View style={styles.chips}>
        {FOCUSES.map((id) => {
          const active = focus === id;
          const label = id === "all" ? "All" : workoutFocusLabel(id);
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFocus(id)}
              style={[styles.chip, active ? styles.chipOn : null]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextOn : null]} maxFontSizeMultiplier={1.2}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visible.length === 0 ? (
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          No matches. Try a walk, core, or a 20 minute beginner session.
        </Text>
      ) : (
        visible.map((entry) => (
          <Pressable
            key={entry.key}
            accessibilityRole="button"
            accessibilityLabel={entry.session.title}
            onPress={() => setSelected(entry)}
            style={({ pressed }) => [styles.mealCard, pressed ? styles.pressed : null]}
          >
            <TrainThumb illustration={entry.session.illustration} height={56} width={56} radius={radius.md} />
            <View style={styles.mealCopy}>
              <Text style={styles.slotKicker} maxFontSizeMultiplier={1.2}>
                {workoutFocusLabel(entry.focus)}
              </Text>
              <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
                {entry.session.title}
              </Text>
              <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
                {entry.session.durationMin}–{entry.session.durationMax} min · {entry.session.difficulty}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  searchSummary: {
    ...typography.caption,
    color: colors.accentBlue,
    textTransform: "none",
    letterSpacing: 0.2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: {
    backgroundColor: colors.accentBlue,
  },
  chipText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "none",
    letterSpacing: 0.2,
  },
  chipTextOn: {
    color: colors.white,
  },
  mealCard: {
    minHeight: layout.minTouchTarget + 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  mealCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  slotKicker: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  moveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
  },
  back: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
  },
  backLabel: {
    ...typography.body,
    color: colors.accentBlue,
    fontWeight: "600",
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 78,
    marginTop: spacing.sm,
  },
  day: {
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  bar: {
    width: 10,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
  },
  barDone: {
    height: 54,
    backgroundColor: colors.accent,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.92,
  },
});
