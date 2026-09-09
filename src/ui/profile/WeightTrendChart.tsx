import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from "react-native-svg";
import { formatWeightDelta, lbToKg, type WeightEntry } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";

const LINE = colors.profilePurple;
const GRID = "rgba(255,255,255,0.08)";
const AXIS = "#8E8E93";
const CARD = colors.profileCard;

type WeightTrendChartProps = {
  history: WeightEntry[];
  deltaLb: number;
  units: "lb" | "kg";
};

export default function WeightTrendChart({ history, deltaLb, units }: WeightTrendChartProps) {
  const [width, setWidth] = useState(0);
  const height = 164;
  const padL = 28;
  const padR = 6;
  const padT = 8;
  const padB = 8;
  const gained = deltaLb > 0;

  if (!history.length) {
    return (
      <View style={styles.card}>
        <View style={styles.head}>
          <View style={styles.col}>
            <Text style={styles.title}>YOUR JOURNEY</Text>
            <Text style={styles.sub}>Weight Trend</Text>
          </View>
        </View>
        <Text style={styles.sub}>No weigh-ins yet</Text>
      </View>
    );
  }

  const values = history.map((entry) => (units === "kg" ? lbToKg(entry.lb) : entry.lb));
  const rawMin = values.length ? Math.min(...values) : 0;
  const rawMax = values.length ? Math.max(...values) : 1;
  const pad = Math.max((rawMax - rawMin) * 0.08, units === "kg" ? 0.5 : 1);
  const min = rawMin - pad;
  const max = rawMax + pad;
  const span = Math.max(max - min, 1);
  const ticks = [max, min + span / 2, min];
  const innerW = Math.max(width - padL - padR, 1);
  const innerH = height - padT - padB;
  const plotted = values.map((value, index) => ({
    x: padL + (index / Math.max(values.length - 1, 1)) * innerW,
    y: padT + (1 - (Math.min(max, Math.max(min, value)) - min) / span) * innerH,
  }));
  const line = plotted.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const last = plotted[plotted.length - 1];
  const first = plotted[0];
  const area =
    last && first ? `${line} L ${last.x.toFixed(1)} ${padT + innerH} L ${first.x.toFixed(1)} ${padT + innerH} Z` : "";
  const xLabels = [history[0], history[Math.floor((history.length - 1) / 2)], history[history.length - 1]];

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.col}>
          <Text style={styles.title}>YOUR JOURNEY</Text>
          <Text style={styles.sub}>Weight Trend</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.delta, gained ? styles.up : styles.down]}>{formatWeightDelta(deltaLb, units)}</Text>
          <Text style={styles.sub}>vs last 30 days</Text>
        </View>
      </View>
      <View style={styles.chart} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="journeyFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={LINE} stopOpacity="0.28" />
                <Stop offset="100%" stopColor={LINE} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            {ticks.map((_, index) => {
              const y = padT + (index / (ticks.length - 1)) * innerH;
              return (
                <Line key={`grid-${index}`} x1={padL} y1={y} x2={width - padR} y2={y} stroke={GRID} strokeWidth={1} />
              );
            })}
            {area ? <Path d={area} fill="url(#journeyFill)" /> : null}
            {line ? (
              <Path d={line} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ) : null}
            {ticks.map((tick, index) => {
              const y = padT + (index / (ticks.length - 1)) * innerH + 4;
              return (
                <SvgText key={`tick-${tick}`} x={0} y={y} fill={AXIS} fontSize="11" fontWeight="500">
                  {Math.round(tick)}
                </SvgText>
              );
            })}
          </Svg>
        ) : null}
      </View>
      <View style={styles.axis}>
        {xLabels.map((entry, index) => (
          <Text key={`x-${index}-${entry?.date ?? "empty"}`} style={styles.xLabel}>
            {entry?.label.toUpperCase() ?? ""}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  head: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  col: {
    gap: 4,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  title: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  sub: {
    color: AXIS,
    fontSize: 13,
  },
  delta: {
    fontSize: 16,
    fontWeight: "700",
  },
  down: {
    color: colors.profileTeal,
  },
  up: {
    color: colors.danger,
  },
  chart: {
    height: 164,
  },
  axis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 28,
  },
  xLabel: {
    color: AXIS,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
