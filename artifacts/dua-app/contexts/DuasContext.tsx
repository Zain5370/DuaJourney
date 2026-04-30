import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { BUNDLED_DUAS } from "@/constants/bundledDuas";
import type { Dua } from "@/constants/duas";
import { fetchDuasFromApi } from "@/services/hadithApi";

const CACHE_KEY = "@dua_app/duas_cache_v1";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface CachedPayload {
  ts: number;
  duas: Dua[];
}

interface DuasContextValue {
  ready: boolean;
  loading: boolean;
  error: string | null;
  duas: Dua[];
  refresh: () => Promise<void>;
}

const DuasContext = createContext<DuasContextValue | undefined>(undefined);

export function DuasProvider({ children }: { children: React.ReactNode }) {
  // Start with bundled offline data so the app is usable instantly,
  // even with no network access.
  const [duas, setDuas] = useState<Dua[]>(BUNDLED_DUAS);
  const [ready, setReady] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = useCallback(async (): Promise<Dua[] | null> => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedPayload;
      if (
        !parsed ||
        !Array.isArray(parsed.duas) ||
        parsed.duas.length === 0 ||
        Date.now() - parsed.ts > CACHE_TTL_MS
      ) {
        return null;
      }
      return parsed.duas;
    } catch {
      return null;
    }
  }, []);

  const writeCache = useCallback(async (next: Dua[]) => {
    try {
      const payload: CachedPayload = { ts: Date.now(), duas: next };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      // ignore cache write errors
    }
  }, []);

  const fetchAndStore = useCallback(async () => {
    const fresh = await fetchDuasFromApi();
    if (fresh.length === 0) {
      throw new Error("No duas were returned from the server.");
    }
    setDuas(fresh);
    await writeCache(fresh);
  }, [writeCache]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchAndStore();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Duas.");
    } finally {
      setLoading(false);
    }
  }, [fetchAndStore]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. Prefer the cached payload from a previous successful fetch
      //    (it may include newer duas than the bundle).
      const cached = await loadFromCache();
      if (cached && !cancelled) {
        setDuas(cached);
      }

      // 2. Try to refresh in the background. If the network fails the
      //    app keeps running on the cached or bundled offline copy.
      try {
        const fresh = await fetchDuasFromApi();
        if (!cancelled && fresh.length > 0) {
          setDuas(fresh);
          await writeCache(fresh);
        }
      } catch {
        // offline / API down — bundled or cached duas remain in place
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadFromCache, writeCache]);

  const value = useMemo<DuasContextValue>(
    () => ({ ready, loading, error, duas, refresh }),
    [ready, loading, error, duas, refresh],
  );

  return (
    <DuasContext.Provider value={value}>{children}</DuasContext.Provider>
  );
}

export function useDuas(): DuasContextValue {
  const ctx = useContext(DuasContext);
  if (!ctx) throw new Error("useDuas must be used within DuasProvider");
  return ctx;
}
