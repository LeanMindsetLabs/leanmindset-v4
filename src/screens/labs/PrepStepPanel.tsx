import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { prepTasks } from "@/src/content/labs";
import { prepGroceryGroups, prepSupplements } from "@/src/content/prepResources";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useProfile } from "@/src/hooks/useProfile";
import {
  completePrepTask,
  togglePrepGroceryItem,
  togglePrepPhoto,
  togglePrepSupplementItem,
} from "@/src/services/labMembershipService";
import {
  formatWeight,
  kgToLb,
  lbToKg,
  updateMeasurement,
  updatePreferences,
  updateWeight,
} from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import AppTextInput from "@/src/ui/AppTextInput";
import BlueCta from "@/src/ui/BlueCta";
import SecondaryButton from "@/src/ui/SecondaryButton";

type PrepTaskId = keyof typeof prepTasks;
const PHOTO_SLOTS = ["Front", "Side", "Back"] as const;

type PrepStepPanelProps = {
  taskId: string;
  onDone: () => void;
};

export default function PrepStepPanel({ taskId, onDone }: PrepStepPanelProps) {
  function finish() {
    completePrepTask(taskId);
    onDone();
  }

  if (taskId === "weight") return <WeightStep onFinish={finish} onLater={finish} />;
  if (taskId === "measurements") return <MeasurementsStep onFinish={finish} onLater={finish} />;
  if (taskId === "photos") return <PhotosStep onFinish={finish} onLater={finish} />;
  if (taskId === "grocery") return <GroceryStep onFinish={finish} onLater={finish} />;
  if (taskId === "supplements") return <SupplementsStep onFinish={finish} onLater={finish} />;
  if (taskId === "health") return <HealthStep onFinish={finish} onLater={finish} />;
  if (taskId === "guide") return <GuideStep onFinish={finish} onLater={finish} />;

  const copy = (taskId in prepTasks ? prepTasks[taskId as PrepTaskId] : null) ?? {
    title: "Preparation",
    body: "Complete this step to keep getting ready.",
    cta: "Next",
  };
  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {copy.body}
      </Text>
      <BlueCta label={copy.cta} onPress={finish} />
      <SecondaryButton label="I’ll do this later" onPress={onDone} />
    </View>
  );
}

function WeightStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const { profile } = useProfile();
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const metric = unit === "kg";
  const current = metric ? lbToKg(profile.weightLb) : profile.weightLb;
  const [value, setValue] = useState(current ? current.toFixed(1) : "");
  const parsed = Number.parseFloat(value);
  const valid = Number.isFinite(parsed) && parsed > 0;

  function switchUnit(next: "lb" | "kg") {
    if (next === unit) return;
    const amount = Number.parseFloat(value);
    setUnit(next);
    updatePreferences({
      units: next,
      heightUnit: next === "kg" ? "cm" : "in",
    });
    if (!Number.isFinite(amount) || amount <= 0) return;
    setValue((next === "kg" ? lbToKg(amount) : kgToLb(amount)).toFixed(1));
  }

  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.weight.body}
      </Text>
      <UnitPills value={unit} options={["lb", "kg"]} onChange={switchUnit} />
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        {`Now ${formatWeight(profile.weightLb, unit)}`}
      </Text>
      <AppTextInput
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        placeholder={metric ? "kg" : "lb"}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Starting weight"
        style={styles.input}
      />
      <BlueCta
        label={prepTasks.weight.cta}
        disabled={!valid}
        onPress={() => {
          updateWeight(metric ? kgToLb(parsed) : parsed);
          updatePreferences({ units: unit, heightUnit: metric ? "cm" : "in" });
          onFinish();
        }}
      />
      <SecondaryButton label={prepTasks.weight.laterCta} onPress={onLater} />
    </View>
  );
}

function MeasurementsStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const { profile } = useProfile();
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const metric = unit === "cm";
  const [waist, setWaist] = useState(measureDisplay(profile.measurements.waist, metric));
  const [chest, setChest] = useState(measureDisplay(profile.measurements.chest, metric));
  const [hips, setHips] = useState(measureDisplay(profile.measurements.hips, metric));

  function switchUnit(next: "in" | "cm") {
    if (next === unit) return;
    setWaist(convertMeasureField(waist, unit, next));
    setChest(convertMeasureField(chest, unit, next));
    setHips(convertMeasureField(hips, unit, next));
    setUnit(next);
    updatePreferences({ heightUnit: next, units: next === "cm" ? "kg" : "lb" });
  }

  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.measurements.body}
      </Text>
      <UnitPills value={unit} options={["in", "cm"]} onChange={switchUnit} />
      <MeasureField label={`Waist (${unit})`} value={waist} onChange={setWaist} />
      <MeasureField label={`Chest (${unit})`} value={chest} onChange={setChest} />
      <MeasureField label={`Hips (${unit})`} value={hips} onChange={setHips} />
      <BlueCta
        label={prepTasks.measurements.cta}
        onPress={() => {
          saveMeasure("waist", toStoredInches(waist, metric));
          saveMeasure("chest", toStoredInches(chest, metric));
          saveMeasure("hips", toStoredInches(hips, metric));
          onFinish();
        }}
      />
      <SecondaryButton label={prepTasks.measurements.laterCta} onPress={onLater} />
    </View>
  );
}

function PhotosStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const { membership } = useLabMembership();
  const added = membership.prepChecklist?.photos ?? [];

  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.photos.body}
      </Text>
      {PHOTO_SLOTS.map((slot) => {
        const on = added.includes(slot);
        return (
          <Pressable
            key={slot}
            accessibilityRole="button"
            accessibilityLabel={`${slot} photo placeholder`}
            onPress={() => togglePrepPhoto(slot)}
            style={({ pressed }) => [styles.photoSlot, pressed ? styles.pressed : null]}
          >
            <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
              {slot}
            </Text>
            <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
              {on ? "Placeholder saved" : "Tap to add a placeholder"}
            </Text>
          </Pressable>
        );
      })}
      <BlueCta label={prepTasks.photos.cta} onPress={onFinish} />
      <SecondaryButton label={prepTasks.photos.laterCta} onPress={onLater} />
    </View>
  );
}

function GroceryStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const { membership } = useLabMembership();
  const checked = membership.prepChecklist?.groceryChecked ?? [];

  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.grocery.body}
      </Text>
      {prepGroceryGroups.map((group) => (
        <View key={group.aisle} style={styles.group}>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            {group.aisle}
          </Text>
          {group.items.map((item) => {
            const on = checked.includes(item.id);
            return (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => togglePrepGroceryItem(item.id)}
                style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
              >
                <View style={[styles.box, on ? styles.boxOn : null]} />
                <Text style={[styles.rowLabel, on ? styles.struck : null]} maxFontSizeMultiplier={1.3}>
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
      <BlueCta label={prepTasks.grocery.cta} onPress={onFinish} />
      <SecondaryButton label={prepTasks.grocery.laterCta} onPress={onLater} />
    </View>
  );
}

function SupplementsStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const { membership } = useLabMembership();
  const checked = membership.prepChecklist?.supplementChecked ?? [];

  return (
    <View style={styles.stack}>
      <View style={styles.group}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {prepSupplements.importantTitle}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {prepSupplements.important}
        </Text>
      </View>
      <View style={styles.group}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {prepSupplements.listTitle}
        </Text>
        {prepSupplements.items.map((item) => {
          const on = checked.includes(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => togglePrepSupplementItem(item.id)}
              style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
            >
              <View style={[styles.box, on ? styles.boxOn : null]} />
              <Text style={styles.rowLabel} maxFontSizeMultiplier={1.3}>
                {`${item.name} — ${item.when}`}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.group}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {prepSupplements.safetyTitle}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {prepSupplements.safety}
        </Text>
      </View>
      <BlueCta label={prepTasks.supplements.cta} onPress={onFinish} />
      <SecondaryButton label={prepTasks.supplements.laterCta} onPress={onLater} />
    </View>
  );
}

function HealthStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  const [ready, setReady] = useState(false);
  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.health.body}
      </Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: ready }}
        onPress={() => setReady((value) => !value)}
        style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
      >
        <View style={[styles.box, ready ? styles.boxOn : null]} />
        <Text style={styles.rowLabel} maxFontSizeMultiplier={1.4}>
          I feel ready to start Starter Lab
        </Text>
      </Pressable>
      <BlueCta label={prepTasks.health.cta} disabled={!ready} onPress={onFinish} />
      <SecondaryButton label={prepTasks.health.laterCta} onPress={onLater} />
    </View>
  );
}

function GuideStep({ onFinish, onLater }: { onFinish: () => void; onLater: () => void }) {
  return (
    <View style={styles.stack}>
      <Text style={typography.body} maxFontSizeMultiplier={1.4}>
        {prepTasks.guide.body}
      </Text>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        1. Prep starts the moment you are approved.
      </Text>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        2. Day 1 is always a Monday, with at least two days of prep.
      </Text>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        3. Follow today’s meals, training, and evening check-in.
      </Text>
      <BlueCta label={prepTasks.guide.cta} onPress={onFinish} />
      <SecondaryButton label={prepTasks.guide.laterCta} onPress={onLater} />
    </View>
  );
}

function MeasureField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      <AppTextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        style={styles.input}
      />
    </View>
  );
}

function UnitPills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <View style={styles.pills}>
      {options.map((option) => {
        const on = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(option)}
            style={[styles.pill, on ? styles.pillOn : null]}
          >
            <Text style={[styles.pillLabel, on ? styles.pillLabelOn : null]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function measureDisplay(inches: number, metric: boolean) {
  if (!(inches > 0)) return "";
  return metric ? (inches * 2.54).toFixed(1) : String(inches);
}

function convertMeasureField(raw: string, from: "in" | "cm", to: "in" | "cm") {
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return raw;
  if (from === to) return raw;
  const inches = from === "cm" ? parsed / 2.54 : parsed;
  return to === "cm" ? (inches * 2.54).toFixed(1) : (Math.round(inches * 10) / 10).toString();
}

function toStoredInches(raw: string, metric: boolean) {
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return "";
  return String(metric ? parsed / 2.54 : parsed);
}

function saveMeasure(key: "waist" | "chest" | "hips", raw: string) {
  const parsed = Number.parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) updateMeasurement(key, parsed);
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  group: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    minHeight: layout.minTouchTarget,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  photoSlot: {
    minHeight: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  row: {
    minHeight: layout.minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  boxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  struck: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  pressed: {
    opacity: 0.88,
  },
  pills: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  pill: {
    minWidth: 52,
    minHeight: layout.minTouchTarget - 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pillOn: {
    backgroundColor: colors.accentBlue,
  },
  pillLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "none",
  },
  pillLabelOn: {
    color: colors.white,
  },
});
