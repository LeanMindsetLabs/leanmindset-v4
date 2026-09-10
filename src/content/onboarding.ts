export const MONTHS = [
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
] as const;

export const ALL_GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"] as const;

export const GOALS = [
  {
    id: "lose" as const,
    label: "Lose fat",
    detail: "Drop weight with a calorie deficit you can keep.",
    icon: "flame" as const,
  },
  {
    id: "recomp" as const,
    label: "Recomp",
    detail: "Lose fat, keep muscle, look tighter.",
    icon: "trending-up" as const,
  },
  {
    id: "maintain" as const,
    label: "Maintain",
    detail: "Hold your weight and lock in habits.",
    icon: "scale" as const,
  },
  {
    id: "build" as const,
    label: "Build muscle",
    detail: "Eat to grow while staying lean.",
    icon: "barbell" as const,
  },
];

export const ACTIVITY_LEVELS = [
  { id: "sedentary" as const, label: "Mostly sitting", detail: "Desk days, little structured training", icon: "desktop-outline" as const },
  { id: "light" as const, label: "Light", detail: "1–2 sessions or long walks", icon: "walk-outline" as const },
  { id: "moderate" as const, label: "Moderate", detail: "3–4 training days a week", icon: "fitness-outline" as const },
  { id: "active" as const, label: "Active", detail: "5–6 sessions, on your feet a lot", icon: "footsteps-outline" as const },
  { id: "athlete" as const, label: "Athlete", detail: "Two-a-days or very physical work", icon: "trophy-outline" as const },
];

export const EXPERIENCE = [
  { id: "new" as const, label: "New to training", detail: "We'll start with foundations.", icon: "sparkles-outline" as const },
  { id: "returning" as const, label: "Coming back", detail: "You've trained before. We'll rebuild.", icon: "refresh-outline" as const },
  { id: "consistent" as const, label: "Already consistent", detail: "We'll raise density and precision.", icon: "stats-chart-outline" as const },
];

export const HEALTH_CONDITIONS = [
  "Obesity",
  "PCOS / PCOD",
  "Knee / joint issues",
  "Diabetes",
  "High cholesterol / BP",
  "Thyroid issues",
  "Pre / post pregnancy",
  "Back or disc issues",
  "History of disordered eating",
  "Other",
];

export const ONBOARDING_STEPS = 7;
