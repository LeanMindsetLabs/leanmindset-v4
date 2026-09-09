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
  startDate: string | null;
  day: number | null;
  requestedAt: string | null;
  approvedAt: string | null;
  welcomeDismissed: boolean;
  preparationTasks: LabPreparationTask[];
  dailyTasks: LabDailyTask[];
  checkIn: LabCheckIn | null;
  progress: LabProgress | null;
};
