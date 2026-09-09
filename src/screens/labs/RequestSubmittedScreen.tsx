import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { requestSubmitted, starterLab } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function RequestSubmittedScreen() {
  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={requestSubmitted.eyebrow} title={requestSubmitted.title} />
      <View style={styles.card}>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {requestSubmitted.body}
        </Text>
        <View style={styles.status}>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            {starterLab.name}
          </Text>
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            {starterLab.meta}
          </Text>
          <Text style={styles.pending} maxFontSizeMultiplier={1.3}>
            {`${requestSubmitted.statusLabel}: ${requestSubmitted.statusValue}`}
          </Text>
        </View>
        <BlueCta label={requestSubmitted.backHomeCta} onPress={() => router.replace("/(tabs)")} />
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
  status: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pending: {
    ...typography.caption,
    color: colors.warning,
  },
});
