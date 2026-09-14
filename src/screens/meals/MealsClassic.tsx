import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppTextInput from "@/src/ui/AppTextInput";
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Stop } from "react-native-svg";
import { useMealsLog } from "@/src/context/MealsLogContext";
import AppScreen from "@/src/layout/AppScreen";
import type { MealLogId } from "@/src/services/mealsLogService";
import { nextUnloggedMeal } from "@/src/services/mealsLogService";
import {
  addLoggedMeal,
  defaultMealLogIdByTime,
  defaultNutrition,
  formatKcal,
  getMealIdeasForSlot,
  groceryItems as grocerySeed,
  mealIdeasHeading,
  mealSlotFromLogId,
  parseMealDescription,
  percent,
  proteinShort,
  type GroceryItem,
  type MealRecommendation,
  type Nutrition,
} from "@/src/services/mealsService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import AvatarBadge from "@/src/ui/AvatarBadge";
import InsightCard from "@/src/ui/InsightCard";
import LogMealSheet from "@/src/ui/LogMealSheet";
import MealThumb from "@/src/ui/MealThumb";

type MealsView = "main" | "describe" | "photo" | "detail" | "all" | "grocery";

type Props = {
  onAskCoach: (message: string) => void;
};

export default function MealsClassic({ onAskCoach }: Props) {
  const { meals, saveMealLog } = useMealsLog();
  const [view, setView] = useState<MealsView>("main");
  const [logMealId, setLogMealId] = useState<MealLogId | null>(null);
  const [focusedMealId, setFocusedMealId] = useState<MealLogId | null>(null);
  const [nutrition, setNutrition] = useState<Nutrition>(defaultNutrition);
  const [description, setDescription] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<MealRecommendation | null>(null);
  const [groceries, setGroceries] = useState<GroceryItem[]>(grocerySeed);
  const parsed = useMemo(() => parseMealDescription(description), [description]);
  const grouped = useMemo(() => {
    return groceries.reduce<Record<string, GroceryItem[]>>((acc, item) => {
      acc[item.aisle] = acc[item.aisle] ? [...acc[item.aisle], item] : [item];
      return acc;
    }, {});
  }, [groceries]);
  const remaining = groceries.filter((item) => !item.checked).length;
  const aisleOrder = ["Produce", "Protein", "Dairy", "Pantry"];
  const groupedAisles = aisleOrder.filter((aisle) => grouped[aisle]?.length);
  const short = proteinShort(nutrition);
  const kcalPct = percent(nutrition.kcalLogged, nutrition.kcalTarget);
  const loggedCount = meals.filter((m) => m.logged).length;
  const activeMeal = meals.find((m) => m.id === logMealId) ?? null;
  const nextUnlogged = useMemo(() => nextUnloggedMeal(meals), [meals]);
  const ideaMealId = focusedMealId ?? nextUnlogged?.id ?? defaultMealLogIdByTime();
  const ideaSlot = mealSlotFromLogId(ideaMealId);
  const mealIdeas = getMealIdeasForSlot(ideaSlot);
  const ideasHeading = mealIdeasHeading(ideaSlot);

  function openMealCard(id: MealLogId) {
    setFocusedMealId(id);
    setLogMealId(id);
  }

  function logMeal(meal: { kcal: number; protein: number; fat: number; carbs: number }) {
    setNutrition((current) => addLoggedMeal(current, meal));
    setView("main");
    setDescription("");
  }

  if (view === "describe") {
    return (
      <Subpage title="Describe a meal" onBack={() => setView("main")}>
        <AppTextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. grilled chicken, rice, and broccoli"
          placeholderTextColor="#636366"
          style={styles.textarea}
          multiline
          accessibilityLabel="What you ate"
        />
        {description.trim() ? (
          <InsightCard title={parsed.name} body={`${parsed.kcal} kcal · ${parsed.protein}g protein`} />
        ) : null}
        <Pressable
          style={[styles.primary, !description.trim() && styles.disabled]}
          disabled={!description.trim()}
          onPress={() => logMeal(parsed)}
        >
          <Text style={styles.primaryText}>Log meal</Text>
        </Pressable>
      </Subpage>
    );
  }

  if (view === "photo") {
    return (
      <Subpage title="Review meal" onBack={() => setView("main")}>
        <View style={styles.photoPreview}>
          <Ionicons name="camera" size={36} color="rgba(255,255,255,0.35)" />
        </View>
        <InsightCard title="Estimated from your photo" body="420 kcal · 28g protein · 12g fat · 32g carbs" />
        <Pressable style={styles.primary} onPress={() => logMeal({ kcal: 420, protein: 28, fat: 12, carbs: 32 })}>
          <Text style={styles.primaryText}>Log meal</Text>
        </Pressable>
      </Subpage>
    );
  }

  if (view === "detail" && selectedMeal) {
    return (
      <Subpage title={selectedMeal.name} onBack={() => setView("main")}>
        <MealThumb meal={selectedMeal} height={180} radius={12} />
        <Text style={styles.detailMeta}>
          {selectedMeal.kcal} kcal · {selectedMeal.protein}g protein
        </Text>
        <View style={styles.ingredients}>
          {selectedMeal.ingredients.map((item) => (
            <Text key={item} style={styles.ingredient}>
              {item}
            </Text>
          ))}
        </View>
        <Pressable
          style={styles.primary}
          onPress={() => logMeal({ kcal: selectedMeal.kcal, protein: selectedMeal.protein, fat: 12, carbs: 30 })}
        >
          <Text style={styles.primaryText}>Add to today's log</Text>
        </Pressable>
      </Subpage>
    );
  }

  if (view === "all") {
    return (
      <Subpage title={ideasHeading.replace(" for you", "")} onBack={() => setView("main")}>
        {mealIdeas.map((meal) => (
          <Pressable
            key={meal.id}
            style={styles.listItem}
            onPress={() => {
              setSelectedMeal(meal);
              setView("detail");
            }}
          >
            <MealThumb meal={meal} height={56} width={56} radius={8} />
            <View style={styles.flex}>
              <Text style={styles.listName}>{meal.name}</Text>
              <Text style={styles.listMeta}>
                {meal.kcal} kcal · {meal.protein}g protein
              </Text>
            </View>
          </Pressable>
        ))}
      </Subpage>
    );
  }

  if (view === "grocery") {
    return (
      <Subpage title="Grocery list" onBack={() => setView("main")}>
        <Text style={styles.remaining}>
          {remaining} of {groceries.length} items left
        </Text>
        {groupedAisles.map((aisle) => (
          <View key={aisle} style={styles.groceryGroup}>
            <Text style={styles.aisle}>{aisle}</Text>
            {grouped[aisle].map((item) => (
              <Pressable
                key={item.id}
                style={styles.groceryRow}
                onPress={() =>
                  setGroceries((current) =>
                    current.map((entry) => (entry.id === item.id ? { ...entry, checked: !entry.checked } : entry)),
                  )
                }
                accessibilityRole="button"
                accessibilityState={{ selected: item.checked }}
              >
                <View style={[styles.check, item.checked && styles.checkOn]}>
                  {item.checked ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <Text style={[styles.groceryName, item.checked && styles.struck]}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </Subpage>
    );
  }

  return (
    <AppScreen edges={["top"]} padded={false}>
      <View style={styles.page}>
        <View style={styles.top}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Meals</Text>
              <Text style={styles.subtitle}>Eat with clarity, not guesswork</Text>
            </View>
            <AvatarBadge />
          </View>
        </View>
        <View style={styles.pageContent}>
          <NutritionCard nutrition={nutrition} kcalPct={kcalPct} compact />
          <ProteinInsight short={short} onAskCoach={onAskCoach} />

          <View style={styles.mealsSection}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Today's meals</Text>
              <Text style={styles.tag}>
                {loggedCount}/{meals.length} logged
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mealRow}
              contentContainerStyle={styles.hscroll}
            >
              {meals.map((m) => {
                const isUnlogged = !m.logged;
                return (
                  <Pressable
                    key={m.id}
                    style={[styles.mealCard, m.logged && styles.mealDone, isUnlogged && styles.mealUnloggedBar]}
                    onPress={() => openMealCard(m.id)}
                  >
                    {isUnlogged ? <View style={styles.mealUnloggedDashRing} pointerEvents="none" /> : null}
                    <View style={styles.mealHead}>
                      <View style={[styles.mealCheck, m.logged ? null : styles.mealUnloggedCheck]}>
                        {m.logged ? <Text style={styles.mealCheckMark}>✓</Text> : null}
                      </View>
                      <View style={styles.mealText}>
                        <Text style={styles.mealName}>{m.name}</Text>
                        <Text style={styles.mealDesc}>{m.desc}</Text>
                      </View>
                    </View>
                    <View style={styles.mealFoot}>
                      <Text style={styles.mealTime}>{m.time}</Text>
                      <View style={[styles.pill, m.logged ? styles.pillEdit : styles.pillLog]}>
                        <Text style={[styles.pillText, m.logged ? styles.pillEditText : styles.pillLogText]}>
                          {m.logged ? "Edit" : "Log"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.carouselHead}>
            <Text style={styles.carouselTitle}>{ideasHeading}</Text>
            <Pressable onPress={() => setView("all")}>
              <Text style={styles.viewAll}>View all →</Text>
            </Pressable>
          </View>
          <View style={styles.carousel}>
            {mealIdeas.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.rec}
                onPress={() => {
                  setSelectedMeal(meal);
                  setView("detail");
                }}
              >
                <MealThumb meal={meal} height={70} />
                <View style={styles.recBody}>
                  <Text style={styles.recName} numberOfLines={2}>
                    {meal.name}
                  </Text>
                  <Text style={styles.recMeta}>{meal.kcal} kcal</Text>
                  <Text style={styles.recMeta}>{meal.protein}g protein</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.pageSpacer} />

        <View style={styles.groceryCtaWrap}>
          <Pressable style={styles.groceryCta} onPress={() => setView("grocery")}>
            <Text style={styles.outlineText}>Grocery list →</Text>
          </Pressable>
        </View>
      </View>

      {activeMeal ? (
        <LogMealSheet
          mealName={activeMeal.name}
          mealTime={activeMeal.time}
          onClose={() => setLogMealId(null)}
          onSave={(summary) => {
            saveMealLog(activeMeal.id, summary);
            setLogMealId(null);
          }}
        />
      ) : null}
    </AppScreen>
  );
}

function ProteinInsight({
  short,
  onAskCoach,
}: {
  short: number;
  onAskCoach: (message: string) => void;
}) {
  return (
    <View style={styles.proteinInsight}>
      <InsightCard
        title={`You're ${short}g short on protein.`}
        body="Best next step: choose a high-protein dinner."
        cta="Ask Coach"
        ctaLayout="header"
        onPress={() => onAskCoach(`I'm ${short}g short on protein today. What high-protein dinner should I eat?`)}
      />
    </View>
  );
}
function NutritionCard({
  nutrition,
  kcalPct,
  compact = false,
}: {
  nutrition: Nutrition;
  kcalPct: number;
  compact?: boolean;
}) {
  return (
    <View style={[styles.nutrition, compact && styles.nutritionCompact]}>
      <View style={[styles.nutritionHead, compact && styles.nutritionHeadCompact]}>
        <Text style={styles.nutritionH}>Today's nutrition</Text>
        <Ionicons name="information-circle-outline" size={14} color="#8495AD" />
      </View>
      <View style={[styles.nutritionBody, compact && styles.nutritionBodyCompact]}>
        <KcalRing logged={nutrition.kcalLogged} target={nutrition.kcalTarget} size={compact ? 96 : 108} />
        <View style={styles.flex}>
          <View style={styles.targetRow}>
            <Text style={styles.target}>Target {formatKcal(nutrition.kcalTarget)} kcal</Text>
            <Text style={[styles.pct, compact && styles.pctCompact]}>{kcalPct}%</Text>
          </View>
          <View style={[styles.dots, compact && styles.dotsCompact]}>
            {Array.from({ length: 22 }).map((_, i) => (
              <View key={i} style={[styles.dot, i / 22 <= kcalPct / 100 && styles.dotOn]} />
            ))}
          </View>
          {[nutrition.protein, nutrition.fat, nutrition.carbs].map((macro) => {
            const p = percent(macro.consumed, macro.target);
            return (
              <View key={macro.label} style={[styles.macro, compact && styles.macroCompact]}>
                <View style={styles.macroTop}>
                  <Text style={styles.macroLabel}>{macro.label}</Text>
                  <Text style={styles.macroVal}>
                    {macro.consumed} / {macro.target}g
                  </Text>
                  <Text style={styles.macroPct}>{p}%</Text>
                </View>
                <View style={styles.macroTrack}>
                  <View
                    style={[
                      styles.macroFill,
                      { width: `${Math.min(p, 100)}%` as `${number}%`, backgroundColor: macro.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function Subpage({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <AppScreen edges={["top"]}>
      <View style={styles.subHead}>
        <Pressable onPress={onBack} accessibilityLabel="Back" style={styles.back}>
          <Ionicons name="chevron-back" size={22} color="#8E8E93" />
        </Pressable>
        <Text style={styles.subTitle}>{title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.subScroll} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </AppScreen>
  );
}

function KcalRing({ logged, target, size = 108 }: { logged: number; target: number; size?: number }) {
  const stroke = size >= 108 ? 9 : 8;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(logged / target, 1));
  const dash = circumference * progress;
  const endDeg = -90 + 360 * progress;
  const endRad = (endDeg * Math.PI) / 180;
  const hx = center + radius * Math.cos(endRad);
  const hy = center + radius * Math.sin(endRad);
  const compact = size < 108;

  return (
    <View style={[styles.ringWrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="kcalRing" x1="50%" y1="0%" x2="90%" y2="80%">
            <Stop offset="0%" stopColor="#C5DAFF" />
            <Stop offset="40%" stopColor="#5B9DFF" />
            <Stop offset="100%" stopColor="#2E6AE8" />
          </LinearGradient>
          <RadialGradient id="kcalCap" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#7EA6FF" />
          </RadialGradient>
        </Defs>
        <Circle cx={center} cy={center} r={radius} fill="none" stroke="#2C2C2E" strokeWidth={stroke} />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#kcalRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <Circle cx={hx} cy={hy} r={4.8} fill="url(#kcalCap)" />
        <Circle cx={center} cy={center - radius} r={3.4} fill="#F4F8FF" />
      </Svg>
      <View style={styles.ringCenter} pointerEvents="none">
        <Text style={[styles.ringNum, compact && styles.ringNumCompact]}>{formatKcal(logged)}</Text>
        <Text style={[styles.ringKcal, compact && styles.ringKcalCompact]}>kcal</Text>
        <Text style={styles.ringLogged}>logged</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 0,
    paddingBottom: layout.tabBarContentInset,
    overflow: "hidden",
  },
  pageSpacer: { flexGrow: 1, flexShrink: 1, minHeight: 0 },
  pageContent: { flexShrink: 0, paddingHorizontal: 16 },
  flex: { flex: 1, minWidth: 0 },
  mealsSection: { flexShrink: 0 },
  mealRow: { height: 96 },
  top: { paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 26, lineHeight: 31, fontWeight: "700", letterSpacing: -0.4, color: "#F5F7FB" },
  subtitle: { marginTop: 1, fontSize: 11, lineHeight: 15, color: "#8E8E93" },
  outlineText: { color: colors.metricBlueSoft, fontSize: 12.5, fontWeight: "700" },
  proteinInsight: { marginTop: 10 },
  nutrition: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  nutritionCompact: { marginTop: layout.tabBarContentInset, paddingTop: 8, paddingBottom: 10 },
  nutritionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  nutritionHeadCompact: { marginBottom: 6 },
  nutritionH: { fontSize: 13, fontWeight: "600", color: "#F5F7FB" },
  nutritionBody: { flexDirection: "row", gap: 12, alignItems: "center" },
  nutritionBodyCompact: { gap: 10 },
  ringWrap: { width: 108, height: 108 },
  ringCenter: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", paddingTop: 2 },
  ringNum: { fontSize: 30, lineHeight: 30, fontWeight: "700", color: colors.white, letterSpacing: -0.8 },
  ringNumCompact: { fontSize: 27, lineHeight: 27 },
  ringKcal: { fontSize: 13, lineHeight: 15, color: "#B0BDD0" },
  ringKcalCompact: { fontSize: 12, lineHeight: 14 },
  ringLogged: { fontSize: 9, lineHeight: 11, color: "#8494AC" },
  targetRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  target: { fontSize: 11, color: "#8E8E93" },
  pct: { fontSize: 18, lineHeight: 22, fontWeight: "700", color: "#8E8E93" },
  pctCompact: { fontSize: 17, lineHeight: 20 },
  dots: { marginVertical: 7, flexDirection: "row", gap: 3 },
  dotsCompact: { marginVertical: 5 },
  dot: { flex: 1, height: 3, borderRadius: 99, backgroundColor: "rgba(128,148,177,0.2)" },
  dotOn: { backgroundColor: colors.accentBlue },
  macro: { marginTop: 7 },
  macroCompact: { marginTop: 5 },
  macroTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  macroLabel: { width: 54, fontSize: 10, color: "#DCE4EF", fontWeight: "500" },
  macroVal: { flex: 1, fontSize: 10, color: "#8E8E93" },
  macroPct: { fontSize: 10, color: "#C5D0E0", fontWeight: "600" },
  macroTrack: { marginTop: 3, height: 4, borderRadius: 99, backgroundColor: "rgba(128,148,177,0.18)", overflow: "hidden" },
  macroFill: { height: 4, borderRadius: 99 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: colors.white },
  tag: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.metricBlueSoft,
    backgroundColor: "rgba(47,111,237,0.16)",
    borderWidth: 1,
    borderColor: "rgba(47,111,237,0.28)",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  hscroll: { gap: 10 },
  mealCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 12,
    width: 126,
    height: 96,
    justifyContent: "space-between",
  },
  mealDone: { borderColor: "rgba(47,111,237,0.4)" },
  mealUnloggedBar: {
    borderLeftWidth: 3,
    borderLeftColor: colors.metricBlueSoft,
  },
  mealUnloggedDashRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(61,123,255,0.42)",
    borderStyle: "dashed",
  },
  mealHead: { flexDirection: "row", alignItems: "center", gap: 5 },
  mealText: { flex: 1, minWidth: 0 },
  mealCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  mealUnloggedCheck: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
  },
  mealCheckMark: { color: colors.white, fontSize: 12, fontWeight: "700" },
  mealName: { fontSize: 13.5, fontWeight: "800", color: colors.white, textAlign: "right" },
  mealDesc: { fontSize: 10.5, color: "#8EA0B8", marginTop: 1, textAlign: "right" },
  mealFoot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  mealTime: { fontSize: 10, color: "#8EA0B8", fontWeight: "600" },
  pill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  pillLog: { backgroundColor: "rgba(47,111,237,0.18)" },
  pillEdit: { backgroundColor: "rgba(255,255,255,0.06)" },
  pillText: { fontSize: 9.5, fontWeight: "700" },
  pillLogText: { color: colors.metricBlueSoft },
  pillEditText: { color: "#8EA0B8" },
  carouselHead: { marginTop: 10, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  carouselTitle: { fontSize: 12, fontWeight: "600", color: "#F5F7FB" },
  viewAll: { fontSize: 10, fontWeight: "600", color: "#8E8E93" },
  carousel: { flexDirection: "row", gap: 8 },
  rec: {
    flex: 1,
    height: 138,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    overflow: "hidden",
  },
  recBody: { paddingHorizontal: 8, paddingVertical: 7, gap: 1 },
  recName: { fontSize: 11, lineHeight: 14, fontWeight: "600", color: "#F5F7FB" },
  recMeta: { fontSize: 10, lineHeight: 13, color: "#8E8E93" },
  groceryCtaWrap: {
    marginTop: layout.tabBarContentInset,
    marginHorizontal: 16,
    flexShrink: 0,
  },
  groceryCta: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  subHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  back: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  subTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3, color: colors.white, flex: 1 },
  subScroll: { gap: 10, paddingBottom: 16 },
  textarea: {
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    color: colors.white,
    padding: 12,
    fontSize: 13,
  },
  primary: {
    marginTop: 4,
    height: 44,
    borderRadius: 11,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  disabled: { opacity: 0.4 },
  photoPreview: {
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  detailMeta: { fontSize: 12, color: "#8E8E93" },
  ingredients: { backgroundColor: colors.surface, borderRadius: 16, padding: 10, gap: 8 },
  ingredient: {
    fontSize: 13,
    color: "#E8EEF6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
  },
  remaining: { fontSize: 12, color: "#8E8E93", marginBottom: 4 },
  groceryGroup: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, marginBottom: 4 },
  aisle: { fontSize: 11, color: "#8E8E93", fontWeight: "600", marginBottom: 8 },
  groceryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    marginTop: 8,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(140,160,190,0.35)",
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: { backgroundColor: colors.accentBlue, borderColor: colors.accentBlue },
  checkMark: { color: colors.white, fontSize: 11, fontWeight: "700" },
  groceryName: { flex: 1, fontSize: 14, color: "#F5F7FB" },
  groceryQty: { fontSize: 12, color: "#8E8E93" },
  struck: { color: "#8E8E93", textDecorationLine: "line-through" },
  listItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
  },
  listName: { fontSize: 13, color: "#F5F7FB", fontWeight: "600" },
  listMeta: { fontSize: 11, color: "#8E8E93" },
});
