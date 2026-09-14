import {
  completeToday,
  defaultWeek,
  timerDuration,
  walkCoreA,
  workoutsById,
  type TrainingDay,
  type WorkoutSession,
} from "./trainService";
import { completeDailyTask } from "./labMembershipService";

export type WorkoutRuntime = {
  session: WorkoutSession;
  week: TrainingDay[];
  view: "home" | "session";
  step: number;
  currentSet: number;
  remaining: number;
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function initial(workout: WorkoutSession): WorkoutRuntime {
  const first = workout.exercises[0];
  return {
    session: { ...workout, exercises: workout.exercises.map((item) => ({ ...item })) },
    week: defaultWeek.map((day) => ({ ...day })),
    view: "home",
    step: 0,
    currentSet: 1,
    remaining: first ? timerDuration(first) : 28,
  };
}

let runtime: WorkoutRuntime = initial(walkCoreA);

export function getWorkoutRuntime() {
  return runtime;
}

export function subscribeWorkout(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function setRuntime(next: WorkoutRuntime) {
  runtime = next;
  notify();
}

export function loadWorkout(workoutId: string, start = false) {
  const workout = workoutsById[workoutId];
  if (!workout) return;
  const next = initial({ ...workout, completed: runtime.session.id === workoutId ? runtime.session.completed : workout.completed });
  if (runtime.session.id === workoutId) {
    next.week = runtime.week;
    next.session.completed = runtime.session.completed;
  }
  if (start && !next.session.completed) {
    next.view = "session";
    next.session.inProgress = true;
    next.step = 0;
    next.currentSet = 1;
    next.remaining = timerDuration(next.session.exercises[0]);
  }
  setRuntime(next);
}

export function startSession() {
  if (!runtime.session.exercises.length || runtime.session.completed) return;
  if (runtime.session.inProgress) {
    setRuntime({ ...runtime, view: "session" });
    return;
  }
  const exercise = runtime.session.exercises[0];
  setRuntime({
    ...runtime,
    view: "session",
    step: 0,
    currentSet: 1,
    remaining: timerDuration(exercise),
    session: { ...runtime.session, inProgress: true },
  });
}

export function leaveSession() {
  setRuntime({ ...runtime, view: "home" });
}

export function tickTimer() {
  if (runtime.view !== "session" || runtime.remaining <= 0) return;
  setRuntime({ ...runtime, remaining: runtime.remaining - 1 });
}

export function previousExercise() {
  if (runtime.step <= 0) return;
  const step = runtime.step - 1;
  const exercise = runtime.session.exercises[step];
  setRuntime({
    ...runtime,
    step,
    currentSet: 1,
    remaining: timerDuration(exercise),
  });
}

export function completeSet() {
  const exercise = runtime.session.exercises[runtime.step];
  if (!exercise) return;
  if (runtime.currentSet < exercise.sets) {
    setRuntime({
      ...runtime,
      currentSet: runtime.currentSet + 1,
      remaining: timerDuration(exercise),
    });
    return;
  }
  if (runtime.step >= runtime.session.exercises.length - 1) {
    finishWorkout();
    return;
  }
  const step = runtime.step + 1;
  const next = runtime.session.exercises[step];
  setRuntime({
    ...runtime,
    step,
    currentSet: 1,
    remaining: timerDuration(next),
  });
}

export function finishWorkout() {
  setRuntime({
    ...runtime,
    view: "home",
    step: 0,
    currentSet: 1,
    session: { ...runtime.session, completed: true, inProgress: false },
    week: completeToday(runtime.week),
  });
  completeDailyTask("train");
}

export function markWorkoutDone() {
  if (runtime.session.completed) return;
  finishWorkout();
}
