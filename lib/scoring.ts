// Pure scoring helpers. Kept free of runtime imports so they can be unit
// tested directly with Node (see tests/scoring.test.mjs).
import type { City, DNA } from "./cities";

export type DnaKey = keyof DNA;

export const exploreMetricKeys = [
  "cost",
  "safety",
  "nightlife",
  "transit",
  "weather",
  "walkability",
  "nature",
] as const satisfies readonly DnaKey[];

export type ExploreMetric = "overall" | (typeof exploreMetricKeys)[number];

export function exploreScore(city: City, metric: ExploreMetric) {
  if (metric !== "overall") return city.dna[metric];
  const total = exploreMetricKeys.reduce((sum, key) => sum + city.dna[key], 0);
  return Math.round(total / exploreMetricKeys.length);
}

export const prefKeys = [
  "cost",
  "nature",
  "nightlife",
  "transit",
  "safety",
  "culture",
] as const satisfies readonly DnaKey[];

export type PrefKey = (typeof prefKeys)[number];
export type Preferences = Record<PrefKey, number>;

export const defaultPreferences = Object.fromEntries(
  prefKeys.map((key) => [key, 70]),
) as Preferences;

/** Accepts anything read from storage and returns valid 0–100 preferences. */
export function normalizePreferences(value: unknown): Preferences {
  const input =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return Object.fromEntries(
    prefKeys.map((key) => {
      const raw = input[key];
      const n = typeof raw === "number" && Number.isFinite(raw) ? raw : 70;
      return [key, Math.min(100, Math.max(0, Math.round(n)))];
    }),
  ) as Preferences;
}

/** A gap this large between wish and reality is worth calling out. */
export const TENSION_GAP = 15;

export function matchCity(city: City, prefs: Preferences) {
  const gap = (key: PrefKey) => Math.abs(city.dna[key] - prefs[key]);
  const total = prefKeys.reduce((sum, key) => sum + (100 - gap(key)), 0);
  const score = Math.round((total / prefKeys.length) * 10) / 10;
  const ranked = [...prefKeys].sort((a, b) => gap(a) - gap(b));
  return {
    score,
    strong: ranked.slice(0, 3),
    tension: ranked
      .slice(-2)
      .filter((key) => gap(key) >= TENSION_GAP)
      .reverse(),
  };
}

export type MatchTier = "strong" | "possible" | "weak";

export const matchTier = (score: number): MatchTier =>
  score >= 80 ? "strong" : score >= 60 ? "possible" : "weak";

export function compareCities(a: City, b: City, keys: readonly DnaKey[]) {
  const aWins = keys.filter((key) => a.dna[key] > b.dna[key]).length;
  const bWins = keys.filter((key) => b.dna[key] > a.dna[key]).length;
  return {
    aWins,
    bWins,
    leader: aWins > bWins ? a : bWins > aWins ? b : null,
  };
}

export function discoverMatches(
  pool: readonly City[],
  keys: readonly DnaKey[],
  limit = 3,
) {
  if (keys.length === 0) return [];
  return pool
    .map((city) => ({
      city,
      match: Math.round(
        keys.reduce((sum, key) => sum + city.dna[key], 0) / keys.length,
      ),
      strengths: [...keys]
        .sort((a, b) => city.dna[b] - city.dna[a])
        .slice(0, 2),
    }))
    .sort((a, b) => b.match - a.match || a.city.name.localeCompare(b.city.name))
    .slice(0, limit);
}
