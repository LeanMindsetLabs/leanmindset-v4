import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { type Href, router } from "expo-router";
import { ACTIVITY_LEVELS } from "@/src/content/onboarding";
import { useProfile } from "@/src/hooks/useProfile";
import { kgToLb, type ActivityLevel } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";

const READY = 0.72;
const FUEL = 0.78;
const TRAIN = 8.4 / 10;
const READY_N = 72;
const FUEL_N = 78;
const TRAIN_N = 8.4;

const ACTIVITY_RANK: Record<ActivityLevel, number> = {
  sedentary: 1,
  light: 2,
  moderate: 3,
  active: 4,
  athlete: 5,
};

type HomeHeroChartProps = {
  /** Lab scores after Day 1. Baseline uses onboarding weight, target, and activity. */
  mode?: "lab" | "baseline";
};

export default function HomeHeroChart({ mode = "lab" }: HomeHeroChartProps) {
  if (mode === "baseline") return <BaselineDials />;
  return <LabDials />;
}

function LabDials() {
  return (
    <View style={styles.dials}>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/profile/" as Href)}>
        <DualRing size={104} progress={READY} fillColor="#F5C400">
          <Text style={styles.num}>{READY_N}</Text>
          <Text style={styles.denom}>/100</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#F5C400" }]}>READY ›</Text>
        <Text style={styles.sub}>Body & Mind</Text>
      </Pressable>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/meals")}>
        <DualRing size={104} progress={FUEL} fillColor="#7EB6FF">
          <Text style={styles.num}>{FUEL_N}</Text>
          <Text style={styles.denom}>/100</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#7EB6FF" }]}>FUEL ›</Text>
        <Text style={styles.sub}>Nutrition</Text>
      </Pressable>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/train")}>
        <DualRing size={104} progress={TRAIN} fillColor="#3D7BFF">
          <Text style={styles.num}>{TRAIN_N}</Text>
          <Text style={styles.denom}>/10</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#3D7BFF" }]}>TRAIN ›</Text>
        <Text style={styles.sub}>Performance</Text>
      </Pressable>
    </View>
  );
}

function BaselineDials() {
  const { profile } = useProfile();
  const units = profile.preferences.units;
  const currentLb = profile.weightLb;
  const startLb = profile.weightHistory[0]?.lb ?? currentLb;
  const targetLb = profile.targetWeightKg > 0 ? kgToLb(profile.targetWeightKg) : currentLb;
  const toward = towardTarget(startLb, currentLb, targetLb);
  const rank = ACTIVITY_RANK[profile.activityLevel] ?? 3;
  const moveLabel = ACTIVITY_LEVELS.find((item) => item.id === profile.activityLevel)?.label ?? "Moderate";

  return (
    <View style={styles.dials}>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/profile/information" as Href)}>
        <DualRing size={104} progress={toward} fillColor="#F5C400">
          <Text style={styles.num}>{displayWeight(currentLb, units)}</Text>
          <Text style={styles.denom}>{units}</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#F5C400" }]}>BODY ›</Text>
        <Text style={styles.sub}>Current</Text>
      </Pressable>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/profile/" as Href)}>
        <DualRing size={104} progress={1} fillColor="#7EB6FF">
          <Text style={styles.num}>{displayWeight(targetLb, units)}</Text>
          <Text style={styles.denom}>{units}</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#7EB6FF" }]}>GOAL ›</Text>
        <Text style={styles.sub}>Target</Text>
      </Pressable>
      <Pressable style={styles.dial} onPress={() => router.push("/(tabs)/train")}>
        <DualRing size={104} progress={rank / 5} fillColor="#3D7BFF">
          <Text style={styles.num}>{rank}</Text>
          <Text style={styles.denom}>/5</Text>
        </DualRing>
        <Text style={[styles.label, { color: "#3D7BFF" }]}>MOVE ›</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {moveLabel}
        </Text>
      </Pressable>
    </View>
  );
}

/** 0 at the starting weigh-in, 1 when current matches target. */
function towardTarget(start: number, current: number, target: number) {
  const span = target - start;
  if (Math.abs(span) < 0.2) return 1;
  return Math.min(1, Math.max(0, (current - start) / span));
}

function displayWeight(lb: number, units: "lb" | "kg") {
  if (units === "kg") return String(Math.round(lb / 2.2046));
  return String(Math.round(lb));
}

function DualRing({
  size,
  progress,
  fillColor,
  children,
}: {
  size: number;
  progress: number;
  fillColor: string;
  children?: ReactNode;
}) {
  const outerStroke = 5.5;
  const innerStroke = 1.5;
  const gap = 3;
  const outerR = (size - outerStroke) / 2;
  const innerR = outerR - outerStroke / 2 - gap - innerStroke / 2;
  const circ = 2 * Math.PI * outerR;
  const clamped = Math.min(1, Math.max(0, progress));
  const cx = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cx} r={outerR} stroke={fillColor} strokeOpacity={0.18} strokeWidth={outerStroke} fill="none" />
        <Circle
          cx={cx}
          cy={cx}
          r={outerR}
          stroke={fillColor}
          strokeWidth={outerStroke}
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - clamped)}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
        <Circle cx={cx} cy={cx} r={innerR} stroke={fillColor} strokeWidth={innerStroke} fill="none" />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dials: { flexDirection: "row", gap: 8, marginBottom: 16 },
  dial: { flex: 1, alignItems: "center" },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  num: { color: colors.white, fontSize: 25, fontWeight: "700", letterSpacing: -0.4, lineHeight: 27 },
  denom: { color: colors.white, fontSize: 11, fontWeight: "400", lineHeight: 13, marginTop: 1, opacity: 0.92 },
  label: { marginTop: 10, fontSize: 14, fontWeight: "800", letterSpacing: 1.7 },
  sub: { marginTop: 2, fontSize: 13, fontWeight: "400", color: "#AEAEB2" },
});
