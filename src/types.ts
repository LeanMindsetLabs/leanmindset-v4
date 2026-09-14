export const tabs = ["home", "today", "meals", "coach", "train", "profile"] as const;

export type TabId = (typeof tabs)[number];

export const labLifecycleStates = [
  "explorer",
  "requested",
  "approved_preparing",
  "active",
  "completed",
] as const;

export type LabLifecycleState = (typeof labLifecycleStates)[number];

export type LabPreparationTask = {
  id: string;
  title: string;
  complete: boolean;
};

/** Shopping / photo progress that stays editable after a step is opened again. */
export type LabPrepChecklist = {
  groceryChecked: string[];
  supplementChecked: string[];
  photos: string[];
};

export type LabDailyTask = {
  id: string;
  title: string;
  meta?: string;
  complete: boolean;
};

export type LabCheckIn = {
  id: string;
  date: string;
  submitted: boolean;
};

export type LabProgress = {
  day: number;
  totalDays: number;
  percent: number;
};

/** Membership snapshot for Lab lifecycle. Explorer has no Lab until a coach/admin approves a join request. */
export type LabMembership = {
  lifecycle: LabLifecycleState;
  labId: string | null;
  labName: string | null;
  /** Cohort Day 1, ISO YYYY-MM-DD. Always a Monday unless admin grants otherwise. */
  startDate: string | null;
  day: number | null;
  requestedAt: string | null;
  approvedAt: string | null;
  welcomeDismissed: boolean;
  /** Admin special permission to start Day 1 on a non-Monday. */
  offMondayStartGranted: boolean;
  /** ISO date the member actually tapped Start. */
  programStartedOn: string | null;
  /** Last calendar date daily tasks were built for. */
  activeDayKey: string | null;
  preparationTasks: LabPreparationTask[];
  prepChecklist: LabPrepChecklist;
  dailyTasks: LabDailyTask[];
  checkIn: LabCheckIn | null;
  progress: LabProgress | null;
};
