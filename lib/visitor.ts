import { cities } from "./cities";
import { defaultPreferences, normalizePreferences } from "./scoring";
import { createStoredValue } from "./stored";

const cityIds = new Set(cities.map((city) => city.id));

export const favoritesStore = createStoredValue<string[]>(
  "atlas-favorites",
  [],
  (value) =>
    Array.isArray(value)
      ? value.filter(
          (id): id is string => typeof id === "string" && cityIds.has(id),
        )
      : [],
);

export const preferencesStore = createStoredValue(
  "atlas-preferences",
  defaultPreferences,
  normalizePreferences,
);

export function useFavorites() {
  const favorites = favoritesStore.useValue();
  const toggle = (id: string) =>
    favoritesStore.set((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    );
  return { favorites, toggle };
}
