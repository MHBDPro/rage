/**
 * Theme Presets
 *
 * Pre-configured color palettes for quick theming.
 * Use these presets in site.ts or create your own custom colors.
 */

import type { ThemePreset } from "./types";

export const themePresets: ThemePreset[] = [
  // ============================================
  // NEON BLUE (Default)
  // ============================================
  {
    id: "neon-blue",
    name: "Neon Blue (Default)",
    colors: {
      primary: "#3b82f6",
      primaryGlow: "#60a5fa",
      accent: "#fbbf24",
      accentGlow: "#fcd34d",
      background: "#03040b",
      foreground: "#e4e4e7",
      surface: "#0a0b14",
      surfaceElevated: "#12131f",
      muted: "#71717a",
      success: "#22c55e",
      danger: "#ef4444",
    },
  },

  // ============================================
  // EMERALD CYBER
  // ============================================
  {
    id: "emerald-cyber",
    name: "Emerald Cyber",
    colors: {
      primary: "#10b981",
      primaryGlow: "#34d399",
      accent: "#f59e0b",
      accentGlow: "#fbbf24",
      background: "#030b07",
      foreground: "#e4e7e5",
      surface: "#0a140f",
      surfaceElevated: "#121f18",
      muted: "#6b7280",
      success: "#22c55e",
      danger: "#ef4444",
    },
  },

  // ============================================
  // PURPLE HAZE
  // ============================================
  {
    id: "purple-haze",
    name: "Purple Haze",
    colors: {
      primary: "#8b5cf6",
      primaryGlow: "#a78bfa",
      accent: "#ec4899",
      accentGlow: "#f472b6",
      background: "#07030b",
      foreground: "#e7e4ed",
      surface: "#0f0a14",
      surfaceElevated: "#1a121f",
      muted: "#71717a",
      success: "#22c55e",
      danger: "#ef4444",
    },
  },

  // ============================================
  // CRIMSON FIRE
  // ============================================
  {
    id: "crimson-fire",
    name: "Crimson Fire",
    colors: {
      primary: "#dc2626",
      primaryGlow: "#f87171",
      accent: "#f59e0b",
      accentGlow: "#fbbf24",
      background: "#0b0303",
      foreground: "#e7e4e4",
      surface: "#140a0a",
      surfaceElevated: "#1f1212",
      muted: "#71717a",
      success: "#22c55e",
      danger: "#ef4444",
    },
  },

  // ============================================
  // OCEAN DEPTH
  // ============================================
  {
    id: "ocean-depth",
    name: "Ocean Depth",
    colors: {
      primary: "#0891b2",
      primaryGlow: "#22d3ee",
      accent: "#14b8a6",
      accentGlow: "#2dd4bf",
      background: "#030708",
      foreground: "#e4e7e7",
      surface: "#0a1214",
      surfaceElevated: "#121c1f",
      muted: "#64748b",
      success: "#22c55e",
      danger: "#ef4444",
    },
  },
];

/**
 * Get a theme preset by ID
 * @param id - The preset ID (e.g., "neon-blue", "emerald-cyber")
 * @returns The theme preset or undefined if not found
 */
export function getPreset(id: string): ThemePreset | undefined {
  return themePresets.find((preset) => preset.id === id);
}

/**
 * Get the default theme preset
 * @returns The default "neon-blue" preset
 */
export function getDefaultPreset(): ThemePreset {
  return themePresets[0];
}
