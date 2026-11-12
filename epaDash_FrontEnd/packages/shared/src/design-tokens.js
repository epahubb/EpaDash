/**
 * EpaDash Design System — Shared Tailwind Theme Extension
 *
 * Import this in each app's tailwind.config.js to ensure a consistent
 * design token set across all portals.
 *
 * Usage in tailwind.config.js:
 *   import { epadashTheme } from '../../packages/shared/src/design-tokens.js'
 *   export default { theme: { extend: epadashTheme }, ... }
 */

export const epadashTheme = {
  colors: {
    // ── Brand ──────────────────────────────────────────────────────────────
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },
    // Alias
    brand: {
      DEFAULT: "#059669",
      light: "#10b981",
      dark: "#047857",
    },

    // ── Semantic UI colours ───────────────────────────────────────────────
    success: {
      50: "#ecfdf5",
      100: "#d1fae5",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
    },

    // ── Surface ───────────────────────────────────────────────────────────
    surface: {
      DEFAULT: "#ffffff",
      soft: "#f9fafb",
      muted: "#f3f4f6",
      border: "#e5e7eb",
      "border-strong": "#d1d5db",
    },

    // ── Sidebar / Dark panel ──────────────────────────────────────────────
    sidebar: {
      DEFAULT: "#0f172a",
      hover: "#1e293b",
      active: "#059669",
      text: "#cbd5e1",
      "text-muted": "#64748b",
    },
  },

  fontFamily: {
    sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
    mono: ["JetBrains Mono", "Fira Code", "monospace"],
    display: ["Inter", "system-ui", "sans-serif"],
  },

  fontSize: {
    "2xs": ["10px", { lineHeight: "14px" }],
    xs: ["12px", { lineHeight: "16px" }],
    sm: ["13px", { lineHeight: "20px" }],
    base: ["14px", { lineHeight: "22px" }],
    md: ["15px", { lineHeight: "24px" }],
    lg: ["16px", { lineHeight: "24px" }],
    xl: ["18px", { lineHeight: "28px" }],
    "2xl": ["20px", { lineHeight: "30px" }],
    "3xl": ["24px", { lineHeight: "32px" }],
    "4xl": ["28px", { lineHeight: "36px" }],
    "5xl": ["32px", { lineHeight: "40px" }],
  },

  borderRadius: {
    none: "0",
    sm: "4px",
    DEFAULT: "6px",
    md: "8px",
    lg: "10px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "20px",
    full: "9999px",
  },

  boxShadow: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
    DEFAULT:
      "0 2px 6px -1px rgb(0 0 0 / 0.08), 0 1px 4px -2px rgb(0 0 0 / 0.06)",
    md: "0 4px 10px -2px rgb(0 0 0 / 0.1), 0 2px 6px -2px rgb(0 0 0 / 0.08)",
    lg: "0 8px 20px -4px rgb(0 0 0 / 0.12), 0 4px 10px -4px rgb(0 0 0 / 0.08)",
    xl: "0 16px 32px -8px rgb(0 0 0 / 0.16), 0 8px 16px -8px rgb(0 0 0 / 0.1)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
    card: "0 1px 3px rgb(0 0 0 / 0.06), 0 0 0 1px rgb(0 0 0 / 0.04)",
    "brand-sm": "0 2px 8px rgb(5 150 105 / 0.25)",
    "brand-md": "0 4px 16px rgb(5 150 105 / 0.3)",
  },

  transitionDuration: {
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
  },

  transitionTimingFunction: {
    "ease-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "ease-smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  spacing: {
    // Extra spacing tokens that augment Tailwind's defaults
    "4.5": "1.125rem",
    "5.5": "1.375rem",
    "13": "3.25rem",
    "15": "3.75rem",
    "18": "4.5rem",
    "22": "5.5rem",
  },

  zIndex: {
    base: "0",
    raised: "10",
    dropdown: "20",
    sticky: "30",
    overlay: "40",
    modal: "50",
    toast: "60",
    tooltip: "70",
  },

  keyframes: {
    "fade-in": {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    "slide-up": {
      "0%": { opacity: "0", transform: "translateY(8px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "slide-down": {
      "0%": { opacity: "0", transform: "translateY(-8px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    shimmer: {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
    "pulse-brand": {
      "0%, 100%": { boxShadow: "0 0 0 0 rgb(5 150 105 / 0.4)" },
      "50%": { boxShadow: "0 0 0 8px rgb(5 150 105 / 0)" },
    },
  },

  animation: {
    "fade-in": "fade-in 200ms ease-out both",
    "slide-up": "slide-up 200ms ease-out both",
    "slide-down": "slide-down 200ms ease-out both",
    shimmer: "shimmer 2s linear infinite",
    "pulse-brand": "pulse-brand 2s ease-in-out infinite",
  },
};

/**
 * Skeleton / shimmer background gradient used in loading placeholders.
 * Apply via inline style or CSS custom property.
 */
export const SHIMMER_GRADIENT =
  "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)";

/**
 * Z-index scale (mirrors the Tailwind zIndex tokens above for use in JS).
 */
export const Z = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
};

