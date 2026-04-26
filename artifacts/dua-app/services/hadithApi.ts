import type { Category, Dua, Length } from "@/constants/duas";

const API_KEY =
  "$2y$10$dzOHpkJk32qL5aD4eIfVzOy1N0Am2qGueiueNcVHTTv1z1RIXp8m";
const BASE_URL = "https://hadithapi.com/api";

interface RawHadith {
  id: number;
  hadithNumber: string;
  englishNarrator?: string | null;
  hadithEnglish?: string | null;
  hadithUrdu?: string | null;
  hadithArabic?: string | null;
  headingEnglish?: string | null;
  headingUrdu?: string | null;
  headingArabic?: string | null;
  book?: { bookName?: string; bookSlug?: string } | null;
  chapter?: { chapterEnglish?: string } | null;
}

interface HadithsResponse {
  hadiths?: { data?: RawHadith[] };
}

const STRIP_RTL = /[\u200E\u200F]/g;

function clean(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(STRIP_RTL, "").replace(/\s+/g, " ").trim();
}

function stripNarratorPrefix(s: string): string {
  return s
    .replace(/^Narrated[^:]*:\s*/i, "")
    .replace(/^[A-Z][a-z]+ said[^:]*:\s*/i, "")
    .trim();
}

function extractArabicQuoted(arabic: string): string {
  const match = arabic.match(/[«"\u201c]\s*([\s\S]+?)\s*[»"\u201d]/);
  if (match && match[1]) return clean(match[1]);
  const idx = arabic.indexOf("قَالَ");
  if (idx > 0 && idx < arabic.length - 30) {
    return clean(arabic.slice(idx + 5));
  }
  return clean(arabic);
}

function extractEnglishQuoted(english: string): string {
  const match = english.match(/["\u201c]([^"\u201d]+)["\u201d]/);
  if (match && match[1]) return match[1].trim();
  return stripNarratorPrefix(english);
}

function deriveCategory(title: string, english: string): Category {
  const t = `${title} ${english}`.toLowerCase();
  if (/forgiv|repent|seek refuge from sin/.test(t)) return "Forgiveness";
  if (/protect|refuge|shield|evil|harm|shaitan|satan/.test(t))
    return "Protection";
  if (/morning|evening|wake|wakes|risen|dawn/.test(t))
    return "Morning & Evening";
  if (/sleep|bed|night/.test(t)) return "Sleep";
  if (/travel|journey|mount|riding/.test(t)) return "Travel";
  if (/prayer|salat|salah|prostrat|ruku|sajdah|sujood/.test(t))
    return "Prayer";
  if (/eat|drink|meal|food|water|milk/.test(t)) return "Food & Drink";
  if (/fast|fasting|iftar|suhoor|ramadan/.test(t)) return "Fasting";
  return "Daily";
}

function deriveLength(arabic: string): Length {
  const len = arabic.length;
  if (len < 110) return "Short";
  if (len < 260) return "Medium";
  return "Long";
}

function transformHadith(h: RawHadith): Dua | null {
  const arabicRaw = clean(h.hadithArabic);
  const englishRaw = clean(h.hadithEnglish);
  if (!arabicRaw || !englishRaw) return null;

  const arabic = extractArabicQuoted(arabicRaw);
  const english = extractEnglishQuoted(englishRaw);
  if (!arabic || arabic.length < 8) return null;

  const title =
    clean(h.headingEnglish) ||
    `Invocation #${h.hadithNumber}`;

  const urdu = clean(h.hadithUrdu);

  const bookReference = h.book?.bookName?.trim() || "Sahih Bukhari";
  const hadithNumber = h.hadithNumber || String(h.id);

  return {
    id: `hadith-${h.id}`,
    title,
    arabic,
    transliteration: "",
    urdu,
    english,
    bookReference,
    hadithNumber,
    category: deriveCategory(title, english),
    length: deriveLength(arabic),
  };
}

interface FetchSpec {
  book: string;
  chapter: number;
  paginate: number;
}

const SOURCES: FetchSpec[] = [
  { book: "sahih-bukhari", chapter: 81, paginate: 50 },
  { book: "sahih-bukhari", chapter: 80, paginate: 25 },
];

async function fetchOne(spec: FetchSpec): Promise<Dua[]> {
  const url =
    `${BASE_URL}/hadiths?apiKey=${encodeURIComponent(API_KEY)}` +
    `&book=${spec.book}&chapter=${spec.chapter}&paginate=${spec.paginate}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Hadith API ${spec.book}/${spec.chapter}: ${res.status}`);
  }
  const json = (await res.json()) as HadithsResponse;
  const items = json.hadiths?.data ?? [];
  return items
    .map(transformHadith)
    .filter((d): d is Dua => d !== null);
}

export async function fetchDuasFromApi(): Promise<Dua[]> {
  const results = await Promise.all(SOURCES.map(fetchOne));
  const all = results.flat();
  const seen = new Set<string>();
  const unique: Dua[] = [];
  for (const d of all) {
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    unique.push(d);
  }
  return unique;
}
