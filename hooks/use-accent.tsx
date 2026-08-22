"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCENT_STORAGE_KEY,
  persistAccentChoice,
  readStoredAccentId,
  resolveAccentId,
} from "@/lib/accent-colors";

interface AccentContextValue {
  accentId: string;
  setAccent: (id: string) => void;
}

const AccentContext = createContext<AccentContextValue | undefined>(undefined);

/** Keeps accent picker UI in sync with SSR cookie + client storage (single source of truth). */
export function AccentProvider({
  initialAccentId,
  children,
}: {
  initialAccentId: string;
  children: ReactNode;
}) {
  const [accentId, setAccentIdState] = useState(() => resolveAccentId(initialAccentId));

  useLayoutEffect(() => {
    setAccentIdState(persistAccentChoice(readStoredAccentId()));
  }, []);

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ACCENT_STORAGE_KEY || !e.newValue) return;
      setAccentIdState(persistAccentChoice(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAccent = useCallback((id: string) => {
    setAccentIdState(persistAccentChoice(resolveAccentId(id)));
  }, []);

  const value = useMemo(() => ({ accentId, setAccent }), [accentId, setAccent]);

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

/** resolvedTheme arg kept for call-site compatibility — accent CSS follows html.dark automatically. */
export function useAccent(_resolvedTheme?: "light" | "dark") {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AccentProvider");
  return ctx;
}
