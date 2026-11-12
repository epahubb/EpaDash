import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * useAppStore — global UI/app-level state.
 *
 * Covers: theme, global search query, global loading overlay,
 * and any app-wide settings that don't belong in the auth store.
 */
const useAppStore = create()(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────────────────────────────
      theme: "light", // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      // ── Global search ──────────────────────────────────────────────────────
      globalSearchQuery: "",
      setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
      clearGlobalSearch: () => set({ globalSearchQuery: "" }),

      // ── Full-screen loading overlay ────────────────────────────────────────
      isGlobalLoading: false,
      globalLoadingMessage: "Loading…",
      setGlobalLoading: (loading, message = "Loading…") =>
        set({ isGlobalLoading: loading, globalLoadingMessage: message }),

      // ── App preferences ────────────────────────────────────────────────────
      currency: "GH₵",
      locale: "en-GB",
      timezone: "Africa/Accra",
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),

      // ── Feature flags (for phased rollouts) ───────────────────────────────
      featureFlags: {},
      setFeatureFlag: (flag, enabled) =>
        set((s) => ({
          featureFlags: { ...s.featureFlags, [flag]: enabled },
        })),
      isFeatureEnabled: (flag) => !!get().featureFlags[flag],
    }),
    {
      name: "epadash_app_store",
      partialize: (s) => ({
        theme: s.theme,
        currency: s.currency,
        locale: s.locale,
        timezone: s.timezone,
        featureFlags: s.featureFlags,
      }),
    }
  )
);

// ── Helper: apply Tailwind dark mode class to <html> ────────────────────────
function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

// Apply persisted theme on load
if (typeof window !== "undefined") {
  try {
    const persisted = JSON.parse(
      localStorage.getItem("epadash_app_store") || "{}"
    );
    if (persisted?.state?.theme) applyTheme(persisted.state.theme);
  } catch {
    // ignore
  }
}

export { useAppStore };

