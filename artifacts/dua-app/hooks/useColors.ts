import { useSettings } from "@/contexts/SettingsContext";

import colors from "@/constants/colors";

/**
 * Returns the design tokens for the active theme/accent, driven by
 * the user's preferences in SettingsContext.
 */
export function useColors() {
  const { palette } = useSettings();
  return { ...palette, radius: colors.radius };
}
