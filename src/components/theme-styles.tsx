/**
 * Theme Styles Component
 *
 * Server Component that injects CSS variables from the site config.
 * This enables runtime theming without rebuilding CSS.
 *
 * Usage: Add <ThemeStyles /> to the <head> in layout.tsx
 */

import { generateColorVariables } from "@/lib/colors";

/**
 * Injects CSS custom properties from the site configuration
 * This allows colors to be changed by editing src/config/site.ts
 */
export function ThemeStyles() {
  const cssVariables = generateColorVariables();

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: cssVariables,
      }}
    />
  );
}
