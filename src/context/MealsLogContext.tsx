import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isoDate } from "../lib/cohortStart";
import { completeDailyTask } from "../services/labMembershipService";
import { appStorage } from "../lib/storage";
import {
  INITIAL_MEAL_LOG,
  type MealLogEntry,
  type MealLogId,
} from "../services/mealsLogService";

const MEALS_LOG_KEY = "lm-meals-log";
const MEALS_LOG_DATE_KEY = "lm-meals-log-date";

function emptyLog(): MealLogEntry[] {
  return INITIAL_MEAL_LOG.map((slot) => ({ ...slot, logged: false, itemsSummary: undefined }));
}

function loadMeals(): MealLogEntry[] {
  const today = isoDate();
  const savedDate = appStorage.getItem(MEALS_LOG_DATE_KEY);
  if (savedDate && savedDate !== today) {
    const next = emptyLog();
    persistMeals(next);
    appStorage.setItem(MEALS_LOG_DATE_KEY, today);
    return next;
  }
  if (!savedDate) appStorage.setItem(MEALS_LOG_DATE_KEY, today);
  const raw = appStorage.getItem(MEALS_LOG_KEY);
  if (!raw) return emptyLog();
  try {
    const parsed = JSON.parse(raw) as MealLogEntry[];
    if (!Array.isArray(parsed)) return emptyLog();
    return INITIAL_MEAL_LOG.map((slot) => {
      const saved = parsed.find((item) => item?.id === slot.id);
      if (!saved || typeof saved.logged !== "boolean") return { ...slot, logged: false, itemsSummary: undefined };
      return {
        ...slot,
        logged: saved.logged,
        itemsSummary: typeof saved.itemsSummary === "string" ? saved.itemsSummary : undefined,
      };
    });
  } catch {
    return emptyLog();
  }
}

function persistMeals(next: MealLogEntry[]) {
  appStorage.setItem(MEALS_LOG_KEY, JSON.stringify(next));
  appStorage.setItem(MEALS_LOG_DATE_KEY, isoDate());
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
    if (id === "breakfast" || id === "lunch" || id === "dinner") {
      completeDailyTask(id);
    }
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
