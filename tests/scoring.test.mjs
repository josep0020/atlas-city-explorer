import assert from "node:assert/strict";
import test from "node:test";
import { cities, getCity } from "../lib/cities.ts";
import {
  compareCities,
  defaultPreferences,
  discoverMatches,
  exploreScore,
  matchCity,
  matchTier,
  normalizePreferences,
  prefKeys,
} from "../lib/scoring.ts";

const city = (dna) => ({ ...cities[0], id: "test", name: "Test", dna: { ...cities[0].dna, ...dna } });

test("getCity returns undefined for unknown ids instead of a fallback city", () => {
  assert.equal(getCity("tokyo")?.name, "Tokyo");
  assert.equal(getCity("atlantis"), undefined);
});

test("exploreScore averages the explore metrics for 'overall'", () => {
  const flat = city({ cost: 50, safety: 50, nightlife: 50, transit: 50, weather: 50, walkability: 50, nature: 50 });
  assert.equal(exploreScore(flat, "overall"), 50);
  assert.equal(exploreScore(flat, "cost"), 50);
});

test("matchCity gives 100 for a perfect match and reports no tension", () => {
  const prefs = Object.fromEntries(prefKeys.map((k) => [k, cities[0].dna[k]]));
  const result = matchCity(cities[0], prefs);
  assert.equal(result.score, 100);
  assert.equal(result.strong.length, 3);
  assert.deepEqual(result.tension, []);
});

test("matchCity lists the biggest gaps as tension, largest first", () => {
  const target = city({ cost: 100, nature: 100, nightlife: 100, transit: 100, safety: 0, culture: 40 });
  const prefs = { cost: 100, nature: 100, nightlife: 100, transit: 100, safety: 100, culture: 100 };
  assert.deepEqual(matchCity(target, prefs).tension, ["safety", "culture"]);
});

test("matchTier maps scores to honest headlines", () => {
  assert.equal(matchTier(92), "strong");
  assert.equal(matchTier(65), "possible");
  assert.equal(matchTier(20), "weak");
});

test("normalizePreferences repairs corrupt stored values", () => {
  assert.deepEqual(normalizePreferences(null), defaultPreferences);
  const repaired = normalizePreferences({ cost: 250, nature: -4, nightlife: "x", transit: 33.6 });
  assert.equal(repaired.cost, 100);
  assert.equal(repaired.nature, 0);
  assert.equal(repaired.nightlife, 70);
  assert.equal(repaired.transit, 34);
});

test("compareCities declares a draw instead of favouring the second city", () => {
  const keys = ["cost", "weather", "transit", "walkability"];
  const a = city({ cost: 90, weather: 90, transit: 10, walkability: 10 });
  const b = city({ cost: 10, weather: 10, transit: 90, walkability: 90 });
  assert.equal(compareCities(a, b, keys).leader, null);
  const c = city({ cost: 90, weather: 90, transit: 90, walkability: 10 });
  assert.equal(compareCities(c, b, keys).leader, c);
});

test("compareCities does not count equal values as wins", () => {
  const result = compareCities(cities[0], cities[0], ["cost", "safety"]);
  assert.deepEqual([result.aWins, result.bWins, result.leader], [0, 0, null]);
});

test("discoverMatches is empty without intents and explains real strengths", () => {
  assert.deepEqual(discoverMatches(cities, []), []);
  const [top] = discoverMatches(cities, ["culture", "transit", "nature"]);
  const expected = ["culture", "transit", "nature"]
    .sort((x, y) => top.city.dna[y] - top.city.dna[x])
    .slice(0, 2);
  assert.deepEqual(top.strengths, expected);
});
