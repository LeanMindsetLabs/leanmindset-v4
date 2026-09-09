import { Ionicons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { approvedWelcome, prepHub } from "@/src/content/labs";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import {
  dismissPrepWelcome,
  startStarterLab,
} from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabCard from "./LabCard";

export default function PrepHomeContent() {
  const { membership } = useLabMembership();
  const doneCount = membership.preparationTasks.filter((task) => task.complete).length;
  const total = membership.preparationTasks.length;
  const allDone = total > 0 && doneCount === total;
  const next = membership.preparationTasks.find((task) => !task.complete);

  if (!membership.welcomeDismissed) {
    return (
      <View style={styles.root}>
        <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
          {approvedWelcome.eyebrow}
        </Text>
        <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
          {approvedWelcome.title}
        </Text>
        <LabCard>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            {`${approvedWelcome.startLabel} ${membership.startDate ?? "soon"}`}
          </Text>
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            {approvedWelcome.prepLabel}
          </Text>
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            {approvedWelcome.body}
          </Text>
          <BlueCta label={approvedWelcome.cta} onPress={dismissPrepWelcome} />
        </LabCard>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        {prepHub.eyebrow}
      </Text>
      <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
        {prepHub.title}
      </Text>
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {allDone ? prepHub.completeTitle : `${prepHub.cardTitle} ${doneCount}/${total}`}
        </Text>
        {allDone ? (
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            {prepHub.completeBody}
          </Text>
        ) : null}
        {membership.preparationTasks.map((task) => (
          <Pressable
            key={task.id}
            accessibilityRole="button"
            onPress={() => router.push(`/labs/prep/${task.id}` as Href)}
            style={({ pressed }) => [styles.taskRow, pressed ? styles.pressed : null]}
          >
            <Ionicons
              name={task.complete ? "checkbox" : "ellipse-outline"}
              size={20}
              color={task.complete ? colors.accent : colors.textMuted}
            />
            <Text style={styles.taskLabel} maxFontSizeMultiplier={1.3}>
              {task.title}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
        <BlueCta
          label={allDone ? prepHub.startCta : prepHub.continueCta}
          onPress={() => {
            if (allDone) {
              startStarterLab();
              return;
            }
            if (next) router.push(`/labs/prep/${next.id}` as Href);
          }}
        />
      </LabCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accentBlue,
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
