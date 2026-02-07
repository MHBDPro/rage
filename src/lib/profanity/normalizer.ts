/**
 * Text normalizer for profanity detection
 * Handles Turkish character folding and limited obfuscation patterns.
 * Intentionally conservative to avoid false positives on normal names.
 */

// Limited leet speak mappings (keep narrow to reduce overblocking)
const limitedLeetMap: Record<string, string> = {
  "@": "a",
  "4": "a",
  "3": "e",
  "1": "i",
  "!": "i",
  "0": "o",
  "5": "s",
  "$": "s",
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

// Token matcher: words + a few obfuscation separators
const tokenPattern = /[\p{L}\p{N}@!$%*+_.-]+/gu;
const stripTokenSeparators = /[._-]+/g;
const nonWordChars = /[^\p{L}\p{N}]+/gu;

export interface TokenSpan {
  raw: string;
  start: number;
  end: number;
  normalized: string;
  collapsed: string;
}

function applyTurkishNormalization(value: string): string {
  let normalized = value;
  for (const [char, replacement] of Object.entries(turkishMap)) {
    normalized = normalized.replaceAll(char, replacement);
  }
  return normalized;
}

function applyLimitedLeetNormalization(value: string): string {
  let normalized = value;
  for (const [char, replacement] of Object.entries(limitedLeetMap)) {
    normalized = normalized.replaceAll(char, replacement);
  }
  return normalized;
}

export function collapseRepeatedChars(value: string): string {
  return value.replace(/(.)\1+/g, "$1");
}

/**
 * Normalize a single token for dictionary comparison.
 */
export function normalizeToken(token: string): string {
  let normalized = token.toLowerCase();
  normalized = applyTurkishNormalization(normalized);
  normalized = normalized.replace(stripTokenSeparators, "");
  normalized = applyLimitedLeetNormalization(normalized);
  normalized = normalized.replace(nonWordChars, "");
  return normalized;
}

/**
 * Tokenize input while preserving index positions for masking.
 */
export function tokenizeText(text: string): TokenSpan[] {
  const spans: TokenSpan[] = [];

  for (const match of text.matchAll(tokenPattern)) {
    const raw = match[0];
    const start = match.index ?? 0;
    const normalized = normalizeToken(raw);

    if (!normalized) {
      continue;
    }

    spans.push({
      raw,
      start,
      end: start + raw.length,
      normalized,
      collapsed: collapseRepeatedChars(normalized),
    });
  }

  return spans;
}

/**
 * Normalize text for profanity checking
 * @param text - Input text to normalize
 * @returns Normalized text ready for comparison
 */
export function normalizeText(text: string): string {
  return tokenizeText(text)
    .map((token) => token.normalized)
    .join(" ");
}

/**
 * Generate variations of a word for matching
 * Helps catch edge cases like "fuuck" (double letters)
 * @param word - Base word to generate variations for
 * @returns Array of word variations
 */
export function generateVariations(word: string): string[] {
  const normalized = normalizeToken(word);
  if (!normalized) {
    return [];
  }

  const collapsed = collapseRepeatedChars(normalized);
  return collapsed !== normalized ? [normalized, collapsed] : [normalized];
}
