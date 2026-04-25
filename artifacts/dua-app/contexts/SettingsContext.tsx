import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { ACCENTS, AccentName, getPalette } from "@/constants/colors";
import { LanguageCode, TRANSLATIONS } from "@/constants/translations";

const STORAGE_KEY = "@dua_app/settings_v1";

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large" | "xlarge";
export type FontStyle = "poppins" | "system" | "serif";

interface PersistedSettings {
  themeMode: ThemeMode;
  accent: AccentName;
  language: LanguageCode;
  fontSize: FontSize;
  fontStyle: FontStyle;
}

const DEFAULTS: PersistedSettings = {
  themeMode: "light",
  accent: "pink",
  language: "en",
  fontSize: "medium",
  fontStyle: "poppins",
};

export const FONT_SIZE_SCALE: Record<FontSize, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
  xlarge: 1.24,
};

export const FONT_STYLE_FAMILIES: Record<
  FontStyle,
  { regular: string; medium: string; semibold: string; bold: string }
> = {
  poppins: {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
  },
  system: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
  serif: {
    regular: "Georgia",
    medium: "Georgia",
    semibold: "Georgia",
    bold: "Georgia",
  },
};

interface SettingsContextValue extends PersistedSettings {
  ready: boolean;
  resolvedMode: "light" | "dark";
  palette: ReturnType<typeof getPalette>;
  fontScale: number;
  fontFamilies: (typeof FONT_STYLE_FAMILIES)[FontStyle];
  t: (key: string) => string;
  setThemeMode: (m: ThemeMode) => void;
  setAccent: (a: AccentName) => void;
  setLanguage: (l: LanguageCode) => void;
  setFontSize: (s: FontSize) => void;
  setFontStyle: (s: FontStyle) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<PersistedSettings>(DEFAULTS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
          setSettings({ ...DEFAULTS, ...parsed });
        }
      } catch {
        // ignore
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: PersistedSettings) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    const resolvedMode: "light" | "dark" =
      settings.themeMode === "system"
        ? systemScheme === "dark"
          ? "dark"
          : "light"
        : settings.themeMode;
    const palette = getPalette(resolvedMode, settings.accent);
    const fontScale = FONT_SIZE_SCALE[settings.fontSize];
    const fontFamilies = FONT_STYLE_FAMILIES[settings.fontStyle];
    const dict = TRANSLATIONS[settings.language] ?? TRANSLATIONS.en;

    const t = (key: string) =>
      dict[key] ?? TRANSLATIONS.en[key] ?? key;

    return {
      ...settings,
      ready,
      resolvedMode,
      palette,
      fontScale,
      fontFamilies,
      t,
      setThemeMode: (m) => persist({ ...settings, themeMode: m }),
      setAccent: (a) => persist({ ...settings, accent: a }),
      setLanguage: (l) => persist({ ...settings, language: l }),
      setFontSize: (s) => persist({ ...settings, fontSize: s }),
      setFontStyle: (s) => persist({ ...settings, fontStyle: s }),
      sidebarOpen,
      setSidebarOpen,
    };
  }, [settings, systemScheme, ready, sidebarOpen, persist]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export { ACCENTS };
