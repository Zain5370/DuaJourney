import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [duas, setDuas] = useState<Dua[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = useCallback(async (): Promise<Dua[] | null> => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedPayload;
      if (
        !parsed ||
        !Array.isArray(parsed.duas) ||
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
      const cached = await loadFromCache();
      if (cached && !cancelled) {
        setDuas(cached);
        setReady(true);
        setLoading(false);
        try {
          await fetchAndStore();
        } catch {
          // keep cached duas if refresh fails
        }
        return;
      }
      try {
        await fetchAndStore();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load Duas.");
        }
      } finally {
        if (!cancelled) {
          setReady(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadFromCache, fetchAndStore]);

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
