import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { starterLab, starterLabDetail } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { labPhotos } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function StarterLabDetailScreen() {
  return (
    <ScrollableScreen>
      <LabFlowHeader compact eyebrow={starterLabDetail.eyebrow} title={starterLabDetail.title} />

      <View style={styles.hero}>
        <Image source={labPhotos[starterLab.photo]} style={styles.heroPhoto} contentFit="cover" />
        <LinearGradient
          colors={["rgba(15,17,18,0)", "rgba(15,17,18,0.15)", "rgba(15,17,18,0.55)"]}
          locations={[0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Join Starter Lab"
          onPress={() => router.push("/labs/join")}
          style={({ pressed }) => [styles.heroCta, pressed && styles.heroCtaPressed]}
        >
          <Text style={styles.heroCtaText} maxFontSizeMultiplier={1.2}>
            {starterLabDetail.joinCta}
          </Text>
        </Pressable>
      </View>

      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {starterLab.pitch}
      </Text>

      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {starterLabDetail.includedTitle}
        </Text>
        {starterLabDetail.included.map((item) => (
          <View key={item} style={styles.includedRow}>
            <Text style={styles.check} maxFontSizeMultiplier={1.2}>
              ✓
            </Text>
            <Text style={styles.bullet} maxFontSizeMultiplier={1.4}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {starterLabDetail.howTitle}
        </Text>
        {starterLabDetail.steps.map((step) => (
          <View key={step.number} style={styles.step}>
            <Text style={styles.stepNum} maxFontSizeMultiplier={1.2}>
              {step.number}
            </Text>
            <View style={styles.stepCopy}>
              <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
                {step.title}
              </Text>
              <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
                {step.body}
              </Text>
            </View>
          </View>
        ))}
        <BlueCta
          label={starterLabDetail.joinCta}
          accessibilityLabel="Join Starter Lab"
          onPress={() => router.push("/labs/join")}
        />
        <Text style={styles.note} maxFontSizeMultiplier={1.4}>
          Free. Your coach reviews every request before the Lab starts.
        </Text>
      </View>
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    aspectRatio: 1.7,
    minHeight: 160,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    justifyContent: "flex-end",
  },
  heroPhoto: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  heroCta: {
    alignSelf: "flex-start",
    margin: spacing.md,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCtaPressed: {
    opacity: 0.88,
  },
  heroCtaText: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  includedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  check: {
    ...typography.body,
    color: colors.accentBlue,
    fontWeight: "700",
  },
  bullet: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  stepNum: {
    ...typography.heading3,
    color: colors.accentBlue,
    minWidth: 28,
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  note: {
    ...typography.bodySmall,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
