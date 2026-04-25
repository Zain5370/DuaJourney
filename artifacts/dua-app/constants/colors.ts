export type AccentName = "pink" | "blue" | "green" | "purple" | "gold";

interface AccentDef {
  name: AccentName;
  label: string;
  primary: string;
  primarySoft: string;
  primaryFaint: string;
}

export const ACCENTS: Record<AccentName, AccentDef> = {
  pink: {
    name: "pink",
    label: "Rose",
    primary: "#F8C1CC",
    primarySoft: "#FCE7EE",
    primaryFaint: "#FFF0F5",
  },
  blue: {
    name: "blue",
    label: "Sky",
    primary: "#A6C8FF",
    primarySoft: "#DCEAFF",
    primaryFaint: "#EEF5FF",
  },
  green: {
    name: "green",
    label: "Sage",
    primary: "#A9D2B6",
    primarySoft: "#DCEEE2",
    primaryFaint: "#EEF7F1",
  },
  purple: {
    name: "purple",
    label: "Lavender",
    primary: "#CFC0E8",
    primarySoft: "#E6DFF3",
    primaryFaint: "#F3EFFA",
  },
  gold: {
    name: "gold",
    label: "Sand",
    primary: "#E6CFA1",
    primarySoft: "#F4E8CF",
    primaryFaint: "#FAF3E2",
  },
};

interface BasePalette {
  text: string;
  tint: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  success: string;
  successForeground: string;
  pink: string;
  pinkSoft: string;
  navy: string;
  navySoft: string;
  cream: string;
  gold: string;
}

function buildPalette(mode: "light" | "dark", accent: AccentDef): BasePalette {
  if (mode === "light") {
    return {
      text: "#1B2A4E",
      tint: "#1B2A4E",
      background: "#FFF8FA",
      foreground: "#1B2A4E",
      card: "#FFFFFF",
      cardForeground: "#1B2A4E",
      primary: "#1B2A4E",
      primaryForeground: "#FFFFFF",
      secondary: accent.primarySoft,
      secondaryForeground: "#1B2A4E",
      muted: "#F5EDF1",
      mutedForeground: "#7A6F77",
      accent: accent.primary,
      accentForeground: "#1B2A4E",
      destructive: "#E5707E",
      destructiveForeground: "#FFFFFF",
      border: "#F1E2E8",
      input: "#F1E2E8",
      success: "#7FB28A",
      successForeground: "#FFFFFF",
      pink: accent.primary,
      pinkSoft: accent.primarySoft,
      navy: "#1B2A4E",
      navySoft: "#3B4A6F",
      cream: accent.primaryFaint,
      gold: "#D4A574",
    };
  }
  return {
    text: "#F4ECEF",
    tint: "#F4ECEF",
    background: "#0F1424",
    foreground: "#F4ECEF",
    card: "#1A2138",
    cardForeground: "#F4ECEF",
    primary: accent.primary,
    primaryForeground: "#0F1424",
    secondary: "#26314D",
    secondaryForeground: "#F4ECEF",
    muted: "#222B44",
    mutedForeground: "#A2A8BC",
    accent: accent.primary,
    accentForeground: "#0F1424",
    destructive: "#E5707E",
    destructiveForeground: "#FFFFFF",
    border: "#2A3454",
    input: "#2A3454",
    success: "#7FB28A",
    successForeground: "#FFFFFF",
    pink: accent.primary,
    pinkSoft: "#26314D",
    navy: "#F4ECEF",
    navySoft: "#C8CEE2",
    cream: "#1A2138",
    gold: "#D4A574",
  };
}

export function getPalette(mode: "light" | "dark", accentName: AccentName) {
  const accent = ACCENTS[accentName] ?? ACCENTS.pink;
  return buildPalette(mode, accent);
}

const colors = {
  light: buildPalette("light", ACCENTS.pink),
  dark: buildPalette("dark", ACCENTS.pink),
  radius: 20,
};

export default colors;
