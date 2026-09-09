export type WorkoutDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type WorkoutExercise = {
  id: string;
  name: string;
  detail: string;
  durationSec?: number;
  reps?: number;
  sets: number;
  restSec: number;
  illustration: string;
};

export type WorkoutSession = {
  id: string;
  title: string;
  durationMin: number;
  durationMax: number;
  difficulty: WorkoutDifficulty;
  tags: string[];
  illustration: string;
  completed: boolean;
  inProgress: boolean;
  exercises: WorkoutExercise[];
};

export type TrainingDay = {
  date: string;
  dayLabel: string;
  completed: boolean;
};

export const walkCoreA: WorkoutSession = {
  id: "walk-core-a",
  title: "Walk + Core A",
  durationMin: 25,
  durationMax: 30,
  difficulty: "Beginner",
  tags: ["NEAT + Midline"],
  illustration: "/train/walk-core-a.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "dead-bug",
      name: "Dead Bug",
      detail: "Opposite arm and leg, slow",
      reps: 10,
      sets: 3,
      restSec: 28,
      illustration: "/train/dead-bug.png",
    },
    {
      id: "plank",
      name: "Forearm plank",
      detail: "Keep ribs down, squeeze glutes",
      durationSec: 40,
      sets: 3,
      restSec: 20,
      illustration: "/train/plank.png",
    },
    {
      id: "bridge",
      name: "Glute bridge",
      detail: "Pause at the top",
      reps: 12,
      sets: 3,
      restSec: 28,
      illustration: "/train/glute-bridge.png",
    },
    {
      id: "bird-dog",
      name: "Bird dog",
      detail: "Opposite arm and leg, hold briefly",
      reps: 10,
      sets: 3,
      restSec: 28,
      illustration: "/train/bird-dog.png",
    },
    {
      id: "crunch",
      name: "Controlled crunch",
      detail: "Exhale on the way up",
      reps: 12,
      sets: 3,
      restSec: 28,
      illustration: "/train/crunch.png",
    },
    {
      id: "walk",
      name: "Brisk walk",
      detail: "Easy pace outdoors or indoors",
      durationSec: 480,
      sets: 1,
      restSec: 0,
      illustration: "/train/walk-core-a.png",
    },
  ],
};

export const walkMobility: WorkoutSession = {
  id: "walk-mobility",
  title: "20-min walk + mobility",
  durationMin: 20,
  durationMax: 20,
  difficulty: "Beginner",
  tags: ["Easy", "Recovery focus"],
  illustration: "/train/walk-core-a.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "easy-walk",
      name: "Easy walk",
      detail: "Conversational pace",
      durationSec: 720,
      sets: 1,
      restSec: 0,
      illustration: "/train/walk-core-a.png",
    },
    {
      id: "hips",
      name: "Hip openers",
      detail: "90/90 and figure-four",
      durationSec: 180,
      sets: 2,
      restSec: 20,
      illustration: "/train/bird-dog.png",
    },
    {
      id: "spine",
      name: "Cat-cow",
      detail: "Slow and controlled",
      reps: 8,
      sets: 2,
      restSec: 20,
      illustration: "/train/glute-bridge.png",
    },
    {
      id: "stretch",
      name: "Down-regulation stretch",
      detail: "Breathe through the nose",
      durationSec: 180,
      sets: 1,
      restSec: 0,
      illustration: "/train/crunch.png",
    },
  ],
};

export const coreCircuit: WorkoutSession = {
  id: "core-circuit",
  title: "Core circuit",
  durationMin: 12,
  durationMax: 15,
  difficulty: "Beginner",
  tags: ["Core", "Quick"],
  illustration: "/train/plank.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "dead-bug",
      name: "Dead Bug",
      detail: "Opposite arm and leg, slow",
      reps: 10,
      sets: 3,
      restSec: 28,
      illustration: "/train/dead-bug.png",
    },
    {
      id: "plank",
      name: "Forearm plank",
      detail: "Keep ribs down, squeeze glutes",
      durationSec: 40,
      sets: 3,
      restSec: 20,
      illustration: "/train/plank.png",
    },
    {
      id: "crunch",
      name: "Controlled crunch",
      detail: "Exhale on the way up",
      reps: 12,
      sets: 3,
      restSec: 28,
      illustration: "/train/crunch.png",
    },
  ],
};

export const gluteStrength: WorkoutSession = {
  id: "glute-strength",
  title: "Glute + hip strength",
  durationMin: 15,
  durationMax: 20,
  difficulty: "Beginner",
  tags: ["Strength", "Glutes"],
  illustration: "/train/glute-bridge.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "bridge",
      name: "Glute bridge",
      detail: "Pause at the top",
      reps: 12,
      sets: 3,
      restSec: 28,
      illustration: "/train/glute-bridge.png",
    },
    {
      id: "bird-dog",
      name: "Bird dog",
      detail: "Opposite arm and leg, hold briefly",
      reps: 10,
      sets: 3,
      restSec: 28,
      illustration: "/train/bird-dog.png",
    },
    {
      id: "plank",
      name: "Forearm plank",
      detail: "Keep ribs down, squeeze glutes",
      durationSec: 30,
      sets: 2,
      restSec: 20,
      illustration: "/train/plank.png",
    },
  ],
};

export const mobilityReset: WorkoutSession = {
  id: "mobility-reset",
  title: "Mobility reset",
  durationMin: 12,
  durationMax: 15,
  difficulty: "Beginner",
  tags: ["Mobility", "Easy"],
  illustration: "/train/bird-dog.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "hips",
      name: "Hip openers",
      detail: "90/90 and figure-four",
      durationSec: 180,
      sets: 2,
      restSec: 20,
      illustration: "/train/bird-dog.png",
    },
    {
      id: "spine",
      name: "Cat-cow",
      detail: "Slow and controlled",
      reps: 8,
      sets: 2,
      restSec: 20,
      illustration: "/train/glute-bridge.png",
    },
    {
      id: "stretch",
      name: "Down-regulation stretch",
      detail: "Breathe through the nose",
      durationSec: 180,
      sets: 1,
      restSec: 0,
      illustration: "/train/crunch.png",
    },
  ],
};

export const briskWalk: WorkoutSession = {
  id: "brisk-walk",
  title: "20-min brisk walk",
  durationMin: 20,
  durationMax: 20,
  difficulty: "Beginner",
  tags: ["Walk", "Cardio", "Quick"],
  illustration: "/train/walk-core-a.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "walk",
      name: "Brisk walk",
      detail: "Easy pace outdoors or indoors",
      durationSec: 1200,
      sets: 1,
      restSec: 0,
      illustration: "/train/walk-core-a.png",
    },
  ],
};

export const tenMinCore: WorkoutSession = {
  id: "ten-min-core",
  title: "10-min core",
  durationMin: 10,
  durationMax: 10,
  difficulty: "Beginner",
  tags: ["Core", "Quick"],
  illustration: "/train/crunch.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "plank",
      name: "Forearm plank",
      detail: "Keep ribs down, squeeze glutes",
      durationSec: 30,
      sets: 3,
      restSec: 15,
      illustration: "/train/plank.png",
    },
    {
      id: "dead-bug",
      name: "Dead Bug",
      detail: "Opposite arm and leg, slow",
      reps: 8,
      sets: 2,
      restSec: 20,
      illustration: "/train/dead-bug.png",
    },
    {
      id: "crunch",
      name: "Controlled crunch",
      detail: "Exhale on the way up",
      reps: 10,
      sets: 2,
      restSec: 20,
      illustration: "/train/crunch.png",
    },
  ],
};

export const recoveryFlow: WorkoutSession = {
  id: "recovery-flow",
  title: "Easy recovery walk",
  durationMin: 20,
  durationMax: 25,
  difficulty: "Beginner",
  tags: ["Recovery", "Walk", "Easy"],
  illustration: "/train/walk-core-a.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "easy-walk",
      name: "Easy walk",
      detail: "Conversational pace",
      durationSec: 900,
      sets: 1,
      restSec: 0,
      illustration: "/train/walk-core-a.png",
    },
    {
      id: "stretch",
      name: "Down-regulation stretch",
      detail: "Breathe through the nose",
      durationSec: 180,
      sets: 1,
      restSec: 0,
      illustration: "/train/crunch.png",
    },
  ],
};

export const fullBodyEasy: WorkoutSession = {
  id: "full-body-easy",
  title: "Full-body beginner",
  durationMin: 20,
  durationMax: 25,
  difficulty: "Beginner",
  tags: ["Strength", "Full body"],
  illustration: "/train/glute-bridge.png",
  completed: false,
  inProgress: false,
  exercises: [
    {
      id: "dead-bug",
      name: "Dead Bug",
      detail: "Opposite arm and leg, slow",
      reps: 10,
      sets: 2,
      restSec: 28,
      illustration: "/train/dead-bug.png",
    },
    {
      id: "bridge",
      name: "Glute bridge",
      detail: "Pause at the top",
      reps: 12,
      sets: 3,
      restSec: 28,
      illustration: "/train/glute-bridge.png",
    },
    {
      id: "bird-dog",
      name: "Bird dog",
      detail: "Opposite arm and leg, hold briefly",
      reps: 10,
      sets: 2,
      restSec: 28,
      illustration: "/train/bird-dog.png",
    },
    {
      id: "walk",
      name: "Brisk walk",
      detail: "Easy pace outdoors or indoors",
      durationSec: 480,
      sets: 1,
      restSec: 0,
      illustration: "/train/walk-core-a.png",
    },
  ],
};

export type WorkoutFocus = "walk" | "core" | "strength" | "mobility" | "recovery";

export type ExplorerWorkoutCard = {
  key: string;
  focus: WorkoutFocus;
  session: WorkoutSession;
};

const featuredWorkoutCards: ExplorerWorkoutCard[] = [
  { key: walkCoreA.id, focus: "walk", session: walkCoreA },
  { key: walkMobility.id, focus: "mobility", session: walkMobility },
  { key: coreCircuit.id, focus: "core", session: coreCircuit },
  { key: gluteStrength.id, focus: "strength", session: gluteStrength },
  { key: mobilityReset.id, focus: "mobility", session: mobilityReset },
  { key: briskWalk.id, focus: "walk", session: briskWalk },
];

const extraWorkoutCards: ExplorerWorkoutCard[] = [
  { key: tenMinCore.id, focus: "core", session: tenMinCore },
  { key: recoveryFlow.id, focus: "recovery", session: recoveryFlow },
  { key: fullBodyEasy.id, focus: "strength", session: fullBodyEasy },
];

export const workoutsById: Record<string, WorkoutSession> = Object.fromEntries(
  [...featuredWorkoutCards, ...extraWorkoutCards].map((card) => [card.session.id, card.session]),
);

export function getExplorerWorkoutCatalog(): ExplorerWorkoutCard[] {
  return featuredWorkoutCards;
}

export function workoutCardForSession(session: WorkoutSession): ExplorerWorkoutCard {
  const all = [...featuredWorkoutCards, ...extraWorkoutCards];
  return all.find((entry) => entry.session.id === session.id) ?? { key: session.id, focus: "walk", session };
}

export function workoutFocusLabel(focus: WorkoutFocus) {
  switch (focus) {
    case "walk":
      return "Walk";
    case "core":
      return "Core";
    case "strength":
      return "Strength";
    case "mobility":
      return "Mobility";
    case "recovery":
      return "Recovery";
  }
}

const WORKOUT_STOP = new Set([
  "a",
  "an",
  "the",
  "for",
  "or",
  "and",
  "me",
  "my",
  "some",
  "with",
  "of",
  "to",
  "find",
  "show",
  "want",
  "looking",
  "something",
  "please",
  "i",
  "need",
  "healthy",
  "workout",
  "workouts",
  "train",
  "training",
  "exercise",
  "exercises",
  "session",
  "sessions",
  "routine",
  "routines",
  "plan",
  "give",
  "get",
  "suggest",
  "can",
  "you",
  "what",
  "good",
  "best",
  "ai",
  "ask",
]);

type WorkoutSearchIntent = {
  tokens: string[];
  focuses: WorkoutFocus[];
  quick: boolean;
  beginner: boolean;
  maxMin: number | null;
};

function parseWorkoutSearch(query: string): WorkoutSearchIntent {
  const lower = query.toLowerCase();
  const focuses: WorkoutFocus[] = [];
  if (/\b(walk|walking|cardio|neat)\b/.test(lower)) focuses.push("walk");
  if (/\b(core|abs|midline|plank)\b/.test(lower)) focuses.push("core");
  if (/\b(strength|glute|glutes|full.?body|muscle)\b/.test(lower)) focuses.push("strength");
  if (/\b(mobility|stretch|hips|yoga)\b/.test(lower)) focuses.push("mobility");
  if (/\b(recovery|easy|rest|gentle)\b/.test(lower)) focuses.push("recovery");

  const under = lower.match(/\b(?:under|below|less than)\s+(\d+)/);
  let maxMin = under ? Number(under[1]) : null;
  if (maxMin == null && /\b(10|ten).?min/.test(lower)) maxMin = 10;
  if (maxMin == null && /\b(15|fifteen).?min/.test(lower)) maxMin = 15;
  if (maxMin == null && /\b(20|twenty).?min/.test(lower)) maxMin = 20;

  return {
    tokens: lower
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1 && !WORKOUT_STOP.has(token)),
    focuses,
    quick: /\b(quick|short|fast|10)\b/.test(lower),
    beginner: /\b(beginner|easy|intro)\b/.test(lower),
    maxMin,
  };
}

function scoreWorkout(entry: ExplorerWorkoutCard, intent: WorkoutSearchIntent) {
  const name = entry.session.title.toLowerCase();
  const tags = entry.session.tags.map((tag) => tag.toLowerCase());
  const moves = entry.session.exercises.map((item) => `${item.name} ${item.detail}`.toLowerCase());
  let score = 1;

  for (const token of intent.tokens) {
    if (name.includes(token)) score += 6;
    else if (tags.some((tag) => tag.includes(token))) score += 4;
    else if (moves.some((move) => move.includes(token))) score += 3;
    else if (entry.focus.includes(token)) score += 5;
  }

  if (intent.focuses.includes(entry.focus)) score += 8;
  if (intent.quick && (tags.includes("quick") || entry.session.durationMax <= 15)) score += 5;
  if (intent.beginner && entry.session.difficulty === "Beginner") score += 3;
  return score;
}

export function describeWorkoutSearch(query: string) {
  const intent = parseWorkoutSearch(query);
  const parts: string[] = [];
  if (intent.quick) parts.push("quick");
  if (intent.beginner) parts.push("beginner");
  if (intent.focuses.length === 1) parts.push(workoutFocusLabel(intent.focuses[0]).toLowerCase());
  if (intent.maxMin) parts.push(`under ${intent.maxMin} min`);
  if (parts.length) return `AI picks for ${parts.join(" · ")}`;
  const trimmed = query.trim();
  return trimmed ? `AI picks for “${trimmed}”` : "AI picks";
}

export function searchWorkouts(
  query: string,
  catalog: ExplorerWorkoutCard[],
  focus: "all" | WorkoutFocus,
): ExplorerWorkoutCard[] {
  const intent = parseWorkoutSearch(query);
  const pool = [...catalog, ...extraWorkoutCards];
  const seen = new Set<string>();
  const unique = pool.filter((entry) => {
    if (seen.has(entry.key)) return false;
    seen.add(entry.key);
    return true;
  });
  const focuses = intent.focuses.length > 0 ? intent.focuses : focus === "all" ? null : [focus];

  return unique
    .filter((entry) => {
      if (focuses && !focuses.includes(entry.focus)) return false;
      if (intent.maxMin != null && entry.session.durationMin > intent.maxMin) return false;
      return scoreWorkout(entry, intent) > 1 || intent.tokens.length === 0;
    })
    .sort((a, b) => scoreWorkout(b, intent) - scoreWorkout(a, intent));
}

export const defaultWeek: TrainingDay[] = [
  { date: "2026-08-10", dayLabel: "M", completed: true },
  { date: "2026-08-11", dayLabel: "T", completed: true },
  { date: "2026-08-12", dayLabel: "W", completed: true },
  { date: "2026-08-13", dayLabel: "T", completed: true },
  { date: "2026-08-14", dayLabel: "F", completed: true },
  { date: "2026-08-15", dayLabel: "S", completed: true },
  { date: "2026-08-16", dayLabel: "S", completed: false },
];

export function adherenceCount(days: TrainingDay[]) {
  return days.filter((day) => day.completed).length;
}

export function completeToday(days: TrainingDay[]) {
  const next = days.map((day) => ({ ...day }));
  const open = next.find((day) => !day.completed);
  if (open) open.completed = true;
  return next;
}

export function exerciseMeta(exercise: WorkoutExercise) {
  if (exercise.reps && exercise.sets) {
    return `${exercise.reps} reps × ${exercise.sets} sets`;
  }
  if (exercise.durationSec && exercise.sets > 1) {
    return `${exercise.durationSec} sec × ${exercise.sets} sets`;
  }
  if (exercise.durationSec) {
    const mins = Math.round(exercise.durationSec / 60);
    return mins >= 2 ? `${mins} min` : `${exercise.durationSec} sec`;
  }
  return exercise.detail;
}

export function timerDuration(exercise: WorkoutExercise) {
  if (exercise.reps) return exercise.restSec || 28;
  return exercise.durationSec || exercise.restSec || 28;
}
