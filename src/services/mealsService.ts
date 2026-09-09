import type { MealLogId } from "./mealsLogService";

export type Macro = {
  label: "Protein" | "Fat" | "Carbs";
  consumed: number;
  target: number;
  color: string;
};

export type Nutrition = {
  kcalLogged: number;
  kcalTarget: number;
  protein: Macro;
  fat: Macro;
  carbs: Macro;
};

export type MealRecommendation = {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  image: string;
  tags: string[];
  ingredients: string[];
};

export type GroceryItem = {
  id: string;
  name: string;
  aisle: string;
  quantity: string;
  checked: boolean;
};

export const groceryPreviewNames = [
  "Chicken",
  "Yogurt",
  "Spinach",
  "Oats",
  "Berries",
];

export const groceryItems: GroceryItem[] = [
  { id: "chicken", name: "Chicken breast", aisle: "Protein", quantity: "1.5 lb", checked: false },
  { id: "yogurt", name: "Greek yogurt", aisle: "Dairy", quantity: "32 oz", checked: false },
  { id: "tofu", name: "Firm tofu", aisle: "Protein", quantity: "14 oz", checked: false },
  { id: "spinach", name: "Spinach", aisle: "Produce", quantity: "1 bag", checked: false },
  { id: "broccoli", name: "Broccoli", aisle: "Produce", quantity: "2 heads", checked: false },
  { id: "peppers", name: "Bell peppers", aisle: "Produce", quantity: "3", checked: false },
  { id: "berries", name: "Mixed berries", aisle: "Produce", quantity: "1 pint", checked: false },
  { id: "oats", name: "Rolled oats", aisle: "Pantry", quantity: "18 oz", checked: false },
  { id: "rice", name: "Rice", aisle: "Pantry", quantity: "1 bag", checked: false },
  { id: "oil", name: "Olive oil", aisle: "Pantry", quantity: "1 bottle", checked: false },
];

export const defaultNutrition: Nutrition = {
  kcalLogged: 1600,
  kcalTarget: 2200,
  protein: { label: "Protein", consumed: 79, target: 140, color: "#19E68C" },
  fat: { label: "Fat", consumed: 31, target: 65, color: "#F5B83D" },
  carbs: { label: "Carbs", consumed: 125, target: 180, color: "#5B9DFF" },
};

export const dinnerIdeas: MealRecommendation[] = [
  {
    id: "chicken-veg",
    name: "Chicken + vegetables",
    kcal: 520,
    protein: 42,
    image: "/meals/chicken-vegetables.png",
    tags: ["Dinner", "High protein"],
    ingredients: ["Chicken breast", "Broccoli", "Mixed vegetables", "Olive oil"],
  },
  {
    id: "yogurt-berries",
    name: "Greek yogurt + berries",
    kcal: 310,
    protein: 28,
    image: "/meals/greek-yogurt-berries.png",
    tags: ["Snack", "High protein"],
    ingredients: ["Greek yogurt", "Blueberries", "Strawberries", "Granola"],
  },
  {
    id: "tofu-stir-fry",
    name: "Tofu stir-fry",
    kcal: 480,
    protein: 24,
    image: "/meals/tofu-stir-fry.png",
    tags: ["Dinner", "Plant"],
    ingredients: ["Tofu", "Broccoli", "Bell peppers", "Rice"],
  },
];

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

const breakfastIdeas: MealRecommendation[] = [
  {
    id: "oatmeal-berries",
    name: "Oatmeal + berries",
    kcal: 340,
    protein: 14,
    image: "/meals/greek-yogurt-berries.png",
    tags: ["Breakfast", "Fiber"],
    ingredients: ["Rolled oats", "Mixed berries", "Honey", "Almond milk"],
  },
  {
    id: "egg-scramble",
    name: "Egg white scramble",
    kcal: 280,
    protein: 32,
    image: "/meals/chicken-vegetables.png",
    tags: ["Breakfast", "High protein"],
    ingredients: ["Egg whites", "Spinach", "Bell peppers", "Olive oil"],
  },
  {
    id: "yogurt-parfait",
    name: "Greek yogurt parfait",
    kcal: 290,
    protein: 24,
    image: "/meals/greek-yogurt-berries.png",
    tags: ["Breakfast", "Quick"],
    ingredients: ["Greek yogurt", "Granola", "Berries", "Chia seeds"],
  },
];

const lunchIdeas: MealRecommendation[] = [
  {
    id: "chicken-rice-bowl",
    name: "Chicken rice bowl",
    kcal: 490,
    protein: 38,
    image: "/meals/chicken-vegetables.png",
    tags: ["Lunch", "High protein"],
    ingredients: ["Chicken breast", "Brown rice", "Broccoli", "Olive oil"],
  },
  {
    id: "tofu-bowl",
    name: "Tofu power bowl",
    kcal: 450,
    protein: 26,
    image: "/meals/tofu-stir-fry.png",
    tags: ["Lunch", "Plant"],
    ingredients: ["Tofu", "Quinoa", "Mixed vegetables", "Tahini"],
  },
  {
    id: "turkey-salad",
    name: "Turkey salad plate",
    kcal: 380,
    protein: 34,
    image: "/meals/chicken-vegetables.png",
    tags: ["Lunch", "Lean"],
    ingredients: ["Turkey breast", "Greens", "Tomatoes", "Olive oil"],
  },
];

const snackIdeas: MealRecommendation[] = [
  {
    id: "yogurt-berries",
    name: "Greek yogurt + berries",
    kcal: 310,
    protein: 28,
    image: "/meals/greek-yogurt-berries.png",
    tags: ["Snack", "High protein"],
    ingredients: ["Greek yogurt", "Blueberries", "Strawberries", "Granola"],
  },
  {
    id: "apple-almonds",
    name: "Apple + almonds",
    kcal: 220,
    protein: 6,
    image: "/meals/greek-yogurt-berries.png",
    tags: ["Snack", "Quick"],
    ingredients: ["Apple", "Almonds", "Cinnamon"],
  },
  {
    id: "protein-shake",
    name: "Protein shake",
    kcal: 180,
    protein: 24,
    image: "/meals/tofu-stir-fry.png",
    tags: ["Snack", "High protein"],
    ingredients: ["Protein powder", "Almond milk", "Banana"],
  },
];

export const mealIdeasBySlot: Record<MealSlot, MealRecommendation[]> = {
  breakfast: breakfastIdeas,
  lunch: lunchIdeas,
  snack: snackIdeas,
  dinner: dinnerIdeas,
};

export function mealSlotLabel(slot: MealSlot) {
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

export function mealSlotFromLogId(id: string): MealSlot {
  if (id === "breakfast") return "breakfast";
  if (id === "lunch") return "lunch";
  if (id === "dinner") return "dinner";
  return "snack";
}

export function mealSlotByTime(date = new Date()): MealSlot {
  const hour = date.getHours();
  if (hour < 10) return "breakfast";
  if (hour < 12) return "snack";
  if (hour < 15) return "lunch";
  if (hour < 17) return "snack";
  if (hour < 21) return "dinner";
  return "snack";
}

export function defaultMealLogIdByTime(date = new Date()): MealLogId {
  const slot = mealSlotByTime(date);
  if (slot === "breakfast") return "breakfast";
  if (slot === "lunch") return "lunch";
  if (slot === "dinner") return "dinner";
  return date.getHours() < 17 ? "snack1" : "snack2";
}

export function getMealIdeasForSlot(slot: MealSlot) {
  return mealIdeasBySlot[slot];
}

export type ExplorerMealCard = {
  key: string;
  slot: MealSlot;
  meal: MealRecommendation;
};

export function getExplorerMealCatalog(): ExplorerMealCard[] {
  return (Object.keys(mealIdeasBySlot) as MealSlot[]).flatMap((slot) =>
    mealIdeasBySlot[slot].map((meal) => ({
      key: `${slot}-${meal.id}`,
      slot,
      meal,
    })),
  );
}

const extraHealthyRecipes: ExplorerMealCard[] = [
  {
    key: "breakfast-overnight-oats",
    slot: "breakfast",
    meal: {
      id: "overnight-oats",
      name: "Overnight oats",
      kcal: 340,
      protein: 16,
      image: "/meals/greek-yogurt-berries.png",
      tags: ["Breakfast", "Fiber", "Quick"],
      ingredients: ["Rolled oats", "Greek yogurt", "Berries", "Chia seeds"],
    },
  },
  {
    key: "breakfast-cottage-pineapple",
    slot: "breakfast",
    meal: {
      id: "cottage-pineapple",
      name: "Cottage cheese + pineapple",
      kcal: 250,
      protein: 28,
      image: "/meals/greek-yogurt-berries.png",
      tags: ["Breakfast", "High protein", "Quick"],
      ingredients: ["Cottage cheese", "Pineapple", "Cinnamon"],
    },
  },
  {
    key: "breakfast-avocado-egg-toast",
    slot: "breakfast",
    meal: {
      id: "avocado-egg-toast",
      name: "Avocado egg toast",
      kcal: 380,
      protein: 18,
      image: "/meals/chicken-vegetables.png",
      tags: ["Breakfast"],
      ingredients: ["Whole-grain toast", "Avocado", "Egg", "Chili flakes"],
    },
  },
  {
    key: "breakfast-banana-protein-oats",
    slot: "breakfast",
    meal: {
      id: "banana-protein-oats",
      name: "Banana protein oats",
      kcal: 360,
      protein: 24,
      image: "/meals/greek-yogurt-berries.png",
      tags: ["Breakfast", "High protein"],
      ingredients: ["Rolled oats", "Banana", "Protein powder", "Almond milk"],
    },
  },
  {
    key: "lunch-grilled-chicken-salad",
    slot: "lunch",
    meal: {
      id: "grilled-chicken-salad",
      name: "Grilled chicken salad",
      kcal: 420,
      protein: 38,
      image: "/meals/chicken-vegetables.png",
      tags: ["Lunch", "High protein", "Lean"],
      ingredients: ["Chicken breast", "Greens", "Cucumber", "Olive oil"],
    },
  },
  {
    key: "lunch-chickpea-quinoa",
    slot: "lunch",
    meal: {
      id: "chickpea-quinoa",
      name: "Chickpea quinoa bowl",
      kcal: 460,
      protein: 22,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Lunch", "Plant", "Fiber"],
      ingredients: ["Chickpeas", "Quinoa", "Cucumber", "Lemon"],
    },
  },
  {
    key: "lunch-turkey-wrap",
    slot: "lunch",
    meal: {
      id: "turkey-wrap",
      name: "Turkey wrap",
      kcal: 430,
      protein: 32,
      image: "/meals/chicken-vegetables.png",
      tags: ["Lunch", "High protein", "Quick"],
      ingredients: ["Turkey breast", "Whole-grain wrap", "Greens", "Mustard"],
    },
  },
  {
    key: "lunch-lentil-soup",
    slot: "lunch",
    meal: {
      id: "lentil-soup",
      name: "Lentil vegetable soup",
      kcal: 360,
      protein: 20,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Lunch", "Plant", "Fiber"],
      ingredients: ["Lentils", "Carrots", "Celery", "Tomato"],
    },
  },
  {
    key: "dinner-salmon-veg",
    slot: "dinner",
    meal: {
      id: "salmon-veg",
      name: "Salmon + vegetables",
      kcal: 540,
      protein: 40,
      image: "/meals/chicken-vegetables.png",
      tags: ["Dinner", "High protein"],
      ingredients: ["Salmon", "Asparagus", "Lemon", "Olive oil"],
    },
  },
  {
    key: "dinner-shrimp-stir-fry",
    slot: "dinner",
    meal: {
      id: "shrimp-stir-fry",
      name: "Shrimp veggie stir-fry",
      kcal: 410,
      protein: 32,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Dinner", "High protein", "Quick"],
      ingredients: ["Shrimp", "Broccoli", "Bell peppers", "Garlic"],
    },
  },
  {
    key: "dinner-white-fish-greens",
    slot: "dinner",
    meal: {
      id: "white-fish-greens",
      name: "White fish + greens",
      kcal: 390,
      protein: 36,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Dinner", "Lean", "High protein"],
      ingredients: ["White fish", "Spinach", "Zucchini", "Lemon"],
    },
  },
  {
    key: "dinner-lean-beef-broccoli",
    slot: "dinner",
    meal: {
      id: "lean-beef-broccoli",
      name: "Lean beef + broccoli",
      kcal: 510,
      protein: 38,
      image: "/meals/chicken-vegetables.png",
      tags: ["Dinner", "High protein"],
      ingredients: ["Lean beef", "Broccoli", "Garlic", "Brown rice"],
    },
  },
  {
    key: "snack-cottage-bowl",
    slot: "snack",
    meal: {
      id: "cottage-bowl",
      name: "Cottage cheese bowl",
      kcal: 200,
      protein: 22,
      image: "/meals/greek-yogurt-berries.png",
      tags: ["Snack", "High protein", "Quick"],
      ingredients: ["Cottage cheese", "Berries", "Cinnamon"],
    },
  },
  {
    key: "snack-hummus-veg",
    slot: "snack",
    meal: {
      id: "hummus-veg",
      name: "Hummus + veggies",
      kcal: 180,
      protein: 7,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Snack", "Plant", "Quick"],
      ingredients: ["Hummus", "Carrots", "Cucumber", "Bell peppers"],
    },
  },
  {
    key: "snack-protein-smoothie",
    slot: "snack",
    meal: {
      id: "protein-smoothie",
      name: "Protein smoothie",
      kcal: 240,
      protein: 26,
      image: "/meals/tofu-stir-fry.png",
      tags: ["Snack", "High protein", "Quick"],
      ingredients: ["Protein powder", "Spinach", "Banana", "Almond milk"],
    },
  },
];

const SEARCH_STOP = new Set([
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
  "healthier",
  "meal",
  "meals",
  "recipe",
  "recipes",
  "food",
  "foods",
  "idea",
  "ideas",
  "eat",
  "eating",
  "give",
  "get",
  "suggest",
  "suggestion",
  "suggestions",
  "can",
  "you",
  "what",
  "whats",
  "good",
  "best",
  "ai",
  "ask",
]);

type HealthySearchIntent = {
  tokens: string[];
  slots: MealSlot[];
  plant: boolean;
  highProtein: boolean;
  quick: boolean;
  lean: boolean;
  fiber: boolean;
  maxKcal: number | null;
};

function parseHealthySearch(query: string): HealthySearchIntent {
  const lower = query.toLowerCase();
  const slots: MealSlot[] = [];
  if (/\bbreakfast|morning\b/.test(lower)) slots.push("breakfast");
  if (/\blunch|midday\b/.test(lower)) slots.push("lunch");
  if (/\bdinner|supper|evening\b/.test(lower)) slots.push("dinner");
  if (/\bsnack|snacks\b/.test(lower)) slots.push("snack");

  const under = lower.match(/\b(?:under|below|less than)\s+(\d+)/);
  let maxKcal = under ? Number(under[1]) : null;
  if (maxKcal == null && /\b(low cal|low-calorie|light)\b/.test(lower)) maxKcal = 400;

  return {
    tokens: lower
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1 && !SEARCH_STOP.has(token)),
    slots,
    plant: /\b(veg|vegan|vegetarian|plant|plants)\b/.test(lower),
    highProtein: /\bprotein\b/.test(lower),
    quick: /\b(quick|easy|fast|simple|20)\b/.test(lower),
    lean: /\b(lean|low fat|low-fat)\b/.test(lower),
    fiber: /\bfiber\b/.test(lower),
    maxKcal,
  };
}

function scoreHealthyRecipe(entry: ExplorerMealCard, intent: HealthySearchIntent) {
  const name = entry.meal.name.toLowerCase();
  const tags = entry.meal.tags.map((tag) => tag.toLowerCase());
  const ingredients = entry.meal.ingredients.map((item) => item.toLowerCase());
  let score = 1;

  for (const token of intent.tokens) {
    if (name.includes(token)) score += 6;
    else if (ingredients.some((item) => item.includes(token))) score += 4;
    else if (tags.some((tag) => tag.includes(token))) score += 3;
  }

  if (intent.highProtein && (entry.meal.protein >= 24 || tags.includes("high protein"))) score += 8;
  if (intent.plant && (tags.includes("plant") || /\b(tofu|chickpea|lentil|hummus|quinoa)\b/.test(name))) {
    score += 8;
  }
  if (intent.quick && tags.includes("quick")) score += 5;
  if (intent.lean && tags.includes("lean")) score += 5;
  if (intent.fiber && tags.includes("fiber")) score += 5;
  return score;
}

export function describeHealthySearch(query: string) {
  const intent = parseHealthySearch(query);
  const parts: string[] = [];
  if (intent.highProtein) parts.push("high-protein");
  if (intent.plant) parts.push("vegetarian");
  if (intent.quick) parts.push("quick");
  if (intent.lean) parts.push("lean");
  if (intent.fiber) parts.push("high-fiber");
  if (intent.slots.length === 1) parts.push(intent.slots[0]);
  if (intent.maxKcal) parts.push(`under ${intent.maxKcal} kcal`);
  if (parts.length) return `AI picks for ${parts.join(" · ")}`;
  const trimmed = query.trim();
  return trimmed ? `AI picks for “${trimmed}”` : "AI picks";
}

export function searchHealthyRecipes(
  query: string,
  catalog: ExplorerMealCard[],
  slot: "all" | MealSlot,
): ExplorerMealCard[] {
  const intent = parseHealthySearch(query);
  const pool = [...catalog, ...extraHealthyRecipes];
  const seen = new Set<string>();
  const unique = pool.filter((entry) => {
    if (seen.has(entry.key)) return false;
    seen.add(entry.key);
    return true;
  });

  const slots = intent.slots.length > 0 ? intent.slots : slot === "all" ? null : [slot];

  return unique
    .filter((entry) => {
      if (slots && !slots.includes(entry.slot)) return false;
      if (intent.maxKcal != null && entry.meal.kcal > intent.maxKcal) return false;
      if (intent.plant) {
        const plantish =
          entry.meal.tags.includes("Plant") ||
          /\b(tofu|chickpea|lentil|hummus|quinoa|oat|yogurt|parfait)\b/i.test(entry.meal.name);
        if (!plantish) return false;
      }
      if (intent.highProtein && entry.meal.protein < 20 && !entry.meal.tags.includes("High protein")) {
        return false;
      }
      return scoreHealthyRecipe(entry, intent) > 1 || intent.tokens.length === 0;
    })
    .sort((a, b) => scoreHealthyRecipe(b, intent) - scoreHealthyRecipe(a, intent));
}

export function mealIdeasHeading(slot: MealSlot) {
  return `${mealSlotLabel(slot)} ideas for you`;
}

export function percent(consumed: number, target: number) {
  if (target <= 0) return 0;
  return Math.round((consumed / target) * 100);
}

export function formatKcal(value: number) {
  return value.toLocaleString("en-US");
}

export function proteinShort(nutrition: Nutrition) {
  return Math.max(0, nutrition.protein.target - nutrition.protein.consumed);
}

export function parseMealDescription(text: string) {
  const lower = text.toLowerCase();
  let kcal = 420;
  let protein = 28;
  let fat = 12;
  let carbs = 32;
  let name = text.trim() || "Logged meal";

  if (lower.includes("chicken")) {
    kcal = 520;
    protein = 42;
    fat = 14;
    carbs = 18;
    name = "Chicken meal";
  } else if (lower.includes("yogurt")) {
    kcal = 310;
    protein = 28;
    fat = 8;
    carbs = 24;
    name = "Greek yogurt";
  } else if (lower.includes("tofu")) {
    kcal = 480;
    protein = 24;
    fat = 16;
    carbs = 48;
    name = "Tofu stir-fry";
  } else if (lower.includes("salad")) {
    kcal = 280;
    protein = 18;
    fat = 12;
    carbs = 22;
    name = "Salad";
  }

  return { name, kcal, protein, fat, carbs };
}

export function addLoggedMeal(nutrition: Nutrition, meal: { kcal: number; protein: number; fat: number; carbs: number }): Nutrition {
  return {
    ...nutrition,
    kcalLogged: nutrition.kcalLogged + meal.kcal,
    protein: {
      ...nutrition.protein,
      consumed: nutrition.protein.consumed + meal.protein,
    },
    fat: {
      ...nutrition.fat,
      consumed: nutrition.fat.consumed + meal.fat,
    },
    carbs: {
      ...nutrition.carbs,
      consumed: nutrition.carbs.consumed + meal.carbs,
    },
  };
}
