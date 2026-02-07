/**
 * Color Utilities
 *
 * Functions for converting colors and generating CSS variables
 * from the site configuration.
 */

import { siteConfig } from "@/config/site";

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @returns RGB object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, "");

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

/**
 * Get RGB string for CSS rgba() usage
 * @param hex - Hex color string
 * @returns RGB string like "59, 130, 246"
 */
export function getRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

/**
 * Generate CSS custom properties from config colors
 * This is used by the ThemeStyles component to inject colors
 * @returns CSS string with :root variables
 */
export function generateColorVariables(): string {
  const { colors } = siteConfig;

  // Get RGB values for colors that need opacity variants
  const primaryRgb = getRgbString(colors.primary);
  const accentRgb = getRgbString(colors.accent);
  const successRgb = getRgbString(colors.success);
  const dangerRgb = getRgbString(colors.danger);
  const backgroundRgb = getRgbString(colors.background);
  const surfaceRgb = getRgbString(colors.surface);

  return `
    :root {
      /* Generated from site config - DO NOT EDIT DIRECTLY */
      /* Edit src/config/site.ts instead */

      /* Core Colors */
      --background: ${colors.background};
      --background-rgb: ${backgroundRgb};
      --foreground: ${colors.foreground};

      /* Primary */
      --primary: ${colors.primary};
      --primary-rgb: ${primaryRgb};
      --primary-foreground: #ffffff;

      /* Secondary/Surface */
      --secondary: ${colors.surfaceElevated};
      --secondary-foreground: ${colors.foreground};

      /* Accent */
      --accent: ${colors.surfaceElevated};
      --accent-foreground: ${colors.foreground};

      /* Muted */
      --muted: ${colors.surfaceElevated};
      --muted-foreground: ${colors.muted};

      /* Card */
      --card: ${colors.surface};
      --card-foreground: ${colors.foreground};

      /* Popover */
      --popover: ${colors.surface};
      --popover-foreground: ${colors.foreground};

      /* Destructive */
      --destructive: ${colors.danger};
      --destructive-rgb: ${dangerRgb};

      /* Border & Input */
      --border: rgba(${primaryRgb}, 0.2);
      --input: rgba(${primaryRgb}, 0.15);
      --ring: ${colors.primary};

      /* Chart Colors */
      --chart-1: ${colors.primary};
      --chart-2: ${colors.primaryGlow};
      --chart-3: ${colors.accent};
      --chart-4: ${colors.success};
      --chart-5: ${colors.danger};

      /* Sidebar (Admin) */
      --sidebar: ${colors.surface};
      --sidebar-foreground: ${colors.foreground};
      --sidebar-primary: ${colors.primary};
      --sidebar-primary-foreground: #ffffff;
      --sidebar-accent: ${colors.surfaceElevated};
      --sidebar-accent-foreground: ${colors.foreground};
      --sidebar-border: rgba(${primaryRgb}, 0.2);
      --sidebar-ring: ${colors.primary};

      /* Cyberpunk Theme Colors */
      --color-neon-blue: ${colors.primary};
      --color-neon-blue-glow: ${colors.primaryGlow};
      --color-neon-cyan: ${colors.primaryGlow};
      --color-gold: ${colors.accent};
      --color-gold-glow: ${colors.accentGlow};
      --color-danger: ${colors.danger};
      --color-success: ${colors.success};
      --color-success-rgb: ${successRgb};

      /* Surface Colors */
      --color-surface: ${colors.surface};
      --color-surface-rgb: ${surfaceRgb};
      --color-surface-elevated: ${colors.surfaceElevated};
      --color-surface-hover: ${colors.surfaceElevated};

      /* Glass Effect Variables */
      --glass-background: rgba(${surfaceRgb}, 0.8);
      --glass-border: rgba(255, 255, 255, 0.1);

      /* Shadows & Glows */
      --shadow-neon: 0 0 20px rgba(${primaryRgb}, 0.3);
      --shadow-neon-strong: 0 0 40px rgba(${primaryRgb}, 0.5);
      --shadow-gold: 0 0 20px rgba(${accentRgb}, 0.3);

      /* Accent RGB for gradients */
      --accent-rgb: ${accentRgb};
    }
  `;
}

/**
 * Get a CSS variable value with fallback
 * @param name - Variable name without -- prefix
 * @param fallback - Fallback value if variable not found
 */
export function getCssVar(name: string, fallback?: string): string {
  if (typeof window === "undefined") {
    // Server-side: return fallback or empty string
    return fallback || "";
  }
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim() || fallback || ""
  );
}
