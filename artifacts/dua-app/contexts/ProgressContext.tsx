import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DUAS } from "@/constants/duas";

const STORAGE_KEY = "@dua_app/progress_v1";
const DAILY_KEY = "@dua_app/daily_v1";

const DAILY_GOAL = 2;

interface DailyState {
  date: string;
  duaIds: string[];
  completedIds: string[];
}

interface PersistedState {
  learnedIds: string[];
  daily: DailyState | null;
}

interface ProgressContextValue {
  ready: boolean;
  learnedIds: Set<string>;
  todaysDuaIds: string[];
  completedToday: string[];
  remainingToday: number;
  dailyGoal: number;
  isCompletedToday: (id: string) => boolean;
  isLearned: (id: string) => boolean;
  markCompleted: (id: string) => Promise<void>;
  unmarkCompleted: (id: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined,
);

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function pickTodaysDuas(
  allIds: string[],
  alreadyLearned: Set<string>,
  count: number,
  todayKey: string,
): string[] {
  const pool = allIds.filter((id) => !alreadyLearned.has(id));
  const source = pool.length >= count ? pool : allIds;

  // Deterministic seeded pick based on date so the same 2 duas show all day.
  let seed = 0;
  for (let i = 0; i < todayKey.length; i++) {
    seed = (seed * 31 + todayKey.charCodeAt(i)) >>> 0;
  }

  const indices: number[] = [];
  const used = new Set<number>();
  let s = seed || 1;
  while (indices.length < Math.min(count, source.length)) {
    s = (s * 1103515245 + 12345) >>> 0;
    const idx = s % source.length;
    if (!used.has(idx)) {
      used.add(idx);
      indices.push(idx);
    }
  }
  return indices.map((i) => source[i]!);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [daily, setDaily] = useState<DailyState | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [progressRaw, dailyRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(DAILY_KEY),
        ]);

        const persistedLearned: string[] = progressRaw
          ? (JSON.parse(progressRaw) as PersistedState).learnedIds ?? []
          : [];
        const learnedSet = new Set<string>(persistedLearned);

        const todayKey = getTodayKey();
        let parsedDaily: DailyState | null = dailyRaw
          ? (JSON.parse(dailyRaw) as DailyState)
          : null;

        if (!parsedDaily || parsedDaily.date !== todayKey) {
          const ids = pickTodaysDuas(
            DUAS.map((d) => d.id),
            learnedSet,
            DAILY_GOAL,
            todayKey,
          );
          parsedDaily = {
            date: todayKey,
            duaIds: ids,
            completedIds: [],
          };
          await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(parsedDaily));
        }

        setLearnedIds(learnedSet);
        setDaily(parsedDaily);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(
    async (nextLearned: Set<string>, nextDaily: DailyState | null) => {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            learnedIds: Array.from(nextLearned),
            daily: nextDaily,
          } as PersistedState),
        ),
        nextDaily
          ? AsyncStorage.setItem(DAILY_KEY, JSON.stringify(nextDaily))
          : AsyncStorage.removeItem(DAILY_KEY),
      ]);
    },
    [],
  );

  const markCompleted = useCallback(
    async (id: string) => {
      if (!daily) return;
      if (daily.completedIds.includes(id)) return;
      if (!daily.duaIds.includes(id)) return;

      const nextDaily: DailyState = {
        ...daily,
        completedIds: [...daily.completedIds, id],
      };
      const nextLearned = new Set(learnedIds);
      nextLearned.add(id);

      setDaily(nextDaily);
      setLearnedIds(nextLearned);
      await persist(nextLearned, nextDaily);
    },
    [daily, learnedIds, persist],
  );

  const unmarkCompleted = useCallback(
    async (id: string) => {
      if (!daily) return;
      const nextDaily: DailyState = {
        ...daily,
        completedIds: daily.completedIds.filter((x) => x !== id),
      };
      const nextLearned = new Set(learnedIds);
      nextLearned.delete(id);
      setDaily(nextDaily);
      setLearnedIds(nextLearned);
      await persist(nextLearned, nextDaily);
    },
    [daily, learnedIds, persist],
  );

  const resetProgress = useCallback(async () => {
    setLearnedIds(new Set());
    if (daily) {
      const cleared: DailyState = { ...daily, completedIds: [] };
      setDaily(cleared);
      await persist(new Set(), cleared);
    } else {
      await persist(new Set(), null);
    }
  }, [daily, persist]);

  const value = useMemo<ProgressContextValue>(() => {
    const todaysDuaIds = daily?.duaIds ?? [];
    const completedToday = daily?.completedIds ?? [];
    return {
      ready,
      learnedIds,
      todaysDuaIds,
      completedToday,
      remainingToday: Math.max(0, DAILY_GOAL - completedToday.length),
      dailyGoal: DAILY_GOAL,
      isCompletedToday: (id: string) => completedToday.includes(id),
      isLearned: (id: string) => learnedIds.has(id),
      markCompleted,
      unmarkCompleted,
      resetProgress,
    };
  }, [ready, learnedIds, daily, markCompleted, unmarkCompleted, resetProgress]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
