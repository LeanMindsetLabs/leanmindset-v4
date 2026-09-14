import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";
import { homeLabStatus } from "@/src/content/labs";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

const CONFETTI = [
  { left: "8%", top: "14%", rotate: "-18deg", color: "#F5C400", w: 8, h: 14 },
  { left: "18%", top: "8%", rotate: "22deg", color: "#C77DFF", w: 7, h: 12 },
  { left: "28%", top: "18%", rotate: "8deg", color: "#3D7BFF", w: 6, h: 11 },
  { left: "72%", top: "10%", rotate: "-28deg", color: "#19E68C", w: 8, h: 13 },
  { left: "82%", top: "16%", rotate: "16deg", color: "#FF9A3A", w: 7, h: 12 },
  { left: "90%", top: "28%", rotate: "-12deg", color: "#7EB6FF", w: 6, h: 10 },
  { left: "6%", top: "42%", rotate: "30deg", color: "#FF5E72", w: 7, h: 11 },
  { left: "88%", top: "48%", rotate: "-8deg", color: "#F5C400", w: 8, h: 12 },
  { left: "14%", top: "62%", rotate: "-24deg", color: "#C77DFF", w: 6, h: 10 },
  { left: "78%", top: "64%", rotate: "18deg", color: "#19E68C", w: 7, h: 12 },
  { left: "48%", top: "6%", rotate: "4deg", color: "#FF9A3A", w: 6, h: 9 },
  { left: "58%", top: "12%", rotate: "-32deg", color: "#3D7BFF", w: 5, h: 11 },
] as const;

export default function CompletedHero({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={homeLabStatus.completed.cta}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <LinearGradient
        colors={["#2A1F12", "#1A1528", "#121314"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      {CONFETTI.map((piece, index) => (
        <View
          key={index}
          pointerEvents="none"
          style={[
            styles.confetti,
            {
              left: piece.left,
              top: piece.top,
              width: piece.w,
              height: piece.h,
              backgroundColor: piece.color,
              transform: [{ rotate: piece.rotate }],
            },
          ]}
        />
      ))}
      <View style={styles.row}>
        <TrophyMark />
        <View style={styles.copy}>
          <Text style={styles.kicker} maxFontSizeMultiplier={1.2}>
            {homeLabStatus.completed.heroKicker}
          </Text>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {homeLabStatus.completed.heroTitle}
          </Text>
          <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
            {homeLabStatus.completed.heroMeta}
          </Text>
          <View style={styles.mood}>
            <Ionicons name="sparkles" size={16} color="#F5C400" />
            <Ionicons name="balloon" size={16} color="#C77DFF" />
            <Ionicons name="happy" size={16} color="#19E68C" />
            <Ionicons name="ribbon" size={16} color="#7EB6FF" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function TrophyMark() {
  return (
    <View style={styles.trophyWrap}>
      <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <Ellipse cx="36" cy="64" rx="16" ry="4" fill="#F5C400" opacity={0.28} />
        <Path d="M24 58h24v4c0 2.2-10.8 4-12 4s-12-1.8-12-4v-4Z" fill="#E8B000" />
        <Path d="M32 48h8v10h-8V48Z" fill="#F5C400" />
        <Path
          d="M18 14h36v16c0 12-8 22-18 22S18 42 18 30V14Z"
          fill="#F5C400"
        />
        <Path d="M22 18h28v10c0 9-6.2 16.5-14 16.5S22 37 22 28V18Z" fill="#FFE27A" opacity={0.55} />
        <Path d="M18 16H8c0 10 6 16 14 17V22h-4V16Z" fill="#F5C400" />
        <Path d="M54 16h10c0 10-6 16-14 17V22h4V16Z" fill="#F5C400" />
        <Path d="M32 8h8l2 6H30l2-6Z" fill="#FFE27A" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    aspectRatio: 1.85,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.92,
  },
  confetti: {
    position: "absolute",
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  trophyWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  kicker: {
    ...typography.caption,
    color: "#F5C400",
  },
  title: {
    ...typography.heading2,
    color: colors.white,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  mood: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
});
