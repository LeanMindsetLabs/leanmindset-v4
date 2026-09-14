/** Local calendar YYYY-MM-DD. Avoid UTC so evening in US is not the next day. */
export function isoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function fromIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const date = fromIso(iso);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

export function weekday(iso: string): number {
  return fromIso(iso).getDay();
}

export function isMonday(iso: string): boolean {
  return weekday(iso) === 1;
}

/** Next Monday strictly after `iso`. If `iso` is Monday, returns +7 days. */
export function nextMondayAfter(iso: string): string {
  const day = weekday(iso);
  const delta = day === 1 ? 7 : (8 - day) % 7;
  return addDays(iso, delta);
}

/**
 * Day 1 is always a Monday, with at least two full calendar days of prep.
 * Weekend approval (Sat/Sun) skips the nearest Monday.
 * Weekday approval uses the upcoming Monday (Monday itself → next week).
 */
export function cohortStartMonday(approvedIso: string): string {
  const day = weekday(approvedIso);
  if (day === 0 || day === 6) {
    return nextMondayAfter(nextMondayAfter(approvedIso));
  }
  return nextMondayAfter(approvedIso);
}

export function formatCohortDate(iso: string): string {
  return fromIso(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function displayStoredDate(value: string | null): string {
  if (!value) return "";
  if (isIsoDate(value)) return formatCohortDate(value);
  return value;
}

export function compareIso(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function daysBetween(startIso: string, endIso: string): number {
  const ms = fromIso(endIso).getTime() - fromIso(startIso).getTime();
  return Math.round(ms / 86_400_000);
}

/** If the cohort Monday passed without a start, move Day 1 to the next Monday. */
export function rollMissedMonday(startIso: string, todayIso: string): string {
  if (compareIso(todayIso, startIso) <= 0) return startIso;
  if (isMonday(todayIso)) return todayIso;
  return nextMondayAfter(todayIso);
}

export function programDayNumber(startedOn: string, todayIso: string, total = 30): number {
  const day = daysBetween(startedOn, todayIso) + 1;
  return Math.min(total, Math.max(1, day));
}

export function canStartLab(options: {
  prepComplete: boolean;
  startIso: string | null;
  todayIso: string;
  offMondayGranted: boolean;
}): boolean {
  if (!options.prepComplete || !options.startIso) return false;
  if (options.offMondayGranted) return true;
  return options.todayIso === options.startIso && isMonday(options.startIso);
}

export function startOfLocalDay(iso: string): Date {
  const date = fromIso(iso);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Live copy for Get Ready: “Your cohort is starting in 23 hours”. */
export function formatCohortCountdown(startIso: string | null, now = new Date()): string {
  if (!startIso) return "Your cohort start date is being set.";
  const ms = startOfLocalDay(startIso).getTime() - now.getTime();
  if (ms <= 0) return "Your cohort starts today.";
  const minutes = Math.max(1, Math.floor(ms / 60_000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 2) return `Your cohort is starting in ${days} days.`;
  if (hours >= 1) {
    return `Your cohort is starting in ${hours} ${hours === 1 ? "hour" : "hours"}.`;
  }
  return `Your cohort is starting in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}
