/**
 * Text normalizer for profanity detection
 * Handles leet speak, Turkish characters, and obfuscation attempts
 */

// Leet speak character mappings
const leetMap: Record<string, string> = {
  "@": "a",
  "4": "a",
  "^": "a",
  "3": "e",
  "€": "e",
  "1": "i",
  "!": "i",
  "|": "i",
  "0": "o",
  "5": "s",
  "$": "s",
  "7": "t",
  "+": "t",
  "8": "b",
  "9": "g",
  "6": "g",
  "2": "z",
};

// Turkish character normalization
const turkishMap: Record<string, string> = {
  ı: "i",
  İ: "i",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

// Characters to strip (separators used to obfuscate)
const stripChars = /[.\-_*#~`'"\/\\,;:!?\s]/g;

/**
 * Normalize text for profanity checking
 * @param text - Input text to normalize
 * @returns Normalized text ready for comparison
 */
export function normalizeText(text: string): string {
  let normalized = text.toLowerCase();

  // Apply Turkish character normalization
  for (const [char, replacement] of Object.entries(turkishMap)) {
    normalized = normalized.replaceAll(char, replacement);
  }

  // Apply leet speak normalization
  for (const [char, replacement] of Object.entries(leetMap)) {
    normalized = normalized.replaceAll(char, replacement);
  }

  // Remove separator characters (used to obfuscate like f.u.c.k)
  normalized = normalized.replace(stripChars, "");

  // Collapse repeated characters (fuuuuck -> fuck)
  normalized = normalized.replace(/(.)\1{2,}/g, "$1$1");

  return normalized;
}

/**
 * Generate variations of a word for matching
 * Helps catch edge cases like "fuuck" (double letters)
 * @param word - Base word to generate variations for
 * @returns Array of word variations
 */
export function generateVariations(word: string): string[] {
  const variations: string[] = [word];

  // Add single-letter version (removes ALL duplicates)
  const singleLetters = word.replace(/(.)\1+/g, "$1");
  if (singleLetters !== word) {
    variations.push(singleLetters);
  }

  return variations;
}
