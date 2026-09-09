import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

type LabFlowHeaderProps = {
  eyebrow: string;
  title: string;
  /** Back on the left, title block on the right — saves the stacked header gap. */
  compact?: boolean;
};

export default function LabFlowHeader({ eyebrow, title, compact = false }: LabFlowHeaderProps) {
  return (
    <View style={compact ? styles.compactWrap : styles.wrap}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>
      <View style={compact ? styles.compactTitles : styles.titles}>
        <Text style={[styles.eyebrow, compact ? styles.compactEyebrow : null]} maxFontSizeMultiplier={1.3}>
          {eyebrow}
        </Text>
        <Text style={compact ? styles.compactTitle : typography.heading1} maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  compactWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  back: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  titles: {
    gap: 2,
  },
  compactTitles: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2,
  },
  compactTitle: {
    ...typography.heading1,
    textAlign: "right",
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  compactEyebrow: {
    textAlign: "right",
  },
});
