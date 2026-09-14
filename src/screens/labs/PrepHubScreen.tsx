import { Ionicons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { prepHub } from "@/src/content/labs";
import { formatCohortCountdown } from "@/src/lib/cohortStart";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import {
  canStartStarterLab,
  prepIsComplete,
  prepTaskStatus,
  startDateLabel,
  startStarterLab,
} from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function PrepHubScreen() {
  const { membership } = useLabMembership();
  const doneCount = membership.preparationTasks.filter((task) => task.complete).length;
  const total = membership.preparationTasks.length;
  const allDone = prepIsComplete(membership);
  const next = membership.preparationTasks.find((task) => !task.complete);
  const canStart = canStartStarterLab(membership);
  const startLabel = startDateLabel(membership);
  const countdown = formatCohortCountdown(membership.startDate);
  const eyebrow = startLabel ? `Starts ${startLabel}` : prepHub.eyebrow;

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={eyebrow} title={prepHub.title} />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {allDone ? prepHub.completeTitle : `${prepHub.cardTitle} ${doneCount}/${total}`}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {allDone
            ? membership.offMondayStartGranted
              ? prepHub.grantedBody
              : `${countdown} ${prepHub.completeBody}`
            : `${countdown} Come back as often as you need. Weight, sizes, photos, and shopping can wait.`}
        </Text>
        {membership.preparationTasks.map((task) => {
          const status = prepTaskStatus(task, membership.prepChecklist);
          return (
            <Pressable
              key={task.id}
              accessibilityRole="button"
              accessibilityLabel={`${task.title}, ${status}`}
              onPress={() => router.push(`/labs/prep/${task.id}` as Href)}
              style={({ pressed }) => [styles.taskRow, pressed ? styles.pressed : null]}
            >
              <Ionicons
                name={task.complete ? "checkbox" : status === "In progress" ? "ellipse" : "ellipse-outline"}
                size={20}
                color={task.complete ? colors.accent : status === "In progress" ? colors.accentBlue : colors.textMuted}
              />
              <Text style={styles.taskLabel} maxFontSizeMultiplier={1.3}>
                {`${task.title} — ${status}`}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          );
        })}
        <BlueCta
          label={
            allDone
              ? canStart
                ? prepHub.startCta
                : `${prepHub.lockedCtaPrefix} ${startLabel}`
              : next
                ? prepHub.continueCta
                : prepHub.continueCta
          }
          disabled={allDone && !canStart}
          onPress={() => {
            if (allDone) {
              startStarterLab();
              router.replace("/(tabs)");
              return;
            }
            if (next) router.push(`/labs/prep/${next.id}` as Href);
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
  taskRow: {
    minHeight: layout.minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  taskLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  pressed: {
    opacity: 0.88,
  },
});
