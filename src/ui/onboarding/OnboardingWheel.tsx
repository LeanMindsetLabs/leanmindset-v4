import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";

const ROW = 36;

type OnboardingWheelProps = {
  values: string[];
  value: string;
  onChange: (next: string) => void;
};

export default function OnboardingWheel({ values, value, onChange }: OnboardingWheelProps) {
  const ref = useRef<ScrollView>(null);
  const dragging = useRef(false);
  const pad = ROW * 2;
  const marks = useMemo(() => values, [values]);

  useEffect(() => {
    if (dragging.current) return;
    const start = Math.max(0, marks.indexOf(value));
    const id = requestAnimationFrame(() => {
      ref.current?.scrollTo({ y: start * ROW, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [marks, value]);

  function commit(offsetY: number) {
    const next = Math.round(offsetY / ROW);
    const clamped = Math.min(marks.length - 1, Math.max(0, next));
    const picked = marks[clamped];
    if (picked && picked !== value) onChange(picked);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.band} pointerEvents="none" />
      <ScrollView
        ref={ref}
        style={styles.scroll}
        nestedScrollEnabled
        directionalLockEnabled
        bounces
        alwaysBounceVertical
        showsVerticalScrollIndicator={false}
        snapToInterval={ROW}
        snapToAlignment="start"
        disableIntervalMomentum
        decelerationRate="fast"
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => {
          dragging.current = true;
        }}
        onMomentumScrollEnd={(event) => {
          dragging.current = false;
          commit(event.nativeEvent.contentOffset.y);
        }}
        onScrollEndDrag={(event) => {
          const vy = event.nativeEvent.velocity?.y ?? 0;
          if (Math.abs(vy) > 0.15 && Platform.OS !== "web") return;
          dragging.current = false;
          commit(event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={{ height: pad }} />
        {marks.map((item) => (
          <View key={item} style={styles.row}>
            <Text style={[styles.label, item === value && styles.active]} numberOfLines={1}>
              {item}
            </Text>
          </View>
        ))}
        <View style={{ height: pad }} />
      </ScrollView>
      <LinearGradient colors={["rgba(18,20,23,0.96)", "rgba(18,20,23,0)"]} style={styles.fadeTop} pointerEvents="none" />
      <LinearGradient colors={["rgba(18,20,23,0)", "rgba(18,20,23,0.96)"]} style={styles.fadeBottom} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: ROW * 5,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
    ...(Platform.OS === "web" ? { overflowY: "scroll" as const, touchAction: "pan-y" as const } : null),
  },
  band: {
    position: "absolute",
    left: 6,
    right: 6,
    top: ROW * 2,
    height: ROW,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.16)",
    zIndex: 1,
  },
  row: {
    height: ROW,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    color: "rgba(255,255,255,0.28)",
    letterSpacing: -0.2,
  },
  active: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  fadeTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: ROW * 1.6,
    zIndex: 2,
  },
  fadeBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: ROW * 1.6,
    zIndex: 2,
  },
});
