import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { homeLabStatus } from "@/src/content/labs";
import { formatCohortCountdown } from "@/src/lib/cohortStart";
import { labPhotos } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

type PrepHeroProps = {
  variant?: "pending" | "preparing";
  done?: number;
  total?: number;
  startIso?: string | null;
  ready?: boolean;
  onPress: () => void;
};

export default function PrepHero({
  variant = "preparing",
  done = 0,
  total = 7,
  startIso = null,
  ready = false,
  onPress,
}: PrepHeroProps) {
  const pending = variant === "pending";
  const [countdown, setCountdown] = useState(() => formatCohortCountdown(startIso));
  const progress = pending ? 0 : total > 0 ? done / total : 0;

  useEffect(() => {
    if (pending) return undefined;
    function tick() {
      setCountdown(formatCohortCountdown(startIso));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [startIso, pending]);

  const kicker = pending
    ? homeLabStatus.pending.heroKicker
    : ready
      ? "You’re ready"
      : homeLabStatus.approved.heroKicker;
  const title = pending ? homeLabStatus.pending.heroTitle : homeLabStatus.approved.heroTitle;
  const meta = pending ? homeLabStatus.pending.heroMeta : countdown;
  const a11y = pending ? homeLabStatus.pending.heroCta : homeLabStatus.approved.heroCta;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <Image
        source={labPhotos.starter}
        style={styles.photo}
        contentFit="cover"
        contentPosition={{ top: "38%", left: "28%" }}
      />
      <LinearGradient
        colors={["rgba(15,17,18,0.15)", "rgba(15,17,18,0.55)", "rgba(15,17,18,0.92)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.row}>
        <PrepRing progress={progress} done={done} total={total} pending={pending} />
        <View style={styles.copy}>
          <Text style={styles.kicker} maxFontSizeMultiplier={1.2}>
            {kicker}
          </Text>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            {title}
          </Text>
          <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
            {meta}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function PrepRing({
  progress,
  done,
  total,
  pending,
}: {
  progress: number;
  done: number;
  total: number;
  pending: boolean;
}) {
  const size = 88;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={r} stroke={colors.accentBlue} strokeOpacity={0.22} strokeWidth={stroke} fill="none" />
        {pending ? null : (
          <Circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={colors.accentBlue}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={circ * (1 - clamped)}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cx})`}
          />
        )}
      </Svg>
      <View style={styles.ringCenter} pointerEvents="none">
        {pending ? (
          <Ionicons name="time-outline" size={28} color={colors.white} />
        ) : (
          <>
            <Text style={styles.ringNum}>{done}</Text>
            <Text style={styles.ringDenom}>{`/${total}`}</Text>
          </>
        )}
      </View>
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
  },
  pressed: {
    opacity: 0.92,
  },
  photo: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  kicker: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  title: {
    ...typography.heading2,
    color: colors.white,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  ringCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  ringNum: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
  },
  ringDenom: {
    color: colors.white,
    fontSize: 11,
    opacity: 0.85,
  },
});
