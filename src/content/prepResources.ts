/** Starter Lab prep lists from the V4 handoff. Names only — no weights or quantities. */

export type PrepGroceryGroup = {
  aisle: string;
  items: { id: string; name: string }[];
};

export const prepGroceryGroups: PrepGroceryGroup[] = [
  {
    aisle: "Proteins",
    items: [
      { id: "chicken-breast", name: "Chicken breast" },
      { id: "eggs", name: "Eggs" },
      { id: "greek-yogurt", name: "Greek yogurt" },
      { id: "tofu", name: "Tofu" },
      { id: "tuna", name: "Tuna" },
      { id: "lentils", name: "Lentils" },
    ],
  },
  {
    aisle: "Produce",
    items: [
      { id: "spinach", name: "Spinach" },
      { id: "broccoli", name: "Broccoli" },
      { id: "berries", name: "Berries" },
      { id: "apples", name: "Apples" },
      { id: "avocado", name: "Avocado" },
      { id: "lemons", name: "Lemons" },
    ],
  },
  {
    aisle: "Pantry & extras",
    items: [
      { id: "oats", name: "Oats" },
      { id: "brown-rice", name: "Brown rice" },
      { id: "olive-oil", name: "Olive oil" },
      { id: "herbs", name: "Herbs" },
      { id: "sparkling-water", name: "Sparkling water" },
    ],
  },
];

export const prepGroceryItems = prepGroceryGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, aisle: group.aisle })),
);

export const prepSupplements = {
  importantTitle: "Important",
  important:
    "Optional unless your coach or clinician has specifically advised otherwise.",
  listTitle: "Your list",
  items: [
    { id: "multivitamin", name: "Multivitamin", when: "with breakfast" },
    { id: "omega-3", name: "Omega-3", when: "with a meal" },
    { id: "vitamin-d", name: "Vitamin D", when: "only if advised" },
  ],
  safetyTitle: "Safety",
  safety: "Record medications and allergies. Ask your clinician before changes.",
} as const;
