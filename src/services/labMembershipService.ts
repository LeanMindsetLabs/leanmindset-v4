import { planForDay, STARTER_TOTAL_DAYS } from "@/src/content/starterProgram";
import {
  canStartLab,
  cohortStartMonday,
  displayStoredDate,
  isoDate,
  programDayNumber,
  rollMissedMonday,
} from "@/src/lib/cohortStart";
import { appStorage } from "@/src/lib/storage";
import type { LabLifecycleState, LabMembership, LabPrepChecklist, LabPreparationTask } from "@/src/types";

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

export const EMPTY_PREP_CHECKLIST: LabPrepChecklist = {
  groceryChecked: [],
  supplementChecked: [],
  photos: [],
};

function cloneChecklist(source?: LabPrepChecklist | null): LabPrepChecklist {
  return {
    groceryChecked: [...(source?.groceryChecked ?? [])],
    supplementChecked: [...(source?.supplementChecked ?? [])],
    photos: [...(source?.photos ?? [])],
  };
}

export const EXPLORER_MEMBERSHIP: LabMembership = {
  lifecycle: "explorer",
  labId: null,
  labName: null,
  startDate: null,
  day: null,
  requestedAt: null,
  approvedAt: null,
  welcomeDismissed: false,
  offMondayStartGranted: false,
  programStartedOn: null,
  activeDayKey: null,
  preparationTasks: [],
  prepChecklist: cloneChecklist(),
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

function todayIso() {
  return isoDate();
}

export function getLabMembership(): LabMembership {
  if (!membership.prepChecklist) {
    membership = { ...membership, prepChecklist: cloneChecklist() };
  }
  return membership;
}

export function subscribeLabMembership(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function normalizeMembership(parsed: Partial<LabMembership>): LabMembership {
  return {
    ...EXPLORER_MEMBERSHIP,
    ...parsed,
    offMondayStartGranted: parsed.offMondayStartGranted === true,
    programStartedOn: parsed.programStartedOn ?? null,
    activeDayKey: parsed.activeDayKey ?? null,
    preparationTasks: parsed.preparationTasks ?? [],
    prepChecklist: cloneChecklist(parsed.prepChecklist),
    dailyTasks: parsed.dailyTasks ?? [],
  };
}

export function rehydrateLabMembership() {
  const raw = appStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    membership = normalizeMembership(JSON.parse(raw) as LabMembership);
  } catch {
    membership = { ...EXPLORER_MEMBERSHIP };
  }
  syncLabCalendar();
  notify();
}

export function requestStarterLab() {
  if (membership.lifecycle !== "explorer") return;
  apply({
    ...membership,
    lifecycle: "requested",
    labId: "starter",
    labName: "Starter Lab",
    requestedAt: todayIso(),
    approvedAt: null,
    welcomeDismissed: false,
    startDate: null,
    day: null,
    offMondayStartGranted: false,
    programStartedOn: null,
    activeDayKey: null,
    preparationTasks: cloneTasks(STARTER_PREP_TASKS),
    prepChecklist: cloneChecklist(),
    dailyTasks: [],
    checkIn: null,
    progress: null,
  });
}

export function approveStarterLab() {
  if (membership.lifecycle !== "requested" && membership.lifecycle !== "explorer") return;
  const approvedAt = todayIso();
  apply({
    ...membership,
    lifecycle: "approved_preparing",
    labId: "starter",
    labName: "Starter Lab",
    requestedAt: membership.requestedAt ?? approvedAt,
    approvedAt,
    welcomeDismissed: false,
    startDate: cohortStartMonday(approvedAt),
    day: 0,
    offMondayStartGranted: false,
    programStartedOn: null,
    activeDayKey: null,
    preparationTasks: cloneTasks(STARTER_PREP_TASKS),
    prepChecklist: cloneChecklist(),
    dailyTasks: [],
    progress: { day: 0, totalDays: STARTER_TOTAL_DAYS, percent: 0 },
  });
}

export function grantOffMondayStart() {
  if (membership.lifecycle !== "approved_preparing") return;
  apply({ ...membership, offMondayStartGranted: true });
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

/** Next unfinished step after this one, so Later / Save can walk the full prep flow. */
export function nextPrepTaskId(currentId: string, snapshot = membership): string | null {
  const tasks = snapshot.preparationTasks;
  const index = tasks.findIndex((task) => task.id === currentId);
  const after = (index >= 0 ? tasks.slice(index + 1) : tasks).find((task) => !task.complete);
  return after?.id ?? null;
}

function toggleId(list: string[], id: string) {
  return list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
}

export function togglePrepGroceryItem(id: string) {
  const checklist = cloneChecklist(membership.prepChecklist);
  apply({
    ...membership,
    prepChecklist: {
      ...checklist,
      groceryChecked: toggleId(checklist.groceryChecked, id),
    },
  });
}

export function togglePrepSupplementItem(id: string) {
  const checklist = cloneChecklist(membership.prepChecklist);
  apply({
    ...membership,
    prepChecklist: {
      ...checklist,
      supplementChecked: toggleId(checklist.supplementChecked, id),
    },
  });
}

export function togglePrepPhoto(slot: string) {
  const checklist = cloneChecklist(membership.prepChecklist);
  apply({
    ...membership,
    prepChecklist: {
      ...checklist,
      photos: toggleId(checklist.photos, slot),
    },
  });
}

export function prepTaskStatus(task: LabPreparationTask, checklist = membership.prepChecklist) {
  if (task.complete) return "Done";
  if (task.id === "grocery" && checklist.groceryChecked.length > 0) return "In progress";
  if (task.id === "supplements" && checklist.supplementChecked.length > 0) return "In progress";
  if (task.id === "photos" && checklist.photos.length > 0) return "In progress";
  return "Pending";
}

export function prepIsComplete(snapshot = membership) {
  return snapshot.preparationTasks.length > 0 && snapshot.preparationTasks.every((task) => task.complete);
}

export function canStartStarterLab(snapshot = membership, today = todayIso()) {
  return canStartLab({
    prepComplete: prepIsComplete(snapshot),
    startIso: snapshot.startDate,
    todayIso: today,
    offMondayGranted: snapshot.offMondayStartGranted,
  });
}

export function startStarterLab() {
  if (membership.lifecycle !== "approved_preparing") return;
  syncLabCalendar();
  if (!canStartStarterLab()) return;
  const today = todayIso();
  const plan = planForDay(1);
  apply({
    ...membership,
    lifecycle: "active",
    welcomeDismissed: true,
    day: 1,
    programStartedOn: today,
    activeDayKey: today,
    dailyTasks: cloneTasks(plan.dailyTasks),
    progress: { day: 1, totalDays: STARTER_TOTAL_DAYS, percent: Math.round((1 / STARTER_TOTAL_DAYS) * 100) },
    checkIn: { id: "day-1", date: today, submitted: false },
  });
}

export function completeDailyTask(id: string) {
  if (membership.lifecycle !== "active") return;
  const dailyTasks = membership.dailyTasks.map((task) =>
    task.id === id ? { ...task, complete: true } : task,
  );
  const done = dailyTasks.filter((task) => task.complete).length;
  apply({
    ...membership,
    dailyTasks,
    checkIn:
      id === "checkin" && membership.checkIn
        ? { ...membership.checkIn, submitted: true }
        : membership.checkIn,
    progress: membership.progress
      ? {
          ...membership.progress,
          percent: Math.min(99, Math.round((done / Math.max(dailyTasks.length, 1)) * 100)),
        }
      : membership.progress,
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
    day: STARTER_TOTAL_DAYS,
    progress: { day: STARTER_TOTAL_DAYS, totalDays: STARTER_TOTAL_DAYS, percent: 100 },
    dailyTasks: membership.dailyTasks.map((task) => ({ ...task, complete: true })),
  });
}

export function resetLabMembership() {
  apply({ ...EXPLORER_MEMBERSHIP, preparationTasks: [], prepChecklist: cloneChecklist(), dailyTasks: [] });
}

export function syncLabCalendar(now = new Date()) {
  const today = isoDate(now);
  if (membership.lifecycle === "approved_preparing" && membership.startDate && !membership.offMondayStartGranted) {
    const rolled = rollMissedMonday(membership.startDate, today);
    if (rolled !== membership.startDate) {
      apply({ ...membership, startDate: rolled });
    }
    return;
  }
  if (membership.lifecycle !== "active" || !membership.programStartedOn) return;
  const elapsed = programDayNumber(membership.programStartedOn, today, STARTER_TOTAL_DAYS + 1);
  if (elapsed > STARTER_TOTAL_DAYS) {
    completeStarterLab();
    return;
  }
  if (membership.activeDayKey === today && membership.day === elapsed) return;
  const plan = planForDay(elapsed);
  apply({
    ...membership,
    day: elapsed,
    activeDayKey: today,
    dailyTasks: cloneTasks(plan.dailyTasks),
    progress: {
      day: elapsed,
      totalDays: STARTER_TOTAL_DAYS,
      percent: Math.round((elapsed / STARTER_TOTAL_DAYS) * 100),
    },
    checkIn: { id: `day-${elapsed}`, date: today, submitted: false },
  });
}

export function todaysTrainId(snapshot = membership) {
  const day = snapshot.day ?? 1;
  return planForDay(day).trainId;
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
    offMondayStartGranted: true,
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
      return snapshot.offMondayStartGranted ? "Preparing · off-Monday allowed" : "Preparing";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    default:
      return "Not in a Lab";
  }
}

export function startDateLabel(snapshot = membership) {
  return displayStoredDate(snapshot.startDate);
}
