import { useSettings } from "@/contexts/SettingsContext";

export type ArabicWeight = "regular" | "medium" | "bold";

export function useArabicText() {
  const { arabicFontFamilies, arabicFontScale } = useSettings();

  function style(baseSize: number, weight: ArabicWeight = "medium") {
    const fontSize = Math.round(baseSize * arabicFontScale);
    return {
      fontFamily: arabicFontFamilies[weight],
      fontSize,
      lineHeight: Math.round(fontSize * arabicFontFamilies.lineHeightFactor),
    };
  }

  return { style, scale: arabicFontScale, families: arabicFontFamilies };
}
