export const mealPhotos: Record<string, number> = {
  "chicken-veg": require("../../assets/meals/chicken-veg.png"),
  "chicken-rice-bowl": require("../../assets/meals/chicken-rice-bowl.png"),
  "egg-scramble": require("../../assets/meals/egg-scramble.png"),
  "turkey-salad": require("../../assets/meals/turkey-salad.png"),
  "grilled-chicken-salad": require("../../assets/meals/grilled-chicken-salad.png"),
  "turkey-wrap": require("../../assets/meals/turkey-wrap.png"),
  "salmon-veg": require("../../assets/meals/salmon-veg.png"),
  "lean-beef-broccoli": require("../../assets/meals/lean-beef-broccoli.png"),
  "avocado-egg-toast": require("../../assets/meals/avocado-egg-toast.png"),
  "yogurt-berries": require("../../assets/meals/yogurt-berries.png"),
  "oatmeal-berries": require("../../assets/meals/oatmeal-berries.png"),
  "yogurt-parfait": require("../../assets/meals/yogurt-parfait.png"),
  "apple-almonds": require("../../assets/meals/apple-almonds.png"),
  "cottage-pineapple": require("../../assets/meals/cottage-pineapple.png"),
  "overnight-oats": require("../../assets/meals/overnight-oats.png"),
  "banana-protein-oats": require("../../assets/meals/banana-protein-oats.png"),
  "cottage-bowl": require("../../assets/meals/cottage-bowl.png"),
  "tofu-stir-fry": require("../../assets/meals/tofu-stir-fry.png"),
  "tofu-bowl": require("../../assets/meals/tofu-bowl.png"),
  "protein-shake": require("../../assets/meals/protein-shake.png"),
  "chickpea-quinoa": require("../../assets/meals/chickpea-quinoa.png"),
  "lentil-soup": require("../../assets/meals/lentil-soup.png"),
  "shrimp-stir-fry": require("../../assets/meals/shrimp-stir-fry.png"),
  "white-fish-greens": require("../../assets/meals/white-fish-greens.png"),
  "hummus-veg": require("../../assets/meals/hummus-veg.png"),
  "protein-smoothie": require("../../assets/meals/protein-smoothie.png"),
};

export const trainPhotos: Record<string, number> = {
  "walk-core-a": require("../../assets/train/walk-core-a.png"),
  "dead-bug": require("../../assets/train/dead-bug.png"),
  plank: require("../../assets/train/plank.png"),
  "glute-bridge": require("../../assets/train/glute-bridge.png"),
  "bird-dog": require("../../assets/train/bird-dog.png"),
  crunch: require("../../assets/train/crunch.png"),
};

export function mealPhoto(id: string) {
  return mealPhotos[id];
}

export function trainPhoto(src: string) {
  const key = src.replace("/train/", "").replace(".png", "");
  return trainPhotos[key];
}

/** Website B&W challenge photography — no illustrated people. */
export const labPhotos = {
  explorerHero: require("../../assets/images/onboarding-hero.png"),
  starter: require("../../assets/labs/lab-starter.png"),
  stairs: require("../../assets/labs/lab-starter-stairs.png"),
  "lean-reset": require("../../assets/labs/lab-executive.jpg"),
  transformation: require("../../assets/labs/lab-bikini.jpg"),
} as const;

export type LabPhotoKey = keyof typeof labPhotos;
