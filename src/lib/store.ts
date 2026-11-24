import { useSyncExternalStore } from "react";
import { ACTIVITIES, HELP_REQUESTS, PROSPECTS, PARTNERS, type Activity, type HelpRequest, type Prospect, type Partner } from "./mock-data";

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (next: T | ((prev: T) => T)) => {
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

export const prospectStore = createStore<Prospect[]>(PROSPECTS);
export const helpStore = createStore<HelpRequest[]>(HELP_REQUESTS);
export const activityStore = createStore<Activity[]>(ACTIVITIES);
export const partnerStore = createStore<Partner[]>(PARTNERS);

export function useStore<T>(store: ReturnType<typeof createStore<T>>) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
