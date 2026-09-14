import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { mealIdeas } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import {
  describeHealthySearch,
  getExplorerMealCatalog,
  mealSlotLabel,
  searchHealthyRecipes,
  type MealRecommendation,
  type MealSlot,
} from "@/src/services/mealsService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import AiSearchBar, { type AiSearchPrompt } from "@/src/ui/AiSearchBar";
import BlueCta from "@/src/ui/BlueCta";
import LabsPlanCta from "@/src/ui/LabsPlanCta";
import MealThumb from "@/src/ui/MealThumb";

const SLOTS: Array<"all" | MealSlot> = ["all", "breakfast", "lunch", "dinner", "snack"];

const SEARCH_PROMPTS: AiSearchPrompt[] = [
  { label: "High protein", query: "high protein meals" },
  { label: "Vegetarian", query: "vegetarian recipes" },
  { label: "Quick dinner", query: "quick healthy dinner" },
  { label: "Under 400", query: "healthy meals under 400" },
];

export default function MealIdeasExplorer() {
  const catalog = useMemo(() => getExplorerMealCatalog(), []);
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>("all");
  const [selected, setSelected] = useState<{ slot: MealSlot; meal: MealRecommendation } | null>(null);
  const searching = query.trim().length > 0;
  const visible = useMemo(() => {
    if (searching) return searchHealthyRecipes(query, catalog, slot);
    return slot === "all" ? catalog : catalog.filter((entry) => entry.slot === slot);
  }, [catalog, query, searching, slot]);

  if (selected) {
    return (
      <ScrollableScreen>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => setSelected(null)}
          style={styles.back}
        >
          <Text style={styles.backLabel} maxFontSizeMultiplier={1.3}>
            ← Meal Ideas
          </Text>
        </Pressable>
        <MealThumb meal={selected.meal} height={150} radius={radius.lg} />
        <Text style={styles.slotKicker} maxFontSizeMultiplier={1.2}>
          {mealSlotLabel(selected.slot)}
        </Text>
        <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
          {selected.meal.name}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {selected.meal.kcal} kcal · {selected.meal.protein}g protein
        </Text>
        <View style={styles.card}>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            Ingredients
          </Text>
          {selected.meal.ingredients.map((item, index) => (
            <Text key={`${selected.meal.id}-${index}`} style={styles.ingredient} maxFontSizeMultiplier={1.4}>
              {item}
            </Text>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
            Logging is locked
          </Text>
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            Browse any recipe. A curated daily plan, logging, and custom bowls unlock after your coach approves a Lab.
          </Text>
          <BlueCta label={mealIdeas.cta} onPress={() => router.push("/labs")} />
        </View>
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen
      footer={<LabsPlanCta title={mealIdeas.ctaTitle} body={mealIdeas.ctaBody} cta={mealIdeas.cta} />}
    >
      <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
        {mealIdeas.title}
      </Text>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        Browse recipes and ideas. Logging and a plan built for you stay locked until you’re approved.
      </Text>

      <AiSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Ask AI for healthy meals or recipes"
        prompts={SEARCH_PROMPTS}
      />

      {searching ? (
        <Text style={styles.searchSummary} maxFontSizeMultiplier={1.3}>
          {describeHealthySearch(query)}
        </Text>
      ) : null}

      <View style={styles.chips}>
        {SLOTS.map((id) => {
          const active = slot === id;
          const label = id === "all" ? "All" : mealSlotLabel(id);
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSlot(id)}
              style={[styles.chip, active ? styles.chipOn : null]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextOn : null]} maxFontSizeMultiplier={1.2}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {visible.length === 0 ? (
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          No matches. Try high protein, vegetarian, or a food like salmon.
        </Text>
      ) : (
        visible.map((entry) => (
          <Pressable
            key={entry.key}
            accessibilityRole="button"
            accessibilityLabel={entry.meal.name}
            onPress={() => setSelected({ slot: entry.slot, meal: entry.meal })}
            style={({ pressed }) => [styles.mealCard, pressed ? styles.pressed : null]}
          >
            <MealThumb meal={entry.meal} height={56} width={56} radius={radius.md} />
            <View style={styles.mealCopy}>
              <Text style={styles.mealSlot} maxFontSizeMultiplier={1.2}>
                {mealSlotLabel(entry.slot)}
              </Text>
              <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
                {entry.meal.name}
              </Text>
              <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
                {entry.meal.kcal} kcal · {entry.meal.protein}g protein
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  searchSummary: {
    ...typography.caption,
    color: colors.accentBlue,
    textTransform: "none",
    letterSpacing: 0.2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: {
    backgroundColor: colors.accentBlue,
  },
  chipText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "none",
    letterSpacing: 0.2,
  },
  chipTextOn: {
    color: colors.white,
  },
  mealCard: {
    minHeight: layout.minTouchTarget + 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  mealCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  mealSlot: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  back: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
  },
  backLabel: {
    ...typography.body,
    color: colors.accentBlue,
    fontWeight: "600",
  },
  slotKicker: {
    ...typography.caption,
    color: colors.accentBlue,
  },
  ingredient: {
    ...typography.body,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.92,
  },
});
