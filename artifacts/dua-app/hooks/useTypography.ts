import { useSettings } from "@/contexts/SettingsContext";

export function useTypography() {
  const { fontScale, fontFamilies } = useSettings();

  const scale = (size: number) => Math.round(size * fontScale);

  return {
    scale,
    fontFamilies,
    families: fontFamilies,
  };
}
