import type { LabDailyTask } from "@/src/types";

type DayPlan = {
  trainId: string;
  trainTitle: string;
  trainMeta: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

const WEEK: DayPlan[] = [
  {
    trainId: "walk-core-a",
    trainTitle: "Walk + Core A",
    trainMeta: "25 min · Beginner",
    breakfast: "Greek yogurt bowl",
    lunch: "Chicken + rice",
    dinner: "Salmon plate",
  },
  {
    trainId: "core-circuit",
    trainTitle: "Core circuit",
    trainMeta: "20 min · Beginner",
    breakfast: "Overnight oats",
    lunch: "Turkey plate",
    dinner: "Tofu stir-fry",
  },
  {
    trainId: "glute-strength",
    trainTitle: "Glute strength",
    trainMeta: "25 min · Beginner",
    breakfast: "Eggs + berries",
    lunch: "Chicken vegetables",
    dinner: "Salmon + veg",
  },
  {
    trainId: "brisk-walk",
    trainTitle: "Brisk walk",
    trainMeta: "30 min · Beginner",
    breakfast: "Yogurt + oats",
    lunch: "Turkey wrap",
    dinner: "Chicken bowl",
  },
  {
    trainId: "full-body-easy",
    trainTitle: "Full body easy",
    trainMeta: "25 min · Beginner",
    breakfast: "Protein smoothie",
    lunch: "Salmon salad",
    dinner: "Tofu plate",
  },
  {
    trainId: "walk-mobility",
    trainTitle: "Walk + mobility",
    trainMeta: "25 min · Beginner",
    breakfast: "Greek yogurt bowl",
    lunch: "Chicken + greens",
    dinner: "Turkey dinner",
  },
  {
    trainId: "recovery-flow",
    trainTitle: "Recovery flow",
    trainMeta: "20 min · Beginner",
    breakfast: "Oats + berries",
    lunch: "Leftover protein",
    dinner: "Light salmon plate",
  },
];

export const STARTER_TOTAL_DAYS = 30;

export function planForDay(day: number): { trainId: string; dailyTasks: LabDailyTask[] } {
  const week = WEEK[(Math.max(1, day) - 1) % WEEK.length];
  return {
    trainId: week.trainId,
    dailyTasks: [
      { id: "breakfast", title: `Breakfast · ${week.breakfast}`, meta: "Log your meal", complete: false },
      { id: "lunch", title: `Lunch · ${week.lunch}`, meta: "Log your meal", complete: false },
      { id: "dinner", title: `Dinner · ${week.dinner}`, meta: "Log your meal", complete: false },
      { id: "train", title: week.trainTitle, meta: week.trainMeta, complete: false },
      { id: "checkin", title: "Evening check-in", meta: "Weight · reflection", complete: false },
    ],
  };
}
