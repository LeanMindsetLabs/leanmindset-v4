import type { LabPhotoKey } from "@/src/lib/media";

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
  includedTitle: "Build your lean foundation",
  included: [
    "Daily nutrition plan",
    "Grocery & food lists",
    "Daily check-ins • Coach support",
    "Progress tracking",
  ],
  howTitle: "How it works",
  steps: [
    { number: "01", title: "Prepare", body: "Get ready in 2 days" },
    { number: "02", title: "Follow", body: "Your daily plan" },
    { number: "03", title: "Check in", body: "Track and improve" },
  ],
  joinCta: "Join Starter Lab",
} as const;

export const joinLabConfirm = {
  eyebrow: "Starter Lab",
  title: "Request to join?",
  cardTitle: "What happens next",
  steps: ["Send your request", "Coach reviews and approves", "Complete a 2-day preparation"],
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

export const approvedWelcome = {
  eyebrow: "Starter Lab approved",
  title: "You’re in!",
  startLabel: "Your Lab starts",
  prepLabel: "2 days to prepare",
  body: "Let’s get you ready for success. Complete preparation, then your 30-day Lab begins.",
  cta: "Start preparing →",
} as const;

export const prepHub = {
  eyebrow: "Starts in 2 days",
  title: "My Lab",
  cardTitle: "Preparation",
  continueCta: "Continue preparation",
  startCta: "Start Starter Lab",
  completeTitle: "Preparation complete",
  completeBody: "You’re ready. Start Starter Lab when you want to begin Day 1.",
} as const;

export const prepTasks = {
  weight: {
    title: "Starting weight",
    body: "Log a baseline weight so we can track change across the 30 days.",
    cta: "Mark weight saved",
  },
  measurements: {
    title: "Measurements",
    body: "Waist, chest, and hips — optional, but useful for progress photos.",
    cta: "Mark measurements saved",
  },
  photos: {
    title: "Before photos",
    body: "Front, side, and back. Keep these private to you and your coach.",
    cta: "Mark photos saved",
  },
  grocery: {
    title: "Grocery list",
    body: "Protein, produce, and pantry staples for the first week.",
    cta: "Mark grocery list ready",
  },
  supplements: {
    title: "Supplements",
    body: "Optional. Confirm what you’ll take, or skip if you don’t use any.",
    cta: "Mark supplements reviewed",
  },
  health: {
    title: "Health check-in",
    body: "Confirm you feel ready to start. Talk to a clinician if you have concerns.",
    cta: "Mark health check done",
  },
  guide: {
    title: "Program guide",
    body: "Prepare 2 days → Follow your daily plan → Check in to stay on track.",
    cta: "Mark guide read",
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
