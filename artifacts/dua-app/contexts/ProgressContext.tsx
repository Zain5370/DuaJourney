import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDuas } from "@/contexts/DuasContext";

const STORAGE_KEY = "@dua_app/progress_v1";
const DAILY_KEY = "@dua_app/daily_v1";
const STREAK_KEY = "@dua_app/streak_v1";

const DAILY_GOAL = 2;

interface DailyState {
  date: string;
  duaIds: string[];
  completedIds: string[];
}

interface StreakState {
  current: number;
  best: number;
  lastCompletedDate: string | null;
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
  streak: StreakState;
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

function diffDays(aIso: string, bIso: string): number {
  const a = new Date(aIso + "T00:00:00");
  const b = new Date(bIso + "T00:00:00");
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

function pickTodaysDuas(
  allIds: string[],
  alreadyLearned: Set<string>,
  count: number,
  todayKey: string,
): string[] {
  const pool = allIds.filter((id) => !alreadyLearned.has(id));
  const source = pool.length >= count ? pool : allIds;

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

const DEFAULT_STREAK: StreakState = {
  current: 0,
  best: 0,
  lastCompletedDate: null,
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { duas, ready: duasReady } = useDuas();
  const [ready, setReady] = useState(false);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [daily, setDaily] = useState<DailyState | null>(null);
  const [streak, setStreak] = useState<StreakState>(DEFAULT_STREAK);

  useEffect(() => {
    if (!duasReady || duas.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const [progressRaw, dailyRaw, streakRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(DAILY_KEY),
          AsyncStorage.getItem(STREAK_KEY),
        ]);

        const persistedLearned: string[] = progressRaw
          ? (JSON.parse(progressRaw) as PersistedState).learnedIds ?? []
          : [];
        const learnedSet = new Set<string>(persistedLearned);

        const todayKey = getTodayKey();
        const validIds = new Set(duas.map((d) => d.id));
        let parsedDaily: DailyState | null = dailyRaw
          ? (JSON.parse(dailyRaw) as DailyState)
          : null;

        const dailyIsStale =
          !parsedDaily ||
          parsedDaily.date !== todayKey ||
          parsedDaily.duaIds.some((id) => !validIds.has(id));

        if (dailyIsStale) {
          const ids = pickTodaysDuas(
            duas.map((d) => d.id),
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

        let parsedStreak: StreakState = streakRaw
          ? { ...DEFAULT_STREAK, ...(JSON.parse(streakRaw) as StreakState) }
          : DEFAULT_STREAK;

        if (parsedStreak.lastCompletedDate) {
          const gap = diffDays(todayKey, parsedStreak.lastCompletedDate);
          if (gap > 1) {
            parsedStreak = { ...parsedStreak, current: 0 };
            await AsyncStorage.setItem(
              STREAK_KEY,
              JSON.stringify(parsedStreak),
            );
          }
        }

        if (cancelled) return;
        setLearnedIds(learnedSet);
        setDaily(parsedDaily);
        setStreak(parsedStreak);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [duas, duasReady]);

  const persist = useCallback(
    async (
      nextLearned: Set<string>,
      nextDaily: DailyState | null,
      nextStreak: StreakState,
    ) => {
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
        AsyncStorage.setItem(STREAK_KEY, JSON.stringify(nextStreak)),
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

      let nextStreak = streak;
      const todayKey = getTodayKey();
      if (
        nextDaily.completedIds.length >= DAILY_GOAL &&
        streak.lastCompletedDate !== todayKey
      ) {
        const gap = streak.lastCompletedDate
          ? diffDays(todayKey, streak.lastCompletedDate)
          : null;
        const newCurrent =
          gap === 1 ? streak.current + 1 : streak.current === 0 ? 1 : 1;
        const continued = gap === 1 ? streak.current + 1 : 1;
        const final = continued;
        nextStreak = {
          current: final,
          best: Math.max(streak.best, final),
          lastCompletedDate: todayKey,
        };
        // newCurrent reserved if needed in future
        void newCurrent;
      }

      setDaily(nextDaily);
      setLearnedIds(nextLearned);
      setStreak(nextStreak);
      await persist(nextLearned, nextDaily, nextStreak);
    },
    [daily, learnedIds, streak, persist],
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
      await persist(nextLearned, nextDaily, streak);
    },
    [daily, learnedIds, streak, persist],
  );

  const resetProgress = useCallback(async () => {
    setLearnedIds(new Set());
    setStreak(DEFAULT_STREAK);
    if (daily) {
      const cleared: DailyState = { ...daily, completedIds: [] };
      setDaily(cleared);
      await persist(new Set(), cleared, DEFAULT_STREAK);
    } else {
      await persist(new Set(), null, DEFAULT_STREAK);
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
      streak,
      isCompletedToday: (id: string) => completedToday.includes(id),
      isLearned: (id: string) => learnedIds.has(id),
      markCompleted,
      unmarkCompleted,
      resetProgress,
    };
  }, [
    ready,
    learnedIds,
    daily,
    streak,
    markCompleted,
    unmarkCompleted,
    resetProgress,
  ]);

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
