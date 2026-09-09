import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { appStorage } from "../lib/storage";
import {
  INITIAL_MEAL_LOG,
  type MealLogEntry,
  type MealLogId,
} from "../services/mealsLogService";

const MEALS_LOG_KEY = "lm-meals-log";

function loadMeals(): MealLogEntry[] {
  const raw = appStorage.getItem(MEALS_LOG_KEY);
  if (!raw) return INITIAL_MEAL_LOG;
  try {
    const parsed = JSON.parse(raw) as MealLogEntry[];
    if (!Array.isArray(parsed)) return INITIAL_MEAL_LOG;
    return INITIAL_MEAL_LOG.map((slot) => {
      const saved = parsed.find((item) => item?.id === slot.id);
      if (!saved || typeof saved.logged !== "boolean") return slot;
      return {
        ...slot,
        logged: saved.logged,
        itemsSummary: typeof saved.itemsSummary === "string" ? saved.itemsSummary : slot.itemsSummary,
      };
    });
  } catch {
    return INITIAL_MEAL_LOG;
  }
}

function persistMeals(next: MealLogEntry[]) {
  appStorage.setItem(MEALS_LOG_KEY, JSON.stringify(next));
}

type MealsLogContextValue = {
  meals: MealLogEntry[];
  saveMealLog: (id: MealLogId, summary: string) => void;
};

const MealsLogContext = createContext<MealsLogContextValue | null>(null);

export function MealsLogProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealLogEntry[]>(loadMeals);

  const saveMealLog = useCallback((id: MealLogId, summary: string) => {
    setMeals((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, logged: true, itemsSummary: summary } : m,
      );
      persistMeals(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ meals, saveMealLog }),
    [meals, saveMealLog],
  );

  return (
    <MealsLogContext.Provider value={value}>{children}</MealsLogContext.Provider>
  );
}

export function useMealsLog() {
  const ctx = useContext(MealsLogContext);
  if (!ctx) throw new Error("useMealsLog requires MealsLogProvider");
  return ctx;
}
