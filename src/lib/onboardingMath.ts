import type { ActivityLevel, GoalType } from "@/src/services/profileService";

export function daysInMonth(monthIndex: number, year: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function range(from: number, to: number, step = 1) {
  const out: number[] = [];
  for (let value = from; value <= to; value += step) out.push(value);
  return out;
}

export function ageFromParts(year: number, monthIndex: number, day: number, now = new Date()) {
  let age = now.getFullYear() - year;
  const month = now.getMonth() - monthIndex;
  if (month < 0 || (month === 0 && now.getDate() < day)) age -= 1;
  return Math.max(0, age);
}

export function formatBirthday(month: string, day: string, year: string) {
  return `${month.slice(0, 3)} ${Number(day)}, ${year}`;
}

export function bmiFromMetric(kg: number, cm: number) {
  const meters = cm / 100;
  if (meters <= 0) return 0;
  return kg / (meters * meters);
}

export function activityMultiplier(level: ActivityLevel) {
  switch (level) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "athlete":
      return 1.9;
    default:
      return 1.55;
  }
}

export function bmrKcal(kg: number, cm: number, age: number, gender: string) {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  if (gender === "Female") return base - 161;
  if (gender === "Male") return base + 5;
  return base - 78;
}

export function dailyTargets(args: {
  kg: number;
  cm: number;
  age: number;
  gender: string;
  activity: ActivityLevel;
  goal: GoalType;
}) {
  const tdee = bmrKcal(args.kg, args.cm, args.age, args.gender) * activityMultiplier(args.activity);
  const shift = args.goal === "lose" ? -500 : args.goal === "build" ? 250 : args.goal === "recomp" ? -250 : 0;
  const kcalTarget = Math.round((tdee + shift) / 10) * 10;
  const proteinPerKg = args.goal === "build" ? 2 : args.goal === "maintain" ? 1.6 : 1.9;
  const proteinTarget = Math.round(args.kg * proteinPerKg);
  return { kcalTarget, proteinTarget, tdee: Math.round(tdee) };
}

export function goalLabel(goal: GoalType, currentKg: number, targetKg: number) {
  const delta = Math.round(Math.abs(currentKg - targetKg));
  if (goal === "maintain") return "Maintain weight";
  if (goal === "build") return delta > 0 ? `Build · +${delta} kg` : "Build muscle";
  if (goal === "recomp") return "Recomp · leaner";
  return delta > 0 ? `Lose ${delta} kg` : "Lose fat";
}

export function defaultTargetKg(goal: GoalType, currentKg: number) {
  if (goal === "build") return Math.round((currentKg + 3) * 10) / 10;
  if (goal === "maintain") return Math.round(currentKg * 10) / 10;
  return Math.max(45, Math.round((currentKg - 6) * 10) / 10);
}

export function cmToDisplay(cm: number, unit: "cm" | "in") {
  if (unit === "cm") return { value: Math.round(cm), suffix: "cm" };
  const total = Math.round(cm / 2.54);
  const feet = Math.floor(total / 12);
  const inches = total - feet * 12;
  return { value: feet, suffix: `${inches}"`, feet, inches };
}

/** 54–84 inches → 4'6" … 7'0". */
export function formatFtIn(totalInches: number) {
  const clamped = Math.max(54, Math.min(84, Math.round(totalInches)));
  const feet = Math.floor(clamped / 12);
  const inches = clamped % 12;
  return `${feet}'${inches}"`;
}

export function parseFtIn(label: string) {
  const match = label.trim().match(/^(\d+)\s*'\s*(\d+)\s*"?$/);
  if (!match) return null;
  return Number(match[1]) * 12 + Number(match[2]);
}

export function heightMarks(unit: "cm" | "in") {
  if (unit === "cm") return range(140, 210).map(String);
  return range(54, 84).map(formatFtIn);
}

export function heightDraftFromCm(cm: number, unit: "cm" | "in") {
  if (unit === "cm") return String(Math.round(cm));
  return formatFtIn(cm / 2.54);
}

export function heightDraftToCm(draft: string, unit: "cm" | "in") {
  if (unit === "cm") return Number(draft);
  return (parseFtIn(draft) ?? 67) * 2.54;
}
