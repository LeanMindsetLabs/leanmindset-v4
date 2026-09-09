import { appStorage } from "@/src/lib/storage";

export type WeightEntry = {
  date: string;
  label: string;
  lb: number;
};

export type MeasurementKey = "weight" | "waist" | "chest" | "hips";

export type Measurements = Record<MeasurementKey, number>;

export type AppPreferences = {
  notifications: boolean;
  units: "lb" | "kg";
  shareProgress: boolean;
  darkMode: boolean;
  heightUnit: "cm" | "in";
  temperatureUnit: "c" | "f";
  coachingReminders: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  achievementAlerts: boolean;
};

export type ProgramInfo = {
  name: string;
  day: number;
  totalDays: number;
  phase: string;
  upcoming: string;
  schedule: { week: string; focus: string }[];
};

export type MembershipInfo = {
  planName: string;
  interval: string;
  status: "active" | "inactive";
  memberSinceLabel: string;
  nextBillingLabel: string;
  last4: string;
  brand: string;
};

export type Achievement = {
  id: string;
  label: string;
  detail: string;
  caption: string;
  mark: string;
  tone: "blue" | "green" | "purple" | "muted";
  icon?: "flame";
  unlocked: boolean;
};

export type GoalType = "lose" | "maintain" | "recomp" | "build";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";
export type WorkoutExperience = "new" | "returning" | "consistent";

export type OnboardingResult = {
  name: string;
  gender: string;
  birthdayLabel: string;
  heightCm: number;
  heightUnit: "cm" | "in";
  weightLb: number;
  units: "lb" | "kg";
  goalType: GoalType;
  goalLabel: string;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  workoutExperience: WorkoutExperience;
  healthConditions: string[];
  kcalTarget: number;
  proteinTarget: number;
};

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  initial: string;
  online: boolean;
  birthdayLabel: string;
  gender: string;
  heightCm: number;
  country: string;
  memberSinceLabel: string;
  leanLevel: number;
};

export type ProfileState = {
  user: ProfileUser;
  leanScore: number;
  leanStatus: string;
  weightLb: number;
  weightDeltaLb: number;
  weightHistory: WeightEntry[];
  measurements: Measurements;
  program: ProgramInfo;
  appleHealthConnected: boolean;
  preferences: AppPreferences;
  streakDays: number;
  consistencyPct: number;
  workoutsCount: number;
  goalLabel: string;
  targetWeightKg: number;
  goalProgress: number;
  goalType: GoalType;
  activityLevel: ActivityLevel;
  workoutExperience: WorkoutExperience;
  healthConditions: string[];
  kcalTarget: number;
  proteinTarget: number;
  onboardingComplete: boolean;
  membership: MembershipInfo;
  achievements: Achievement[];
};

const SESSION_KEY = "lm-session";
const PROFILE_KEY = "lm-profile";
const HAS_ACCOUNT_KEY = "lm-has-account";
const PENDING_EMAIL_KEY = "lm-pending-email";
const FIRST_TIME_FLOW_KEY = "lm-first-time-flow";

/** Mock OTP — any 6 digits accepted until a real email backend is wired. */
export const MOCK_OTP_CODE = "123456";

export const defaultUser: ProfileUser = {
  id: "mani-a",
  name: "Mani A",
  email: "mani.dev@gmail.com",
  initial: "M",
  online: true,
  birthdayLabel: "Mar 12, 1994",
  gender: "Male",
  heightCm: 175,
  country: "United States",
  memberSinceLabel: "Aug 2026",
  leanLevel: 12.3,
};

export const defaultProfile: ProfileState = {
  user: defaultUser,
  leanScore: 65,
  leanStatus: "Good",
  weightLb: 141.1,
  weightDeltaLb: -7.05,
  weightHistory: [
    { date: "2026-07-20", label: "Jul 20", lb: 158.7 },
    { date: "2026-07-22", label: "Jul 22", lb: 157.0 },
    { date: "2026-07-24", label: "Jul 24", lb: 157.9 },
    { date: "2026-07-26", label: "Jul 26", lb: 155.2 },
    { date: "2026-07-28", label: "Jul 28", lb: 156.3 },
    { date: "2026-07-31", label: "Jul 31", lb: 153.7 },
    { date: "2026-08-03", label: "Aug 3", lb: 154.8 },
    { date: "2026-08-05", label: "Aug 5", lb: 151.2 },
    { date: "2026-08-08", label: "Aug 8", lb: 152.1 },
    { date: "2026-08-11", label: "Aug 11", lb: 148.6 },
    { date: "2026-08-14", label: "Aug 14", lb: 146.8 },
    { date: "2026-08-17", label: "Aug 17", lb: 144.2 },
    { date: "2026-08-19", label: "Aug 20", lb: 141.1 },
  ],
  measurements: {
    weight: 141.1,
    waist: 34.5,
    chest: 40,
    hips: 38,
  },
  program: {
    name: "6-Week Lab",
    day: 18,
    totalDays: 42,
    phase: "Build",
    upcoming: "Peak",
    schedule: [
      { week: "Weeks 1–2", focus: "Foundation · Walk + Core" },
      { week: "Weeks 3–4", focus: "Build · Strength density" },
      { week: "Weeks 5–6", focus: "Peak · Adherence lock-in" },
    ],
  },
  appleHealthConnected: false,
  preferences: {
    notifications: true,
    units: "kg",
    shareProgress: false,
    darkMode: true,
    heightUnit: "cm",
    temperatureUnit: "c",
    coachingReminders: true,
    workoutReminders: true,
    mealReminders: false,
    achievementAlerts: true,
  },
  streakDays: 18,
  consistencyPct: 84,
  workoutsCount: 42,
  goalLabel: "Lose 6 kg",
  targetWeightKg: 60,
  goalProgress: 0.65,
  goalType: "lose",
  activityLevel: "moderate",
  workoutExperience: "returning",
  healthConditions: [],
  kcalTarget: 2100,
  proteinTarget: 140,
  onboardingComplete: true,
  membership: {
    planName: "Premium Plan",
    interval: "Annual",
    status: "active",
    memberSinceLabel: "Aug 14, 2026",
    nextBillingLabel: "Aug 14, 2027",
    last4: "4242",
    brand: "Visa",
  },
  achievements: [
    { id: "7-days", label: "7 DAYS", caption: "STREAK", detail: "Week streak", mark: "7", tone: "purple", unlocked: true },
    { id: "10-workouts", label: "10 WORKOUTS", caption: "WORKOUTS", detail: "Training volume", mark: "10", tone: "green", unlocked: true },
    { id: "calorie-burn", label: "2000", caption: "CALORIE BURN", detail: "Fuel target hit", mark: "2000", tone: "purple", unlocked: true },
    { id: "1-month", label: "1 MONTH", caption: "MEMBER", detail: "Member milestone", mark: "1 MO", tone: "muted", unlocked: true },
    { id: "early-bird", label: "EARLY BIRD", caption: "MORNING", detail: "5 morning sessions", mark: "5 AM", tone: "muted", unlocked: false },
    { id: "protein", label: "PROTEIN PRO", caption: "NUTRITION", detail: "7 days on target", mark: "PRO", tone: "muted", unlocked: false },
  ],
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function persistProfile(next: ProfileState) {
  appStorage.setItem(PROFILE_KEY, JSON.stringify(next));
}

function persistSession(user: ProfileUser | null) {
  if (user) appStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else appStorage.removeItem(SESSION_KEY);
}

function readJson<T>(key: string): T | null {
  try {
    const raw = appStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function rehydrateProfile() {
  profile = loadProfile();
  session = readJson<ProfileUser>(SESSION_KEY);
  notify();
}

function mergeProfile(saved: Partial<ProfileState> | null): ProfileState {
  if (!saved) return { ...defaultProfile, user: { ...defaultUser } };
  return {
    ...defaultProfile,
    ...saved,
    user: { ...defaultUser, ...saved.user },
    measurements: { ...defaultProfile.measurements, ...saved.measurements },
    program: { ...defaultProfile.program, ...saved.program },
    preferences: { ...defaultProfile.preferences, ...saved.preferences },
    membership: { ...defaultProfile.membership, ...saved.membership },
    healthConditions: saved.healthConditions ?? defaultProfile.healthConditions,
    weightHistory: saved.weightHistory?.length ? saved.weightHistory : defaultProfile.weightHistory,
    weightLb: saved.weightLb ?? defaultProfile.weightLb,
    weightDeltaLb: saved.weightDeltaLb ?? defaultProfile.weightDeltaLb,
    achievements:
      saved.achievements?.length &&
      saved.achievements.every((item) => "tone" in item && "mark" in item && "caption" in item) &&
      saved.achievements.some((item) => item.mark === "1 MO")
        ? saved.achievements
        : defaultProfile.achievements,
  };
}

function loadProfile(): ProfileState {
  return mergeProfile(readJson<ProfileState>(PROFILE_KEY));
}

let profile: ProfileState = loadProfile();
let session: ProfileUser | null = readJson<ProfileUser>(SESSION_KEY);

export function hasStoredAccount() {
  return appStorage.getItem(HAS_ACCOUNT_KEY) === "1";
}

export function setPendingEmail(email: string) {
  appStorage.setItem(PENDING_EMAIL_KEY, email.trim());
}

export function getPendingEmail() {
  return appStorage.getItem(PENDING_EMAIL_KEY);
}

export function clearPendingEmail() {
  appStorage.removeItem(PENDING_EMAIL_KEY);
}

export function setFirstTimeFlow(active: boolean) {
  if (active) appStorage.setItem(FIRST_TIME_FLOW_KEY, "1");
  else appStorage.removeItem(FIRST_TIME_FLOW_KEY);
}

export function isFirstTimeFlow() {
  return appStorage.getItem(FIRST_TIME_FLOW_KEY) === "1";
}

/** Returns true for any 6-digit code (mock — no real email OTP backend yet). */
export function verifyOtpCode(code: string) {
  return /^\d{6}$/.test(code.trim());
}

function markHasAccount() {
  appStorage.setItem(HAS_ACCOUNT_KEY, "1");
}

function buildUserFromEmail(email: string): ProfileUser {
  const trimmed = email.trim() || defaultUser.email;
  const local = trimmed.split("@")[0] ?? "User";
  const name =
    trimmed === defaultUser.email
      ? defaultUser.name
      : local.replace(/[._-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  return {
    ...defaultUser,
    email: trimmed,
    name,
    initial: (name[0] || "M").toUpperCase(),
  };
}

export function getProfile() {
  return profile;
}

export function getSession() {
  return session;
}

export function subscribeProfile(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function requestEmailOtp(email: string) {
  const trimmed = email.trim();
  if (!trimmed.includes("@")) return null;
  setPendingEmail(trimmed);
  return trimmed;
}

export function completeOtpLogin(email: string, options?: { firstTime?: boolean }) {
  const user = buildUserFromEmail(email);
  session = user;
  markHasAccount();
  clearPendingEmail();

  if (options?.firstTime) {
    profile = {
      ...defaultProfile,
      user,
      onboardingComplete: false,
      goalProgress: 0,
      streakDays: 0,
      consistencyPct: 0,
      workoutsCount: 0,
      leanScore: 50,
      leanStatus: "Getting started",
    };
  } else {
    const saved = readJson<ProfileState>(PROFILE_KEY);
    profile = saved ? mergeProfile(saved) : { ...defaultProfile, user };
    profile = { ...profile, user: { ...profile.user, email: user.email, name: user.name, initial: user.initial } };
  }

  setFirstTimeFlow(false);
  persistSession(session);
  persistProfile(profile);
  notify();
  return session;
}

/** @deprecated Use requestEmailOtp + completeOtpLogin. Kept for dev shortcuts. */
export function login(email: string) {
  setFirstTimeFlow(true);
  return completeOtpLogin(email, { firstTime: true });
}

export function logout() {
  session = null;
  profile = { ...defaultProfile, user: { ...defaultUser } };
  persistSession(null);
  appStorage.removeItem(PROFILE_KEY);
  clearPendingEmail();
  setFirstTimeFlow(false);
  notify();
}

export function updateUser(patch: Partial<ProfileUser>) {
  const user = { ...profile.user, ...patch };
  if (patch.name) user.initial = patch.name.trim()[0]?.toUpperCase() || user.initial;
  profile = { ...profile, user };
  if (session) {
    session = { ...session, ...user };
    persistSession(session);
  }
  persistProfile(profile);
  notify();
}

export function updateWeight(lb: number) {
  const next = Math.round(lb * 10) / 10;
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const label = now.toLocaleString("en-US", { month: "short", day: "numeric" });
  const weightHistory = [
    ...profile.weightHistory.filter((entry) => entry.date !== date),
    { date, label, lb: next },
  ];
  const start = weightHistory[0]?.lb ?? next;
  profile = {
    ...profile,
    weightLb: next,
    weightDeltaLb: Math.round((next - start) * 10) / 10,
    measurements: { ...profile.measurements, weight: next },
    weightHistory,
  };
  persistProfile(profile);
  notify();
}

export function updateMeasurement(key: MeasurementKey, value: number) {
  const next = Math.round(value * 10) / 10;
  profile = {
    ...profile,
    measurements: { ...profile.measurements, [key]: next },
    ...(key === "weight" ? { weightLb: next } : {}),
  };
  persistProfile(profile);
  notify();
}

export function setAppleHealthConnected(connected: boolean) {
  profile = { ...profile, appleHealthConnected: connected };
  persistProfile(profile);
  notify();
}

export function updatePreferences(patch: Partial<AppPreferences>) {
  profile = { ...profile, preferences: { ...profile.preferences, ...patch } };
  persistProfile(profile);
  notify();
}

export function completeOnboarding(result: OnboardingResult) {
  const now = new Date();
  const memberSinceLabel = now.toLocaleString("en-US", { month: "short", year: "numeric" });
  const date = now.toISOString().slice(0, 10);
  const label = now.toLocaleString("en-US", { month: "short", day: "numeric" });
  const user: ProfileUser = {
    ...profile.user,
    name: result.name,
    initial: result.name.trim()[0]?.toUpperCase() || profile.user.initial,
    gender: result.gender,
    birthdayLabel: result.birthdayLabel,
    heightCm: result.heightCm,
    memberSinceLabel,
  };
  session = user;
  profile = {
    ...profile,
    user,
    onboardingComplete: true,
    weightLb: result.weightLb,
    weightDeltaLb: 0,
    measurements: { ...profile.measurements, weight: result.weightLb },
    weightHistory: [{ date, label, lb: result.weightLb }],
    preferences: {
      ...profile.preferences,
      units: result.units,
      heightUnit: result.heightUnit,
    },
    goalType: result.goalType,
    goalLabel: result.goalLabel,
    targetWeightKg: result.targetWeightKg,
    goalProgress: 0,
    activityLevel: result.activityLevel,
    workoutExperience: result.workoutExperience,
    healthConditions: result.healthConditions,
    kcalTarget: result.kcalTarget,
    proteinTarget: result.proteinTarget,
    leanScore: 50,
    leanStatus: "Getting started",
    streakDays: 0,
    consistencyPct: 0,
    workoutsCount: 0,
    program: {
      ...profile.program,
      day: 1,
      phase: result.workoutExperience === "consistent" ? "Build" : "Foundation",
    },
  };
  persistSession(session);
  persistProfile(profile);
  notify();
}

export function lbToKg(lb: number) {
  return lb / 2.2046;
}

export function kgToLb(kg: number) {
  return kg * 2.2046;
}

export function formatWeight(lb: number, units: "lb" | "kg") {
  if (units === "kg") return `${lbToKg(lb).toFixed(1)} kg`;
  return `${lb.toFixed(1)} lb`;
}

export function formatWeightDelta(lb: number, units: "lb" | "kg") {
  const value = units === "kg" ? lbToKg(lb) : lb;
  const unit = units === "kg" ? "kg" : "lb";
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)} ${unit}`;
}

export function formatHeight(cm: number, unit: "cm" | "in") {
  if (unit === "in") {
    const total = cm / 2.54;
    const feet = Math.floor(total / 12);
    const inches = Math.round(total - feet * 12);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}
