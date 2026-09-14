import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppTextInput from "@/src/ui/AppTextInput";
import { useUiVariant } from "@/src/context/UiVariantContext";
import AppScreen from "@/src/layout/AppScreen";
import { useKeyboardHeight } from "@/src/hooks/useKeyboardHeight";
import { isoDate } from "@/src/lib/cohortStart";
import { formatCheckInMessage } from "@/src/services/coachService";
import { completeDailyTask } from "@/src/services/labMembershipService";
import { getProfile } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
const MOODS = ["Rough", "Normal", "Good", "Great"] as const;
const MOOD_META: Record<(typeof MOODS)[number], { emoji: string; hint: string }> = {
  Rough: { emoji: "😣", hint: "Tough day" },
  Normal: { emoji: "😐", hint: "Steady" },
  Good: { emoji: "🙂", hint: "Solid" },
  Great: { emoji: "😄", hint: "On fire" },
};
const WATER = ["1", "1.5", "2", "2.5", "3", "3.5", "4"];
const EXERCISE_MIN = ["0", "15", "30", "45", "60", "90"];
const BM = ["0", "1", "2", "3", "4"];
const QUESTION_COUNT = 6;

type Step = 0 | 1 | 2 | 3 | 4 | 5 | "review";
type Mood = (typeof MOODS)[number];

export default function DailyCheckIn() {
  const { setPendingCoachMessage, checkInPicker } = useUiVariant();
  const list = checkInPicker === "1";
  const cards = checkInPicker === "2";
  const keyboardHeight = useKeyboardHeight();
  const profile = getProfile();
  const program = profile.program;
  const lastWeight = lastLoggedWeight(profile);
  const lastWeightLb = lastWeight.lb;
  const lastWeightIsPriorDay = lastWeight.fromPriorDay;
  const startWeightLb = profile.weightHistory[0]?.lb ?? profile.weightLb;
  const [step, setStep] = useState<Step>(0);
  const [weightText, setWeightText] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [waterL, setWaterL] = useState("");
  const [exerciseMin, setExerciseMin] = useState("");
  const [bm, setBm] = useState("");
  const [notes, setNotes] = useState("");

  const weight = useMemo(() => {
    const n = Number.parseFloat(weightText);
    return Number.isFinite(n) ? n : null;
  }, [weightText]);
  const lostToday = weight == null ? null : +(lastWeightLb - weight).toFixed(1);
  const lostTotal = weight == null ? null : +(startWeightLb - weight).toFixed(1);

  const summary = useMemo(() => {
    if (weight == null || !mood || !waterL || !exerciseMin || !bm) return "";
    return formatCheckInMessage({
      day: program.day,
      lostToday: lostToday ?? 0,
      lostTotal: lostTotal ?? 0,
      weightLb: weight,
      mood,
      waterL,
      exerciseMin,
      bm,
      notes,
    });
  }, [bm, exerciseMin, lostToday, lostTotal, mood, notes, program.day, waterL, weight]);

  function next() {
    setStep((current) => (current === 5 ? "review" : typeof current === "number" ? ((current + 1) as Step) : current));
  }

  function back() {
    setStep((current) => {
      if (current === "review") return 5;
      if (current === 0) return 0;
      return (current - 1) as Step;
    });
  }

  function pickAndNext<T extends string>(setter: (value: T) => void, value: T) {
    setter(value);
    setTimeout(next, 80);
  }

  function nudgeWeight(delta: number) {
    const base = weight ?? lastWeightLb;
    setWeightText((base + delta).toFixed(1));
  }

  function sendCheckIn() {
    if (!summary) return;
    completeDailyTask("checkin");
    setPendingCoachMessage(summary);
    router.push("/(tabs)/coach");
  }

  function closeCheckIn() {
    router.push("/(tabs)/coach");
  }

  const questionIndex = step === "review" ? QUESTION_COUNT : step + 1;

  return (
    <AppScreen edges={["top"]}>
      <View style={[styles.page, { paddingBottom: keyboardHeight }]}>
        <View style={styles.head}>
          <View style={styles.headRow}>
            <Text style={styles.kicker}>Daily check-in</Text>
            <Pressable onPress={closeCheckIn} hitSlop={12} accessibilityLabel="Close check-in">
              <Ionicons name="close" size={22} color="#8E8E93" />
            </Pressable>
          </View>
          <Text style={styles.title}>{step === "review" ? "Ready to send" : questionTitle(step)}</Text>
          {step !== "review" ? (
            <Text style={styles.progressLabel}>
              {questionIndex} of {QUESTION_COUNT}
            </Text>
          ) : (
            <Text style={styles.progressLabel}>
              Day {program.day} · {program.name}
            </Text>
          )}
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${(questionIndex / QUESTION_COUNT) * 100}%` }]} />
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 ? (
            list ? (
              <View style={styles.block}>
                <Text style={styles.hint}>{sameWeightHint(lastWeightLb, lastWeightIsPriorDay)}</Text>
                <View style={styles.weightBox}>
                  <AppTextInput
                    value={weightText}
                    onChangeText={setWeightText}
                    keyboardType="decimal-pad"
                    placeholder={lastWeightLb.toFixed(1)}
                    placeholderTextColor="#6E7D92"
                    style={styles.weightInput}
                    accessibilityLabel="Today's weight in pounds"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      if (weight != null) next();
                    }}
                  />
                  <Text style={styles.lb}>lb</Text>
                </View>
              </View>
            ) : (
              <WeightStepper
                compact={checkInPicker === "3"}
                value={weightText}
                lastWeightLb={lastWeightLb}
                lastWeightIsPriorDay={lastWeightIsPriorDay}
                onChangeText={setWeightText}
                onNudge={nudgeWeight}
                onReuseLast={() => setWeightText(lastWeightLb.toFixed(1))}
                onSubmit={() => {
                  if (weight != null) next();
                }}
              />
            )
          ) : null}

          {step === 1 ? (
            list ? (
              <ChoiceGrid
                options={MOODS.map((m) => ({ value: m, label: m }))}
                value={mood}
                onPick={(v) => pickAndNext(setMood, v as Mood)}
              />
            ) : cards ? (
              <MoodCards value={mood} onPick={(v) => pickAndNext(setMood, v)} />
            ) : (
              <SlimMood value={mood} onPick={(v) => pickAndNext(setMood, v)} />
            )
          ) : null}

          {step === 2 ? (
            list ? (
              <ChoiceGrid
                options={WATER.map((v) => ({ value: v, label: `${v} L` }))}
                value={waterL}
                onPick={(v) => pickAndNext(setWaterL, v)}
              />
            ) : cards ? (
              <ChipRow
                options={WATER.map((v) => ({ value: v, label: `${v}L`, icon: "💧" }))}
                value={waterL}
                onPick={(v) => pickAndNext(setWaterL, v)}
              />
            ) : (
              <SlimPills
                options={WATER.map((v) => ({ value: v, label: `${v} L` }))}
                value={waterL}
                onPick={(v) => pickAndNext(setWaterL, v)}
              />
            )
          ) : null}

          {step === 3 ? (
            list ? (
              <ChoiceGrid
                options={EXERCISE_MIN.map((v) => ({ value: v, label: v === "0" ? "None" : `${v} min` }))}
                value={exerciseMin}
                onPick={(v) => pickAndNext(setExerciseMin, v)}
              />
            ) : cards ? (
              <ChipRow
                options={EXERCISE_MIN.map((v) => ({
                  value: v,
                  label: v === "0" ? "Rest" : `${v}m`,
                  icon: v === "0" ? "🛋️" : "🏃",
                }))}
                value={exerciseMin}
                onPick={(v) => pickAndNext(setExerciseMin, v)}
              />
            ) : (
              <SlimPills
                options={EXERCISE_MIN.map((v) => ({ value: v, label: v === "0" ? "Rest" : `${v} min` }))}
                value={exerciseMin}
                onPick={(v) => pickAndNext(setExerciseMin, v)}
              />
            )
          ) : null}

          {step === 4 ? (
            list ? (
              <ChoiceGrid
                options={BM.map((v) => ({ value: v, label: v === "1" ? "1 time" : `${v} times` }))}
                value={bm}
                onPick={(v) => pickAndNext(setBm, v)}
              />
            ) : cards ? (
              <CircleRow options={BM} value={bm} onPick={(v) => pickAndNext(setBm, v)} />
            ) : (
              <SlimPills
                options={BM.map((v) => ({ value: v, label: v }))}
                value={bm}
                onPick={(v) => pickAndNext(setBm, v)}
              />
            )
          ) : null}

          {step === 5 ? (
            <AppTextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Anything your coach should know? (optional)"
              placeholderTextColor="#6E7D92"
              style={styles.notes}
              multiline
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={next}
            />
          ) : null}

          {step === "review" && weight != null && mood && waterL && exerciseMin && bm ? (
            <ReviewSnapshot
              day={program.day}
              labName={program.name}
              weight={weight}
              startWeightLb={startWeightLb}
              lastWeightLb={lastWeightLb}
              lastWeightIsPriorDay={lastWeightIsPriorDay}
              lostToday={lostToday ?? 0}
              lostTotal={lostTotal ?? 0}
              mood={mood}
              waterL={waterL}
              exerciseMin={exerciseMin}
              bm={bm}
              notes={notes}
            />
          ) : null}
        </ScrollView>

        <View style={[styles.footer, keyboardHeight > 0 && styles.footerKeyboard]}>
          {step !== 0 ? (
            <Pressable style={styles.ghost} onPress={back}>
              <Text style={styles.ghostText}>Back</Text>
            </Pressable>
          ) : (
            <View style={styles.ghostSpacer} />
          )}
          {step === "review" ? (
            <Pressable style={styles.primary} onPress={sendCheckIn}>
              <Text style={styles.primaryText}>Send check-in</Text>
            </Pressable>
          ) : step === 0 ? (
            <Pressable style={[styles.primary, weight == null && styles.primaryOff]} disabled={weight == null} onPress={() => { Keyboard.dismiss(); next(); }}>
              <Text style={styles.primaryText}>Continue</Text>
            </Pressable>
          ) : step === 5 ? (
            <Pressable style={styles.primary} onPress={next}>
              <Text style={styles.primaryText}>{notes.trim() ? "Continue" : "Skip"}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.primary, !canContinue(step, { mood, waterL, exerciseMin, bm }) && styles.primaryOff]}
              disabled={!canContinue(step, { mood, waterL, exerciseMin, bm })}
              onPress={next}
            >
              <Text style={styles.primaryText}>Continue</Text>
            </Pressable>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

function questionTitle(step: Step) {
  if (step === 0) return "What's your weight today?";
  if (step === 1) return "How's your mood?";
  if (step === 2) return "How much water today?";
  if (step === 3) return "How much did you exercise?";
  if (step === 4) return "Bowel movements today?";
  if (step === 5) return "Any notes for Coach?";
  return "Review";
}

function canContinue(
  step: Step,
  values: { mood: string; waterL: string; exerciseMin: string; bm: string },
) {
  if (step === 1) return Boolean(values.mood);
  if (step === 2) return Boolean(values.waterL);
  if (step === 3) return Boolean(values.exerciseMin);
  if (step === 4) return Boolean(values.bm);
  return true;
}

function trimNum(n: number) {
  return Number.parseFloat(n.toFixed(1)).toString();
}

function deltaCopy(lost: number) {
  if (lost === 0) return "No change";
  if (lost > 0) return `↓ ${trimNum(lost)} lb`;
  return `↑ ${trimNum(Math.abs(lost))} lb`;
}

function lastLoggedWeight(profile: { weightLb: number; weightHistory: { date: string; lb: number }[] }) {
  const today = isoDate();
  const prior = [...profile.weightHistory].reverse().find((entry) => entry.date !== today && entry.lb > 0);
  if (prior) return { lb: prior.lb, fromPriorDay: true };
  return { lb: profile.weightLb, fromPriorDay: false };
}

function sameWeightHint(lb: number, fromPriorDay: boolean) {
  return fromPriorDay
    ? `Same as yesterday · ${lb.toFixed(1)} lb`
    : `Same as your starting weight · ${lb.toFixed(1)} lb`;
}

function WeightStepper({
  compact,
  value,
  lastWeightLb,
  lastWeightIsPriorDay,
  onChangeText,
  onNudge,
  onReuseLast,
  onSubmit,
}: {
  compact?: boolean;
  value: string;
  lastWeightLb: number;
  lastWeightIsPriorDay: boolean;
  onChangeText: (next: string) => void;
  onNudge: (delta: number) => void;
  onReuseLast: () => void;
  onSubmit?: () => void;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.stepperRow}>
        <Pressable style={[styles.stepperBtn, compact && styles.stepperBtnSlim]} onPress={() => onNudge(-0.1)}>
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <View style={[styles.stepperValue, compact && styles.stepperValueSlim]}>
          <AppTextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType="decimal-pad"
            placeholder={lastWeightLb.toFixed(1)}
            placeholderTextColor="#6E7D92"
            style={[styles.stepperInput, compact && styles.stepperInputSlim]}
            accessibilityLabel="Today's weight in pounds"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          <Text style={styles.lb}>lb</Text>
        </View>
        <Pressable style={[styles.stepperBtn, compact && styles.stepperBtnSlim]} onPress={() => onNudge(0.1)}>
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
      <Pressable onPress={onReuseLast}>
        <Text style={styles.sameBtnText}>{sameWeightHint(lastWeightLb, lastWeightIsPriorDay)}</Text>
      </Pressable>
    </View>
  );
}

function MoodCards({ value, onPick }: { value: string; onPick: (value: Mood) => void }) {
  return (
    <View style={styles.moodGrid}>
      {MOODS.map((m) => {
        const on = value === m;
        return (
          <Pressable key={m} style={[styles.moodCard, on && styles.choiceOn]} onPress={() => onPick(m)}>
            <Text style={styles.moodEmoji}>{MOOD_META[m].emoji}</Text>
            <Text style={[styles.choiceText, on && styles.choiceTextOn]}>{m}</Text>
            <Text style={styles.moodHint}>{MOOD_META[m].hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ChipRow({
  options,
  value,
  onPick,
}: {
  options: { value: string; label: string; icon: string }[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable key={opt.value} style={[styles.chip, on && styles.choiceOn]} onPress={() => onPick(opt.value)}>
            <Text style={styles.chipIcon}>{opt.icon}</Text>
            <Text style={[styles.chipText, on && styles.choiceTextOn]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CircleRow({
  options,
  value,
  onPick,
}: {
  options: string[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <View style={styles.circleRow}>
      {options.map((opt) => {
        const on = opt === value;
        return (
          <Pressable key={opt} style={[styles.circle, on && styles.circleOn]} onPress={() => onPick(opt)}>
            <Text style={[styles.circleText, on && styles.choiceTextOn]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ChoiceGrid({
  options,
  value,
  onPick,
}: {
  options: { value: string; label: string }[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <View style={styles.choices}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable key={opt.value} style={[styles.choice, on && styles.choiceOn]} onPress={() => onPick(opt.value)}>
            <Text style={[styles.choiceText, on && styles.choiceTextOn]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SlimMood({ value, onPick }: { value: string; onPick: (value: Mood) => void }) {
  return (
    <View style={styles.slimMoodRow}>
      {MOODS.map((m) => {
        const on = value === m;
        return (
          <Pressable key={m} style={[styles.slimMood, on && styles.slimOn]} onPress={() => onPick(m)}>
            <Text style={styles.slimEmoji}>{MOOD_META[m].emoji}</Text>
            <Text style={[styles.slimMoodLabel, on && styles.choiceTextOn]}>{m}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SlimPills({
  options,
  value,
  onPick,
}: {
  options: { value: string; label: string }[];
  value: string;
  onPick: (value: string) => void;
}) {
  return (
    <View style={styles.slimWrap}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable key={opt.value} style={[styles.slimPill, on && styles.slimOn]} onPress={() => onPick(opt.value)}>
            <Text style={[styles.slimPillText, on && styles.choiceTextOn]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ReviewSnapshot({
  day,
  labName,
  weight,
  startWeightLb,
  lastWeightLb,
  lastWeightIsPriorDay,
  lostToday,
  lostTotal,
  mood,
  waterL,
  exerciseMin,
  bm,
  notes,
}: {
  day: number;
  labName: string;
  weight: number;
  startWeightLb: number;
  lastWeightLb: number;
  lastWeightIsPriorDay: boolean;
  lostToday: number;
  lostTotal: number;
  mood: Mood;
  waterL: string;
  exerciseMin: string;
  bm: string;
  notes: string;
}) {
  return (
    <View style={styles.review}>
      <Text style={styles.reviewDay}>
        {day}_{labName}
      </Text>
      <View style={styles.reviewBlock}>
        <ReviewRow label="Start" value={`${trimNum(startWeightLb)} lb`} />
        <ReviewRow label={lastWeightIsPriorDay ? "Yesterday" : "Starting"} value={`${trimNum(lastWeightLb)} lb`} />
        <ReviewRow label="Today" value={`${trimNum(weight)} lb`} accent />
        <ReviewRow label="Vs yesterday" value={deltaCopy(lostToday)} tone={lostToday >= 0 ? "down" : "up"} />
        <ReviewRow label="Vs start" value={deltaCopy(lostTotal)} tone={lostTotal >= 0 ? "down" : "up"} last />
      </View>
      <View style={styles.reviewBlock}>
        <ReviewRow label="Mood" value={`${MOOD_META[mood].emoji}  ${mood}`} />
        <ReviewRow label="Water" value={`${waterL}L`} />
        <ReviewRow label="Exercise" value={exerciseMin === "0" ? "Rest" : `${exerciseMin} min`} />
        <ReviewRow label="BM" value={`${bm}×`} last />
      </View>
      {notes.trim() ? <Text style={styles.reviewNotes}>{notes.trim()}</Text> : null}
    </View>
  );
}

function ReviewRow({
  label,
  value,
  accent,
  tone,
  last,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "down" | "up";
  last?: boolean;
}) {
  const color = tone === "down" ? "#35D07F" : tone === "up" ? "#F5A623" : accent ? colors.metricBlueSoft : colors.white;
  return (
    <View style={[styles.reviewRow, !last && styles.reviewRowLine]}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={[styles.reviewValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  flex: { flex: 1 },
  head: { paddingTop: 2, paddingBottom: 8, gap: 6 },
  headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kicker: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", color: "#8EA0B8" },
  title: { fontSize: 24, fontWeight: "800", letterSpacing: -0.4, color: colors.white, lineHeight: 30 },
  progressLabel: { fontSize: 12, fontWeight: "600", color: "#8EA0B8" },
  track: { height: 4, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 4 },
  trackFill: { height: "100%", backgroundColor: colors.accentBlue, borderRadius: 99 },
  body: { paddingTop: 14, paddingBottom: 8, gap: 12, flexGrow: 1 },
  block: { gap: 10 },
  hint: { fontSize: 13, fontWeight: "600", color: "#8EA0B8" },
  weightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(126,182,255,0.28)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 64,
  },
  weightInput: { flex: 1, fontSize: 28, fontWeight: "800", color: colors.white },
  lb: { fontSize: 16, fontWeight: "700", color: "#8EA0B8" },
  stepperRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepperBtn: {
    width: 52,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(126,182,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnSlim: { width: 44, height: 48, borderRadius: 12 },
  stepperBtnText: { color: colors.metricBlueSoft, fontSize: 28, fontWeight: "700", marginTop: -2 },
  stepperValue: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: "rgba(126,182,255,0.4)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
  stepperValueSlim: { height: 48, borderRadius: 12 },
  stepperInput: { flex: 1, fontSize: 28, fontWeight: "800", color: colors.white, textAlign: "center" },
  stepperInputSlim: { fontSize: 22 },
  sameBtnText: { color: colors.metricBlueSoft, fontSize: 13, fontWeight: "700" },
  notes: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(126,182,255,0.28)",
    backgroundColor: colors.surface,
    color: colors.white,
    padding: 14,
    fontSize: 16,
    fontWeight: "600",
    textAlignVertical: "top",
  },
  choices: { gap: 10 },
  choice: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  choiceOn: {
    borderColor: "rgba(126,182,255,0.55)",
    backgroundColor: "rgba(47,111,237,0.2)",
  },
  choiceText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  choiceTextOn: { color: "#B8D4FF" },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  moodCard: {
    width: "47%",
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: colors.surface,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  moodEmoji: { fontSize: 28 },
  moodHint: { fontSize: 11, fontWeight: "600", color: "#8EA0B8" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minWidth: "30%",
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: colors.surface,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },
  chipIcon: { fontSize: 18 },
  chipText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  circleRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  circle: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 64,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  circleOn: {
    borderColor: "rgba(126,182,255,0.55)",
    backgroundColor: "rgba(47,111,237,0.22)",
  },
  circleText: { color: colors.white, fontSize: 20, fontWeight: "800" },
  slimMoodRow: { flexDirection: "row", gap: 8 },
  slimMood: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  slimEmoji: { fontSize: 20 },
  slimMoodLabel: { fontSize: 11, fontWeight: "700", color: colors.white },
  slimWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slimPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "transparent",
  },
  slimOn: {
    borderColor: "rgba(126,182,255,0.55)",
    backgroundColor: "rgba(47,111,237,0.16)",
  },
  slimPillText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  review: { gap: 14 },
  reviewDay: { fontSize: 13, fontWeight: "700", color: "#8EA0B8" },
  reviewBlock: { gap: 0 },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingVertical: 8 },
  reviewRowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  reviewLabel: { fontSize: 13, fontWeight: "600", color: "#8EA0B8" },
  reviewValue: { fontSize: 15, fontWeight: "700" },
  reviewNotes: { fontSize: 14, fontWeight: "500", color: "#C5D0E0", lineHeight: 20, fontStyle: "italic" },
  footer: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 8,
    paddingBottom: layout.tabBarContentInset,
  },
  footerKeyboard: {
    paddingBottom: 8,
  },
  ghost: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(126,182,255,0.28)",
    justifyContent: "center",
  },
  ghostSpacer: { width: 0 },
  ghostText: { color: colors.metricBlueSoft, fontSize: 14, fontWeight: "800" },
  primary: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
  },
  primaryOff: { opacity: 0.4 },
  primaryText: { color: colors.white, fontSize: 15, fontWeight: "800" },
});
