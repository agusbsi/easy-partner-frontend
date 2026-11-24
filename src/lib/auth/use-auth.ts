import { useSyncExternalStore } from "react";
import { getSession, subscribe } from "./mock-auth";

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSession, () => null);
  return { user };
}
