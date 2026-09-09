import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { comingSoonDetail, comingSoonLabDetails, findLab } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { IPHONE_15 } from "@/src/layout/WebPhonePreview";
import { labPhotos } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

const ink = "#C7C7CC";

export default function ComingSoonLabDetailScreen() {
  const insets = useSafeAreaInsets();
  const raw = useLocalSearchParams<{ labId: string | string[] }>();
  const labId = Array.isArray(raw.labId) ? raw.labId[0] : raw.labId;
  const offer = typeof labId === "string" ? findLab(labId) : undefined;
  const detail = labId ? comingSoonLabDetails[labId] : undefined;
  const topInset = Platform.OS === "web" ? IPHONE_15.status : insets.top;

  useEffect(() => {
    if (!labId) return;
    if (labId === "starter") {
      router.replace("/labs/starter");
      return;
    }
    if (!offer || !detail) {
      router.replace("/labs");
    }
  }, [labId, offer, detail]);

  if (!offer || !detail) return null;

  return (
    <ScrollableScreen padded={false} edges={[]} contentStyle={styles.heroScreen}>
      <View style={styles.fullHero}>
        <Image
          source={labPhotos[offer.photo]}
          style={[styles.heroPhoto, Platform.OS === "web" ? styles.heroPhotoBw : null]}
          contentFit="cover"
          contentPosition={offer.id === "transformation" ? { top: "40%", left: "58%" } : { top: "40%", left: "50%" }}
        />
        <View style={styles.heroDim} />
        <LinearGradient
          colors={["rgba(15,17,18,0.08)", "rgba(15,17,18,0.45)", colors.background]}
          locations={[0.45, 0.74, 1]}
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
          <Text style={styles.heroTitle} maxFontSizeMultiplier={1.3}>
            {offer.name}
          </Text>
          <Text style={styles.heroMeta} maxFontSizeMultiplier={1.3}>
            {offer.meta}
          </Text>
          <Text style={styles.heroStatement} maxFontSizeMultiplier={1.4}>
            {detail.statement}
          </Text>
        </View>
      </View>

      <View style={styles.heroBody}>
        <View style={styles.highlights}>
          {detail.highlights.map((item, index) => (
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

        <View style={styles.soonWrap} accessibilityRole="text">
          <Text style={styles.soon} maxFontSizeMultiplier={1.2}>
            {comingSoonDetail.body}
          </Text>
        </View>
      </View>
    </ScrollableScreen>
  );
}

function HighlightIcon({ name }: { name: "calendar-outline" | "target" | "trending-up-outline" }) {
  if (name === "target") return <TargetIcon />;
  return <Ionicons name={name} size={20} color={ink} />;
}

function TargetIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={ink} strokeWidth={1.7} />
      <Circle cx="12" cy="12" r="4.6" stroke={ink} strokeWidth={1.7} />
      <Circle cx="12" cy="12" r="1.5" fill={ink} />
    </Svg>
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
  heroPhotoBw: {
    filter: "grayscale(1) saturate(0) brightness(0.82) contrast(1.06)",
  },
  heroDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8, 10, 14, 0.22)",
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
  heroBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xl,
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
  soonWrap: {
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.38)",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  soon: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
  },
});
