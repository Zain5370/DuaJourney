export type Length = "Short" | "Medium" | "Long";

export type Category =
  | "Daily"
  | "Forgiveness"
  | "Protection"
  | "Morning & Evening"
  | "Sleep"
  | "Travel"
  | "Prayer"
  | "Food & Drink"
  | "Fasting";

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  urdu: string;
  english: string;
  bookReference: string;
  hadithNumber: string;
  category: Category;
  length: Length;
}

export const CATEGORIES: Category[] = [
  "Daily",
  "Forgiveness",
  "Protection",
  "Morning & Evening",
  "Sleep",
  "Travel",
  "Prayer",
  "Food & Drink",
  "Fasting",
];

export const LENGTHS: Length[] = ["Short", "Medium", "Long"];
