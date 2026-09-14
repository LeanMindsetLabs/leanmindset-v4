import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { starterLab, starterLabDetail, openMyLab, starterLabCta } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { IPHONE_15 } from "@/src/layout/WebPhonePreview";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { labPhotos } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";

export default function StarterLabDetailScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? IPHONE_15.status : insets.top;
  const { membership } = useLabMembership();
  const ctaLabel = starterLabCta(membership.lifecycle);

  function onPrimary() {
    if (membership.lifecycle === "explorer") {
      router.push("/labs/join");
      return;
    }
    openMyLab(membership.lifecycle);
  }

  return (
    <ScrollableScreen padded={false} edges={[]} contentStyle={styles.heroScreen}>
      <View style={styles.fullHero}>
        <Image
          source={labPhotos[starterLab.photo]}
          style={[styles.heroPhoto, Platform.OS === "web" ? (styles.heroPhotoMuted as never) : null]}
          contentFit="cover"
          contentPosition={{ top: "38%", left: "28%" }}
        />
        <View style={styles.heroDim} />
        <LinearGradient
          colors={["rgba(15,17,18,0.02)", "rgba(15,17,18,0.28)", colors.background]}
          locations={[0.5, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={[styles.heroBack, { top: topInset + spacing.xs }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
        <View style={styles.heroOnImage}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            onPress={onPrimary}
            style={({ pressed }) => [styles.joinBadge, pressed && styles.joinCtaPressed]}
          >
            <Text style={styles.joinBadgeText} maxFontSizeMultiplier={1.2}>
              {ctaLabel}
            </Text>
          </Pressable>
          <Text style={styles.heroTitle} maxFontSizeMultiplier={1.3}>
            {starterLabDetail.title}
          </Text>
          <Text style={styles.heroMeta} maxFontSizeMultiplier={1.3}>
            {starterLabDetail.eyebrow}
          </Text>
          <Text style={styles.heroStatement} maxFontSizeMultiplier={1.4}>
            {starterLabDetail.statement}
          </Text>
        </View>
      </View>

      <View style={styles.heroBody}>
        <View style={styles.highlights}>
          {starterLabDetail.highlights.map((item, index) => (
            <View key={item.title} style={styles.highlightCol}>
              {index > 0 ? <View style={styles.highlightRule} /> : null}
              <View style={styles.highlightCopy}>
                <HighlightIcon name={item.icon} />
                <Text style={styles.highlightTitle} maxFontSizeMultiplier={1.2}>
                  {item.title}
                </Text>
                <Text style={styles.highlightDetail} maxFontSizeMultiplier={1.3}>
                  {item.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <IncludedCard />
        <HowItWorksCard ctaLabel={ctaLabel} onPrimary={onPrimary} />
      </View>
    </ScrollableScreen>
  );
}

function HighlightIcon({ name }: { name: (typeof starterLabDetail.highlights)[number]["icon"] }) {
  if (name === "target") return <TargetIcon />;
  return <Ionicons name={name} size={20} color={colors.accentBlue} />;
}

function TargetIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={colors.accentBlue} strokeWidth={1.7} />
      <Circle cx="12" cy="12" r="4.6" stroke={colors.accentBlue} strokeWidth={1.7} />
      <Circle cx="12" cy="12" r="1.5" fill={colors.accentBlue} />
    </Svg>
  );
}

function IncludedCard() {
  return (
    <View style={styles.card}>
      <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
        {starterLabDetail.includedTitle}
      </Text>
      {starterLabDetail.included.map((item) => (
        <View key={item} style={styles.includedRow}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={12} color={colors.white} />
          </View>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.4}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function HowItWorksCard({ ctaLabel, onPrimary }: { ctaLabel: string; onPrimary: () => void }) {
  return (
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
        label={ctaLabel}
        accessibilityLabel={ctaLabel}
        onPress={onPrimary}
      />
      <Text style={styles.note} maxFontSizeMultiplier={1.4}>
        Free. Your coach reviews every request before the Lab starts.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroScreen: {
    paddingTop: 0,
    gap: 0,
  },
  fullHero: {
    aspectRatio: 1.08,
    minHeight: 260,
    overflow: "hidden",
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  heroPhoto: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  heroPhotoMuted: {
    filter: "grayscale(0.22) saturate(0.55) brightness(0.78) contrast(1.04)",
  },
  heroDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8, 10, 14, 0.18)",
  },
  heroOnImage: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  heroBack: {
    position: "absolute",
    left: spacing.sm,
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  joinCtaPressed: {
    opacity: 0.88,
  },
  joinBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  joinBadgeText: {
    ...typography.caption,
    color: colors.white,
    letterSpacing: 0.6,
    textTransform: "none",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },
  heroBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  heroTitle: {
    ...typography.heading1,
    fontSize: 28,
    lineHeight: 34,
  },
  heroMeta: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroStatement: {
    ...typography.body,
    color: colors.textSecondary,
  },
  highlights: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  highlightCol: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
  },
  highlightRule: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  highlightCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.xs,
  },
  highlightTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
  highlightDetail: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    fontWeight: "400",
    textAlign: "center",
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
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
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
