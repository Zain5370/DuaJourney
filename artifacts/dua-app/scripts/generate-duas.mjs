#!/usr/bin/env node
// Fetches Duas from hadithapi.com and writes constants/bundledDuas.ts
// so the app works fully offline. Run from artifacts/dua-app:
//   node scripts/generate-duas.mjs

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API_KEY =
  "$2y$10$dzOHpkJk32qL5aD4eIfVzOy1N0Am2qGueiueNcVHTTv1z1RIXp8m";
const BASE_URL = "https://hadithapi.com/api";
const STRIP_RTL = /[\u200E\u200F]/g;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../constants/bundledDuas.ts");

function clean(text) {
  if (!text) return "";
  return text.replace(STRIP_RTL, "").replace(/\s+/g, " ").trim();
}
function stripNarratorPrefix(s) {
  return s
    .replace(/^Narrated[^:]*:\s*/i, "")
    .replace(/^[A-Z][a-z]+ said[^:]*:\s*/i, "")
    .trim();
}
function extractArabicQuoted(arabic) {
  const match = arabic.match(/[«"\u201c]\s*([\s\S]+?)\s*[»"\u201d]/);
  if (match && match[1]) return clean(match[1]);
  const idx = arabic.indexOf("قَالَ");
  if (idx > 0 && idx < arabic.length - 30) return clean(arabic.slice(idx + 5));
  return clean(arabic);
}
function extractEnglishQuoted(english) {
  const match = english.match(/["\u201c]([^"\u201d]+)["\u201d]/);
  if (match && match[1]) return match[1].trim();
  return stripNarratorPrefix(english);
}
function deriveCategory(title, english) {
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
function deriveLength(arabic) {
  const len = arabic.length;
  if (len < 110) return "Short";
  if (len < 260) return "Medium";
  return "Long";
}
function transformHadith(h) {
  const arabicRaw = clean(h.hadithArabic);
  const englishRaw = clean(h.hadithEnglish);
  if (!arabicRaw || !englishRaw) return null;
  const arabic = extractArabicQuoted(arabicRaw);
  const english = extractEnglishQuoted(englishRaw);
  if (!arabic || arabic.length < 8) return null;
  const title = clean(h.headingEnglish) || `Invocation #${h.hadithNumber}`;
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

const SOURCES = [
  { book: "sahih-bukhari", chapter: 81, paginate: 50 },
  { book: "sahih-bukhari", chapter: 80, paginate: 25 },
];

async function fetchOne(spec) {
  const url =
    `${BASE_URL}/hadiths?apiKey=${encodeURIComponent(API_KEY)}` +
    `&book=${spec.book}&chapter=${spec.chapter}&paginate=${spec.paginate}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Hadith API ${spec.book}/${spec.chapter}: ${res.status}`);
  const json = await res.json();
  const items = json.hadiths?.data ?? [];
  return items.map(transformHadith).filter((d) => d !== null);
}

const results = await Promise.all(SOURCES.map(fetchOne));
const all = results.flat();
const seen = new Set();
const unique = [];
for (const d of all) {
  if (seen.has(d.id)) continue;
  seen.add(d.id);
  unique.push(d);
}

const header =
  `import type { Dua } from "@/constants/duas";\n\n` +
  `// Auto-generated from hadithapi.com (Sahih Bukhari, chapters 80 & 81 — Invocations).\n` +
  `// Bundled at build time so the app works fully offline.\n` +
  `// Regenerate with: node scripts/generate-duas.mjs\n\n`;

const ts = `${header}export const BUNDLED_DUAS: Dua[] = ${JSON.stringify(unique, null, 2)};\n`;
writeFileSync(OUT_PATH, ts);
console.log(`Wrote ${unique.length} duas to ${OUT_PATH}`);
