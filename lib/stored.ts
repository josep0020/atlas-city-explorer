import { useSyncExternalStore } from "react";

/**
 * A small localStorage-backed store for per-visitor preferences.
 *
 * - Server render and first client render use `fallback`, so hydration matches.
 * - Every storage access is guarded: in private mode or with blocked storage the
 *   value simply lives in memory for the rest of the visit.
 * - Other tabs stay in sync through the `storage` event.
 */
export function createStoredValue<T>(
  key: string,
  fallback: T,
  parse: (value: unknown) => T,
) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cached = fallback;
  let memoryOnly = false;

  const read = () => {
    if (memoryOnly) return cached;
    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      memoryOnly = true;
      return cached;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cached = raw === null ? fallback : parse(JSON.parse(raw));
      } catch {
        cached = fallback;
      }
    }
    return cached;
  };

  const emit = () => listeners.forEach((listener) => listener());

  const set = (update: T | ((current: T) => T)) => {
    const next =
      typeof update === "function"
        ? (update as (current: T) => T)(read())
        : update;
    cached = next;
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(key, raw);
      cachedRaw = raw;
    } catch {
      memoryOnly = true;
    }
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const useValue = () => useSyncExternalStore(subscribe, read, () => fallback);

  return { useValue, set };
}
