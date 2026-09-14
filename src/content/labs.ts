import { router } from "expo-router";
import type { LabPhotoKey } from "@/src/lib/media";
import type { LabLifecycleState } from "@/src/types";

export type LabOffer = {
  id: string;
  name: string;
  badge: string;
  meta: string;
  description?: string;
  pitch?: string;
  available: boolean;
  startHere?: boolean;
  photo: LabPhotoKey;
};

/** Starter Lab is the only joinable offer. Paid labs stay priced and Coming Soon. */
export function canJoinLab(offer: LabOffer) {
  return offer.id === "starter" && offer.available;
}

export function findLab(id: string): LabOffer | undefined {
  if (id === starterLab.id) return starterLab;
  return comingSoonLabs.find((lab) => lab.id === id);
}

export function labHref(id: string) {
  return `/labs/${id}` as const;
}

/** Explicit dynamic route so Home (outside the labs stack) opens the lab, not the catalog. */
export function labRoute(id: string) {
  return { pathname: "/labs/[labId]" as const, params: { labId: id } };
}

export function openLab(id: string) {
  router.push(labRoute(id), { withAnchor: true });
}

export function openMyLab(lifecycle: LabLifecycleState) {
  if (lifecycle === "requested") {
    router.push("/labs/submitted");
    return;
  }
  if (lifecycle === "approved_preparing") {
    router.push("/labs/prep");
    return;
  }
  if (lifecycle === "active") {
    router.push("/labs/progress");
    return;
  }
  if (lifecycle === "completed") {
    router.push("/labs/results");
    return;
  }
  router.push("/labs");
}

/** Meals, train, and evening check-in from Today’s plan — never listed on Home. */
export function openDailyTask(id: string) {
  if (id === "train") {
    router.push("/(tabs)/train");
    return;
  }
  if (id === "checkin") {
    router.push("/(tabs)/checkin");
    return;
  }
  router.push("/(tabs)/meals");
}

/** Requested through completed — already in Starter Lab, so never “Start here”. */
export function isInStarterLab(lifecycle: LabLifecycleState) {
  return lifecycle !== "explorer";
}

export function starterLabBadge(lifecycle: LabLifecycleState): { label: string; accent: boolean } {
  switch (lifecycle) {
    case "requested":
      return { label: "Pending", accent: false };
    case "approved_preparing":
      return { label: "Preparing", accent: false };
    case "active":
      return { label: "Active", accent: false };
    case "completed":
      return { label: "Completed", accent: false };
    default:
      return { label: "Start here", accent: true };
  }
}

export function starterLabCta(lifecycle: LabLifecycleState) {
  switch (lifecycle) {
    case "requested":
      return "View request status";
    case "approved_preparing":
    case "active":
      return "Open My Lab";
    case "completed":
      return "View my results";
    default:
      return starterLabDetail.joinCta;
  }
}

export const starterLab: LabOffer = {
  id: "starter",
  name: "Starter Lab",
  badge: "Available",
  meta: "30 Days • Free",
  pitch: "Your first 30 days of structured meals, training, and daily check-ins.",
  available: true,
  startHere: true,
  photo: "starter",
};

/** Priced for display only — not joinable, not active, no checkout. */
export const comingSoonLabs: LabOffer[] = [
  {
    id: "lean-reset",
    name: "Lean Reset",
    badge: "Coming Soon",
    meta: "4 Weeks • $250",
    description: "A focused reset for stronger routines.",
    pitch: "A focused reset for stronger routines.",
    available: false,
    photo: "lean-reset",
  },
  {
    id: "transformation",
    name: "Transformation",
    badge: "Coming Soon",
    meta: "8 Weeks • $440",
    description: "Deeper coaching and transformation.",
    pitch: "Deeper coaching and transformation.",
    available: false,
    photo: "transformation",
  },
];

export const comingSoonDetail = {
  body: "Coming soon",
} as const;

export const comingSoonLabDetails: Record<
  string,
  {
    statement: string;
    highlights: { icon: "calendar-outline" | "target" | "trending-up-outline"; title: string; detail: string }[];
  }
> = {
  "lean-reset": {
    statement: "A focused reset for stronger routines.",
    highlights: [
      { icon: "calendar-outline", title: "4 Weeks", detail: "Focused reset" },
      { icon: "target", title: "Build Habits", detail: "That last" },
      { icon: "trending-up-outline", title: "Guided", detail: "Coaching" },
    ],
  },
  transformation: {
    statement: "Deeper coaching and transformation.",
    highlights: [
      { icon: "calendar-outline", title: "8 Weeks", detail: "Full program" },
      { icon: "target", title: "Build Habits", detail: "That last" },
      { icon: "trending-up-outline", title: "Advanced", detail: "Coaching" },
    ],
  },
};

export const labCatalog = {
  eyebrow: "Choose your path",
  title: "Lean Labs",
  starterCta: "View Starter Lab",
  starter: starterLab,
  comingSoon: comingSoonLabs,
} as const;

export const starterLabDetail = {
  eyebrow: "30 Days • Free",
  title: "Starter Lab",
  badge: "Start here",
  statement: "Build the foundation. Create momentum. Change your life.",
  highlights: [
    { icon: "calendar-outline" as const, title: "30 Days", detail: "Structured plan" },
    { icon: "target" as const, title: "Build Habits", detail: "That last" },
    { icon: "trending-up-outline" as const, title: "Beginner", detail: "Friendly" },
  ],
  includedTitle: "Build your lean foundation",
  included: [
    "Daily nutrition plan",
    "Grocery & food lists",
    "Daily check-ins • Coach support",
    "Progress tracking",
  ],
  howTitle: "How it works",
  steps: [
    { number: "01", title: "Prepare", body: "Get ready before Monday" },
    { number: "02", title: "Follow", body: "Your daily plan" },
    { number: "03", title: "Check in", body: "Track and improve" },
  ],
  joinCta: "Join Starter Lab",
} as const;

export const joinLabConfirm = {
  eyebrow: "Starter Lab",
  title: "Request to join?",
  cardTitle: "What happens next",
  steps: ["Send your request", "Coach reviews and approves", "Prep starts after approve · Day 1 is a Monday"],
  note: "No payment is required for Starter Lab.",
  submitCta: "Submit request",
} as const;

export const requestSubmitted = {
  eyebrow: "Pending approval",
  title: "Request submitted",
  body: "We’ll review your request. You can keep using LeanMindset while your coach reviews it. We’ll notify you when a decision is ready.",
  statusLabel: "Status",
  statusValue: "Pending",
  backHomeCta: "Back to Home",
} as const;

export const pendingHome = {
  eyebrow: "Request pending",
  title: "Starter Lab",
  body: "Your request is with your coach. You will be notified after review.",
  statusCta: "View request status",
  keepGoing: "Keep going",
  keepGoingBody: "General workouts · Meal ideas · Coach chat",
} as const;

/** Status copy for the Home insight card (the purple box). One state per Explore / Wait / Prep / Active / Done. */
export const homeLabStatus = {
  explorer: {
    subgreeting: "Let’s make it a great day.",
    title: "Exploring",
    body: "You’re not in a Lab yet. Starter Lab is the free 30-day path — meals, training, and daily check-ins.",
    cta: "View Labs",
  },
  pending: {
    subgreeting: "Your Starter Lab request is with your coach.",
    title: "Waiting",
    body: "Request pending. Keep browsing meals, training, and labs. This card updates when you’re approved.",
    cta: "View status",
    badge: "Pending",
    pitch: "Your coach is reviewing this request.",
    heroKicker: "Pending",
    heroTitle: "Starter Lab",
    heroMeta: "Your coach is reviewing this request.",
    heroCta: "View request status",
  },
  approved: {
    subgreeting: "Congrats — you’re approved.",
    title: "Preparing",
    body: "Open My Lab anytime to check items off. Photos and shopping can wait.",
    cta: "Start preparing",
    continueCta: "Continue preparation",
    readyTitle: "Preparing",
    readyBody: "Prep is done. Day 1 is Monday only unless your coach allows another day.",
    heroKicker: "Get ready",
    heroTitle: "Starter Lab",
    heroCta: "Proceed to preparation",
  },
  active: {
    subgreeting: "You’re in Starter Lab.",
    title: "Active",
    body: "Follow today’s meals, training, and evening check-in.",
    cta: "Today’s plan",
    progressCta: "View progress",
  },
  completed: {
    subgreeting: "You crushed it — Starter Lab complete.",
    title: "Completed",
    body: "26 consistent days · 87% adherence. Your history stays in My Lab.",
    cta: "View my results",
    heroKicker: "You did it",
    heroTitle: "Starter Lab",
    heroMeta: "30 of 30 days complete",
  },
} as const;

export const approvedWelcome = {
  eyebrow: "Starter Lab approved",
  title: "You’re in!",
  startLabel: "Day 1 starts",
  prepLabel: "Prep starts now",
  body: "Complete preparation now. Program Day 1 is always a Monday, with at least two days to get ready.",
  cta: "Start preparing →",
} as const;

export const prepHub = {
  eyebrow: "Preparation",
  title: "My Lab",
  cardTitle: "Preparation",
  continueCta: "Continue preparation",
  startCta: "Start Starter Lab",
  completeTitle: "Preparation complete",
  completeBody: "You’re ready. Day 1 starts Monday. A mid-week start needs permission from your coach.",
  lockedCtaPrefix: "Starts",
  missedBody: "The last Monday passed. Day 1 is now the next Monday.",
  grantedBody: "Your coach allowed you to start on a day other than Monday.",
} as const;

export const prepTasks = {
  weight: {
    title: "Starting weight",
    body: "Log a baseline weight so we can track change across the 30 days. Pounds is the default — switch to kg if you prefer.",
    cta: "Save starting weight",
    laterCta: "I’ll add this later",
  },
  measurements: {
    title: "Measurements",
    body: "Waist, chest, and hips in inches by default — switch to cm if you prefer. Optional, and you can come back anytime.",
    cta: "Save measurements",
    laterCta: "I’ll add this later",
  },
  photos: {
    title: "Before photos",
    body: "Front, side, and back. Keep these private to you and your coach. You can add them later from My Lab or Profile.",
    cta: "Continue",
    laterCta: "I’ll add photos later",
  },
  grocery: {
    title: "Grocery list",
    body: "Shop these staples when you can. Check items off as you pick them up — no weights, just the list.",
    cta: "Mark list ready",
    laterCta: "I’ll shop later",
  },
  supplements: {
    title: "Supplements",
    body: "Optional unless your coach or clinician has specifically advised otherwise.",
    cta: "Confirm reviewed",
    laterCta: "I’ll review later",
  },
  health: {
    title: "Health check-in",
    body: "Confirm you feel ready to start. Talk to a clinician if you have concerns.",
    cta: "I’m ready to start",
    laterCta: "I’ll do this later",
  },
  guide: {
    title: "Program guide",
    body: "Prepare before Monday → Follow your daily plan → Check in to stay on track. Day 1 is always a Monday unless your coach allows another day.",
    cta: "I’ve read the guide",
    laterCta: "I’ll read this later",
  },
} as const;

export const activeHome = {
  eyebrowPrefix: "Day",
  todayTitle: "Today’s plan",
  continueCta: "Continue my day →",
  progressCta: "View progress",
} as const;

export const completedHome = {
  eyebrow: "30 of 30 days",
  title: "Starter Lab complete",
  resultsTitle: "You completed the Lab",
  resultsMeta: "26 consistent days · 87% adherence",
  resultsWeight: "Weight change −3.2 kg",
  resultsCta: "View my results",
  nextTitle: "Keep your momentum",
  nextBody: "Continue general workouts and meal ideas. Your Lab history remains in My Lab.",
} as const;

export const labResults = {
  eyebrow: "Starter Lab",
  title: "Your results",
  rows: [
    { label: "Consistent days", value: "26 / 30" },
    { label: "Adherence", value: "87%" },
    { label: "Weight change", value: "−3.2 kg" },
  ],
  body: "You built the habit. Keep protein high and stay consistent with movement.",
  homeCta: "Back to Home",
} as const;

export const mealIdeas = {
  eyebrow: "Explorer state",
  title: "Meal Ideas",
  items: [
    { id: "breakfast", title: "Simple breakfast", meta: "Greek yogurt · berries · oats" },
    { id: "lunch", title: "Balanced lunch", meta: "Chicken · greens · brown rice" },
    { id: "dinner", title: "Quick dinner", meta: "Salmon · vegetables · potatoes" },
  ],
  ctaTitle: "Want a plan built for you?",
  ctaBody: "Lean Labs unlock structured daily meals, grocery lists, and check-ins.",
  cta: "Explore Labs →",
} as const;

export const explorerTrain = {
  eyebrow: "Explorer state",
  title: "Train",
  body: "Browse general workouts. A curated daily session unlocks after you’re approved.",
  ctaTitle: "Want a plan built for you?",
  ctaBody: "Lean Labs unlock a daily session, adherence tracking, and coach check-ins.",
  cta: "Explore Labs →",
} as const;

export const myLabProfile = {
  title: "My Lab",
  exploreCta: "Explore Labs",
  openCta: "Open My Lab",
} as const;
