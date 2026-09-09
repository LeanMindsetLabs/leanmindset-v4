import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { labResults } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function LabResultsScreen() {
  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={labResults.eyebrow} title={labResults.title} />
      <View style={styles.card}>
        {labResults.rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
              {row.label}
            </Text>
            <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
              {row.value}
            </Text>
          </View>
        ))}
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {labResults.body}
        </Text>
        <BlueCta label={labResults.homeCta} onPress={() => router.replace("/(tabs)")} />
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
  row: {
    gap: spacing.xs,
  },
});
