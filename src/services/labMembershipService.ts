import { appStorage } from "@/src/lib/storage";
import type { LabDailyTask, LabLifecycleState, LabMembership, LabPreparationTask } from "@/src/types";

const STORAGE_KEY = "lab.membership";

export const STARTER_PREP_TASKS: LabPreparationTask[] = [
  { id: "weight", title: "Starting weight", complete: false },
  { id: "measurements", title: "Measurements", complete: false },
  { id: "photos", title: "Before photos", complete: false },
  { id: "grocery", title: "Grocery list", complete: false },
  { id: "supplements", title: "Supplements", complete: false },
  { id: "health", title: "Health check-in", complete: false },
  { id: "guide", title: "Program guide", complete: false },
];

export const STARTER_DAILY_TASKS: LabDailyTask[] = [
  { id: "breakfast", title: "Log breakfast", meta: "Protein-focused", complete: false },
  { id: "lunch", title: "Log lunch", meta: "Balanced plate", complete: false },
  { id: "dinner", title: "Log dinner", meta: "High protein", complete: false },
  { id: "train", title: "Walk + Core A", meta: "25 min · Beginner", complete: false },
  { id: "checkin", title: "Evening check-in", meta: "Weight · reflection", complete: false },
];

export const EXPLORER_MEMBERSHIP: LabMembership = {
  lifecycle: "explorer",
  labId: null,
  labName: null,
  startDate: null,
  day: null,
  requestedAt: null,
  approvedAt: null,
  welcomeDismissed: false,
  preparationTasks: [],
  dailyTasks: [],
  checkIn: null,
  progress: null,
};

let membership: LabMembership = { ...EXPLORER_MEMBERSHIP };
const listeners = new Set<() => void>();

function cloneTasks<T>(tasks: T[]): T[] {
  return tasks.map((task) => ({ ...task }));
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persist() {
  appStorage.setItem(STORAGE_KEY, JSON.stringify(membership));
}

function apply(next: LabMembership) {
  membership = next;
  persist();
  notify();
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function startDateLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return formatDate(date);
}

export function getLabMembership(): LabMembership {
  return membership;
}

export function subscribeLabMembership(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function rehydrateLabMembership() {
  const raw = appStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as LabMembership;
    membership = {
      ...EXPLORER_MEMBERSHIP,
      ...parsed,
      preparationTasks: parsed.preparationTasks ?? [],
      dailyTasks: parsed.dailyTasks ?? [],
    };
  } catch {
    membership = { ...EXPLORER_MEMBERSHIP };
  }
  notify();
}

export function requestStarterLab() {
  if (membership.lifecycle !== "explorer") return;
  apply({
    ...membership,
    lifecycle: "requested",
    labId: "starter",
    labName: "Starter Lab",
    requestedAt: formatDate(),
    approvedAt: null,
    welcomeDismissed: false,
    startDate: null,
    day: null,
    preparationTasks: cloneTasks(STARTER_PREP_TASKS),
    dailyTasks: [],
    checkIn: null,
    progress: null,
  });
}

export function approveStarterLab() {
  if (membership.lifecycle !== "requested" && membership.lifecycle !== "explorer") return;
  apply({
    ...membership,
    lifecycle: "approved_preparing",
    labId: "starter",
    labName: "Starter Lab",
    requestedAt: membership.requestedAt ?? formatDate(),
    approvedAt: formatDate(),
    welcomeDismissed: false,
    startDate: startDateLabel(),
    day: 0,
    preparationTasks: cloneTasks(STARTER_PREP_TASKS),
    dailyTasks: [],
    progress: { day: 0, totalDays: 30, percent: 0 },
  });
}

export function dismissPrepWelcome() {
  apply({ ...membership, welcomeDismissed: true });
}

export function togglePrepTask(id: string) {
  apply({
    ...membership,
    preparationTasks: membership.preparationTasks.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : task,
    ),
  });
}

export function completePrepTask(id: string) {
  apply({
    ...membership,
    welcomeDismissed: true,
    preparationTasks: membership.preparationTasks.map((task) =>
      task.id === id ? { ...task, complete: true } : task,
    ),
  });
}

export function startStarterLab() {
  const done = membership.preparationTasks.every((task) => task.complete);
  if (!done) return;
  apply({
    ...membership,
    lifecycle: "active",
    welcomeDismissed: true,
    day: 1,
    dailyTasks: cloneTasks(STARTER_DAILY_TASKS),
    progress: { day: 1, totalDays: 30, percent: 3 },
    checkIn: { id: "day-1", date: formatDate(), submitted: false },
  });
}

export function toggleDailyTask(id: string) {
  const dailyTasks = membership.dailyTasks.map((task) =>
    task.id === id ? { ...task, complete: !task.complete } : task,
  );
  const done = dailyTasks.filter((task) => task.complete).length;
  apply({
    ...membership,
    dailyTasks,
    progress: membership.progress
      ? { ...membership.progress, percent: Math.min(99, Math.round((done / Math.max(dailyTasks.length, 1)) * 100)) }
      : membership.progress,
  });
}

export function completeStarterLab() {
  apply({
    ...membership,
    lifecycle: "completed",
    day: 30,
    progress: { day: 30, totalDays: 30, percent: 100 },
    dailyTasks: membership.dailyTasks.map((task) => ({ ...task, complete: true })),
  });
}

export function resetLabMembership() {
  apply({ ...EXPLORER_MEMBERSHIP, preparationTasks: [], dailyTasks: [] });
}

export function demoSetLifecycle(lifecycle: LabLifecycleState) {
  resetLabMembership();
  if (lifecycle === "explorer") return;
  requestStarterLab();
  if (lifecycle === "requested") return;
  approveStarterLab();
  if (lifecycle === "approved_preparing") return;
  apply({
    ...getLabMembership(),
    welcomeDismissed: true,
    preparationTasks: STARTER_PREP_TASKS.map((task) => ({ ...task, complete: true })),
  });
  startStarterLab();
  if (lifecycle === "active") return;
  completeStarterLab();
}

/** Full V3 log/plan/bowls from approval onward. Explorer and requested stay ideas-only. */
export function canLogMeals(lifecycle: LabLifecycleState) {
  return lifecycle === "approved_preparing" || lifecycle === "active" || lifecycle === "completed";
}

export function canCheckIn(lifecycle: LabLifecycleState) {
  return lifecycle === "active";
}

export function hasCuratedProgram(lifecycle: LabLifecycleState) {
  return lifecycle === "approved_preparing" || lifecycle === "active";
}

export function labStatusLabel(snapshot: LabMembership) {
  switch (snapshot.lifecycle) {
    case "requested":
      return "Pending approval";
    case "approved_preparing":
      return "Preparing";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    default:
      return "Not in a Lab";
  }
}
