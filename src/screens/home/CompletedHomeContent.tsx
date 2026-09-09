import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { completedHome } from "@/src/content/labs";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabCard from "./LabCard";

export default function CompletedHomeContent() {
  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        {completedHome.eyebrow}
      </Text>
      <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
        {completedHome.title}
      </Text>
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {completedHome.resultsTitle}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {completedHome.resultsMeta}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {completedHome.resultsWeight}
        </Text>
        <BlueCta label={completedHome.resultsCta} onPress={() => router.push("/labs/results")} />
      </LabCard>
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {completedHome.nextTitle}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {completedHome.nextBody}
        </Text>
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
});
