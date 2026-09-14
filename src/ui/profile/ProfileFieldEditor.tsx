import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "@/src/hooks/useProfile";
import {
  formatHeight,
  kgToLb,
  lbToKg,
  updatePreferences,
  updateUser,
  updateWeight,
} from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import AppTextInput from "@/src/ui/AppTextInput";
import ProfileIcon from "@/src/ui/profile/ProfileIcon";
import WheelPicker from "@/src/ui/profile/WheelPicker";

export type ProfileField =
  | "name"
  | "email"
  | "birthday"
  | "gender"
  | "height"
  | "weight"
  | "country"
  | "units";

const ACCENT = colors.accentBlue;
const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const COUNTRIES = [
  "Australia",
  "Canada",
  "France",
  "Germany",
  "India",
  "Mexico",
  "United Kingdom",
  "United States",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type ProfileFieldEditorProps = {
  field: ProfileField;
  onClose: () => void;
};

export default function ProfileFieldEditor({ field, onClose }: ProfileFieldEditorProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const metric = profile.preferences.units === "kg";
  const parts = splitName(profile.user.name);
  const parsed = parseBirthday(profile.user.birthdayLabel);

  const [first, setFirst] = useState(parts.first);
  const [last, setLast] = useState(parts.last);
  const [email, setEmail] = useState(profile.user.email);
  const [month, setMonth] = useState(MONTHS[parsed.month]);
  const [day, setDay] = useState(String(parsed.day));
  const [year, setYear] = useState(String(parsed.year));
  const [gender, setGender] = useState(profile.user.gender);
  const [heightValue, setHeightValue] = useState(
    metric ? String(Math.round(profile.user.heightCm)) : String(Math.round(profile.user.heightCm / 2.54)),
  );
  const [weightValue, setWeightValue] = useState(
    metric ? String(Math.round(lbToKg(profile.weightLb))) : String(Math.round(profile.weightLb)),
  );
  const [country, setCountry] = useState(profile.user.country);
  const [query, setQuery] = useState("");
  const [units, setUnits] = useState<"metric" | "imperial">(metric ? "metric" : "imperial");

  const titles: Record<ProfileField, string> = {
    name: "Full Name",
    email: "Email",
    birthday: "Birthday",
    gender: "Gender",
    height: "Height",
    weight: "Weight",
    country: "Country",
    units: "Units",
  };
  const pickerFooter = field === "birthday" || field === "height" || field === "weight";
  const days = useMemo(() => range(1, daysInMonth(MONTHS.indexOf(month), Number(year))).map(String), [month, year]);
  const years = useMemo(() => range(1945, 2018).map(String).reverse(), []);
  const heightOptions = useMemo(() => (metric ? range(140, 210) : range(54, 84)).map(String), [metric]);
  const weightOptions = useMemo(() => (metric ? range(40, 160) : range(90, 360)).map(String), [metric]);
  const countries = COUNTRIES.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));
  const selectedDay = days.includes(day) ? day : days[days.length - 1];

  function save() {
    if (field === "name") {
      const name = `${first.trim()} ${last.trim()}`.trim();
      if (name) updateUser({ name });
    }
    if (field === "email" && email.trim()) updateUser({ email: email.trim() });
    if (field === "birthday") updateUser({ birthdayLabel: `${month.slice(0, 3)} ${selectedDay}, ${year}` });
    if (field === "gender") updateUser({ gender });
    if (field === "height") {
      const numeric = Number(heightValue);
      if (!Number.isNaN(numeric)) updateUser({ heightCm: metric ? numeric : numeric * 2.54 });
    }
    if (field === "weight") {
      const numeric = Number(weightValue);
      if (!Number.isNaN(numeric)) updateWeight(metric ? kgToLb(numeric) : numeric);
    }
    if (field === "country") updateUser({ country });
    if (field === "units") {
      updatePreferences({
        units: units === "metric" ? "kg" : "lb",
        heightUnit: units === "metric" ? "cm" : "in",
      });
    }
    onClose();
  }

  return (
    <View
      style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.header}>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.side}>
          <ProfileIcon name="close" size={22} color={colors.white} strokeWidth={1.65} />
        </Pressable>
        <Text style={styles.title}>{titles[field].toUpperCase()}</Text>
        <View style={[styles.side, styles.right]}>
          {pickerFooter ? null : (
            <Pressable onPress={save} accessibilityRole="button" accessibilityLabel="Save">
              <Text style={styles.save}>Save</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {field === "name" ? (
          <View style={styles.stack}>
            <LabeledInput label="First Name" value={first} onChangeText={setFirst} placeholder="Your first name" />
            <LabeledInput label="Last Name" value={last} onChangeText={setLast} placeholder="Your last name" />
            <Text style={styles.hint}>This is how your name will appear across LeanMindset.</Text>
          </View>
        ) : null}

        {field === "email" ? (
          <View style={styles.stack}>
            <LabeledInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.hint}>We’ll send important updates to this email address.</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.link}>Change Email</Text>
            </Pressable>
          </View>
        ) : null}

        {field === "birthday" ? (
          <View style={styles.wheels}>
            <WheelPicker values={MONTHS} value={month} onChange={setMonth} />
            <WheelPicker values={days} value={selectedDay} onChange={setDay} width={72} />
            <WheelPicker values={years} value={year} onChange={setYear} width={88} />
          </View>
        ) : null}

        {field === "gender" ? (
          <View style={styles.stack}>
            {GENDERS.map((item) => (
              <ChoiceRow key={item} label={item} selected={gender === item} onPress={() => setGender(item)} />
            ))}
            <Text style={styles.hint}>This helps us personalize your experience.</Text>
          </View>
        ) : null}

        {field === "height" ? (
          <View style={styles.measure}>
            <Text style={styles.measureValue}>
              {metric ? `${heightValue} cm` : formatHeight(Number(heightValue) * 2.54, "in")}
            </Text>
            <WheelPicker values={heightOptions} value={heightValue} onChange={setHeightValue} />
          </View>
        ) : null}

        {field === "weight" ? (
          <View style={styles.measure}>
            <Text style={styles.measureValue}>
              {weightValue} {metric ? "kg" : "lb"}
            </Text>
            <WheelPicker values={weightOptions} value={weightValue} onChange={setWeightValue} />
          </View>
        ) : null}

        {field === "country" ? (
          <View style={styles.flex}>
            <View style={styles.search}>
              <ProfileIcon name="search" size={16} color={colors.white} strokeWidth={1.65} />
              <AppTextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search country"
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {countries.map((item) => (
                <ChoiceRow key={item} label={item} selected={country === item} onPress={() => setCountry(item)} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {field === "units" ? (
          <View style={styles.stack}>
            <RadioRow label="Metric (kg, cm)" selected={units === "metric"} onPress={() => setUnits("metric")} />
            <RadioRow label="Imperial (lb, ft/in)" selected={units === "imperial"} onPress={() => setUnits("imperial")} />
            <Text style={styles.hint}>This will change how measurements are displayed across the app.</Text>
          </View>
        ) : null}
      </View>

      {pickerFooter ? (
        <View style={styles.footer}>
          <Pressable onPress={onClose} style={styles.cancel} accessibilityRole="button">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={save} style={styles.done} accessibilityRole="button">
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  keyboardType?: "email-address" | "default";
  autoCapitalize?: "none" | "words";
  placeholder?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "words"}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

function ChoiceRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.choice} accessibilityRole="button" accessibilityState={{ selected }}>
      <Text style={styles.choiceLabel}>{label}</Text>
      {selected ? (
        <View style={styles.check}>
          <ProfileIcon name="check" size={12} color={colors.white} strokeWidth={2} />
        </View>
      ) : (
        <View style={styles.checkEmpty} />
      )}
    </Pressable>
  );
}

function RadioRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.choice} accessibilityRole="radio" accessibilityState={{ selected }}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function splitName(name: string) {
  const [first = "", ...rest] = name.trim().split(/\s+/);
  return { first, last: rest.join(" ") };
}

function parseBirthday(label: string) {
  const parsed = Date.parse(label);
  if (!Number.isNaN(parsed)) {
    const date = new Date(parsed);
    return { month: date.getMonth(), day: date.getDate(), year: date.getFullYear() };
  }
  return { month: 2, day: 12, year: 1994 };
}

function daysInMonth(monthIndex: number, year: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function range(from: number, to: number) {
  const out: number[] = [];
  for (let value = from; value <= to; value += 1) out.push(value);
  return out;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: spacing.lg,
  },
  header: {
    minHeight: layout.minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 64,
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
  },
  right: {
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.6,
  },
  save: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
  },
  flex: {
    flex: 1,
    gap: spacing.md,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  input: {
    minHeight: layout.minTouchTarget,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    color: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  link: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: "600",
  },
  wheels: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  measure: {
    flex: 1,
    alignItems: "center",
    gap: spacing.lg,
  },
  measureValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
  },
  search: {
    minHeight: layout.minTouchTarget,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    minHeight: layout.minTouchTarget,
  },
  choice: {
    minHeight: layout.minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  choiceLabel: {
    color: colors.white,
    fontSize: 16,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  checkEmpty: {
    width: 22,
    height: 22,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: {
    borderColor: ACCENT,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ACCENT,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  cancel: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  cancelText: {
    color: colors.white,
    fontSize: 16,
  },
  done: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
