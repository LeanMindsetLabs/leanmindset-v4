import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  ACTIVITY_LEVELS,
  EXPERIENCE,
  GOALS,
  HEALTH_CONDITIONS,
  ONBOARDING_STEPS,
} from "@/src/content/onboarding";
import {
  dailyTargets,
  defaultTargetKg,
  goalLabel,
} from "@/src/lib/onboardingMath";
import { useProfile } from "@/src/hooks/useProfile";
import AppScreen from "@/src/layout/AppScreen";
import {
  completeOnboarding,
  kgToLb,
  lbToKg,
  type ActivityLevel,
  type GoalType,
  type WorkoutExperience,
} from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import AppTextInput from "@/src/ui/AppTextInput";
import OnboardingBasicsModal, { type BasicsModal } from "@/src/ui/onboarding/OnboardingBasicsModal";
import {
  BasicsRow,
  CompleteBadge,
  GoalTile,
  HealthChip,
  NextBar,
  OnboardingHeader,
  OptionRow,
  PlanPreviewCard,
  UnitToggle,
} from "@/src/ui/onboarding/OnboardingChrome";
import WeightScale from "@/src/ui/onboarding/WeightScale";

const STEPS = ["name", "goal", "target", "activity", "experience", "health", "basics", "complete"] as const;
type StepId = (typeof STEPS)[number];

const COPY: Record<StepId, { title: string; subtitle: string }> = {
  name: { title: "What should we call you?", subtitle: "This is how LeanMindset will greet you." },
  goal: { title: "What's your primary goal?", subtitle: "This helps us personalize your plan." },
  target: { title: "What's your target weight?", subtitle: "A number you can live with — not a crash." },
  activity: { title: "How active are you?", subtitle: "This sets your daily energy budget." },
  experience: { title: "What's your training background?", subtitle: "We'll match volume to where you are." },
  health: { title: "Any conditions we should know?", subtitle: "This keeps recommendations safer. Select all that apply." },
  basics: { title: "Your basics", subtitle: "These help us fine-tune your plan." },
  complete: { title: "You're all set!", subtitle: "Your LeanMindset home is ready. You can browse labs anytime — no need to join one yet." },
};

export default function OnboardingScreen() {
  const { profile } = useProfile();
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(profile.user.gender || "Male");
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(profile.user.heightCm || 175);
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">(profile.preferences.heightUnit);
  const [weightKg, setWeightKg] = useState(Math.round(lbToKg(profile.weightLb) * 10) / 10 || 64);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">(profile.preferences.units);
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType ?? "lose");
  const [targetKg, setTargetKg] = useState(defaultTargetKg("lose", Math.round(lbToKg(profile.weightLb) * 10) / 10 || 64));
  const [activity, setActivity] = useState<ActivityLevel>(profile.activityLevel ?? "moderate");
  const [experience, setExperience] = useState<WorkoutExperience>(profile.workoutExperience ?? "returning");
  const [conditions, setConditions] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState(profile.user.name);
  const [modal, setModal] = useState<BasicsModal>(null);

  const stepId = STEPS[Math.min(step, STEPS.length - 1)];
  const copy = COPY[stepId];
  const progressIndex = Math.min(step, ONBOARDING_STEPS - 1);
  const label = goalLabel(goalType, weightKg, goalType === "maintain" ? weightKg : targetKg);
  const targets = dailyTargets({ kg: weightKg, cm: heightCm, age, gender, activity, goal: goalType });
  const loseDelta = Math.max(0, Math.round(weightKg - targetKg));

  const heightLabel = useMemo(() => {
    if (heightUnit === "cm") return `${Math.round(heightCm)} cm`;
    const total = Math.round(heightCm / 2.54);
    return `${Math.floor(total / 12)}'${total % 12}"`;
  }, [heightCm, heightUnit]);

  const weightLabel = useMemo(() => {
    if (weightUnit === "kg") return `${Math.round(weightKg)} kg`;
    return `${Math.round(weightKg * 2.2046)} lb`;
  }, [weightKg, weightUnit]);

  function go(next: number) {
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
  }

  function finish() {
    completeOnboarding({
      name: displayName.trim(),
      gender,
      birthdayLabel: `Jan 1, ${new Date().getFullYear() - age}`,
      heightCm,
      heightUnit,
      weightLb: kgToLb(weightKg),
      units: weightUnit,
      goalType,
      goalLabel: label,
      targetWeightKg: goalType === "maintain" ? Math.round(weightKg * 10) / 10 : targetKg,
      activityLevel: activity,
      workoutExperience: experience,
      healthConditions: conditions,
      kcalTarget: targets.kcalTarget,
      proteinTarget: targets.proteinTarget,
    });
    router.replace("/(tabs)");
  }

  function toggleCondition(item: string) {
    setConditions((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  }

  function pickGoal(next: GoalType) {
    setGoalType(next);
    setTargetKg(defaultTargetKg(next, weightKg));
  }

  return (
    <AppScreen edges={["top"]}>
      <View style={styles.page}>
        {stepId !== "complete" ? (
          <OnboardingHeader
            title={copy.title}
            subtitle={copy.subtitle}
            index={progressIndex}
            total={ONBOARDING_STEPS}
            onBack={step > 0 ? () => go(step - 1) : () => router.replace("/welcome")}
            onSkip={stepId === "name" || stepId === "basics" ? undefined : () => go(step + 1)}
          />
        ) : (
          <View style={styles.completeHead}>
            <CompleteBadge />
            <Text style={styles.completeTitle}>{copy.title}</Text>
            <Text style={styles.completeSub}>{copy.subtitle}</Text>
          </View>
        )}

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        <NextBar
          label={stepId === "complete" ? "Go to Home" : "Next"}
          disabled={(stepId === "name" && displayName.trim().length < 2) || (stepId === "health" && conditions.length === 0)}
          onPress={stepId === "complete" ? finish : () => go(step + 1)}
          extra={
            stepId === "health" ? (
              <Pressable onPress={() => { setConditions([]); go(step + 1); }} accessibilityRole="button">
                <Text style={styles.noneLink}>I don't have any</Text>
              </Pressable>
            ) : null
          }
          below={
            stepId === "complete" ? (
              <Pressable onPress={() => go(5)} accessibilityRole="button">
                <Text style={styles.profileLink}>Edit details in Profile</Text>
              </Pressable>
            ) : null
          }
        />
      </View>

      <OnboardingBasicsModal
        modal={modal}
        gender={gender}
        age={age}
        heightCm={heightCm}
        heightUnit={heightUnit}
        weightKg={weightKg}
        weightUnit={weightUnit}
        onClose={() => setModal(null)}
        onSaveGender={setGender}
        onSaveAge={setAge}
        onSaveHeight={(cm, unit) => {
          setHeightCm(cm);
          setHeightUnit(unit);
        }}
        onSaveWeight={(kg, unit) => {
          setWeightKg(Math.round(kg * 10) / 10);
          setWeightUnit(unit);
        }}
      />
    </AppScreen>
  );

  function renderStep() {
    if (stepId === "name") {
      return (
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>Your name</Text>
          <AppTextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Sakai"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.nameInput}
          />
        </View>
      );
    }

    if (stepId === "goal") {
      return (
        <View style={styles.goalGrid}>
          {GOALS.map((item) => (
            <GoalTile
              key={item.id}
              label={item.label}
              detail={item.detail}
              icon={item.icon}
              selected={goalType === item.id}
              onPress={() => pickGoal(item.id)}
            />
          ))}
        </View>
      );
    }

    if (stepId === "target") {
      return (
        <View style={styles.measure}>
          <UnitToggle options={["kg", "lbs"]} value={weightUnit === "kg" ? "kg" : "lbs"} onChange={(next) => setWeightUnit(next === "kg" ? "kg" : "lb")} />
          <WeightScale kg={targetKg} unit={weightUnit} onChange={setTargetKg} />
        </View>
      );
    }

    if (stepId === "activity") {
      return (
        <View style={styles.list}>
          {ACTIVITY_LEVELS.map((item) => (
            <OptionRow key={item.id} label={item.label} detail={item.detail} icon={item.icon} selected={activity === item.id} onPress={() => setActivity(item.id)} />
          ))}
        </View>
      );
    }

    if (stepId === "experience") {
      return (
        <View style={styles.list}>
          {EXPERIENCE.map((item) => (
            <OptionRow key={item.id} label={item.label} detail={item.detail} icon={item.icon} selected={experience === item.id} onPress={() => setExperience(item.id)} />
          ))}
        </View>
      );
    }

    if (stepId === "health") {
      return (
        <View style={styles.chipWrap}>
          {HEALTH_CONDITIONS.map((item) => (
            <HealthChip key={item} label={item} selected={conditions.includes(item)} onPress={() => toggleCondition(item)} />
          ))}
        </View>
      );
    }

    if (stepId === "basics") {
      return (
        <View style={styles.basicsList}>
          <BasicsRow label="Gender" value={gender} onPress={() => setModal("gender")} />
          <BasicsRow label="Age" value={String(age)} onPress={() => setModal("age")} />
          <BasicsRow label="Height" value={heightLabel} onPress={() => setModal("height")} />
          <BasicsRow label="Current weight" value={weightLabel} onPress={() => setModal("weight")} />
        </View>
      );
    }

    return (
      <PlanPreviewCard
        rows={[
          { label: "Goal", value: goalType === "lose" ? `Lose ${loseDelta} kg` : label, icon: { set: "ion", name: "flame" } },
          { label: "Calories", value: `${targets.kcalTarget.toLocaleString()} kcal/day`, icon: { set: "ion", name: "flame" } },
          { label: "Protein", value: `${targets.proteinTarget} g/day`, icon: { set: "mci", name: "arm-flex" } },
          { label: "Plan length", value: "6 weeks", icon: { set: "ion", name: "calendar-outline" }, iconColor: colors.textSecondary },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  page: { flex: 1, gap: 10 },
  body: { flex: 1, minHeight: 0 },
  bodyContent: { flexGrow: 1, paddingBottom: 4 },
  goalGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  list: { gap: 8 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  measure: { gap: 18, paddingTop: 8 },
  basicsList: { gap: 8 },
  noneLink: { fontSize: 14, color: colors.accentBlue, textAlign: "center", fontWeight: "600" },
  completeHead: { alignItems: "center", gap: 8, paddingTop: spacing.sm },
  completeTitle: { fontSize: 26, lineHeight: 32, fontWeight: "700", color: colors.white, textAlign: "center" },
  completeSub: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  nameBlock: { gap: 8, paddingTop: 8 },
  nameLabel: { fontSize: 13, color: colors.white, fontWeight: "500" },
  nameInput: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(10,12,14,0.72)",
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.white,
  },
  profileLink: {
    fontSize: 13,
    color: colors.accentBlue,
    textAlign: "center",
    fontWeight: "600",
    textDecorationLine: "underline",
    paddingTop: 2,
  },
});
