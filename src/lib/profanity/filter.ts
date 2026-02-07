/**
 * Profanity filter implementation
 * Conservative profanity detection:
 * - Full-token matching only (no broad substring matching)
 * - Limited obfuscation support (f.u.c.k / ş!k / repeated letters)
 */

import {
  normalizeToken,
  collapseRepeatedChars,
  tokenizeText,
  type TokenSpan,
} from "./normalizer";
import { profanitySet } from "./wordlists";

export interface ProfanityResult {
  hasProfanity: boolean;
  detectedWords: string[];
}

const canonicalByNormalized = new Map<string, string>();
const canonicalByCollapsed = new Map<string, string>();

for (const rawWord of profanitySet) {
  const normalized = normalizeToken(rawWord);
  if (!normalized) {
    continue;
  }

  if (!canonicalByNormalized.has(normalized)) {
    canonicalByNormalized.set(normalized, rawWord);
  }

  const collapsed = collapseRepeatedChars(normalized);
  if (!canonicalByCollapsed.has(collapsed)) {
    canonicalByCollapsed.set(collapsed, rawWord);
  }
}

function resolveMatchedWord(token: TokenSpan): string | null {
  const direct = canonicalByNormalized.get(token.normalized);
  if (direct) {
    return direct;
  }

  return canonicalByCollapsed.get(token.collapsed) ?? null;
}

/**
 * Check if text contains profanity
 * @param text - Text to check
 * @returns Boolean indicating if profanity was found
 */
export function containsProfanity(text: string): boolean {
  return checkProfanity(text).hasProfanity;
}

/**
 * Detailed profanity check with detected words
 * @param text - Text to check
 * @returns Object with detection result and matched words
 */
export function checkProfanity(text: string): ProfanityResult {
  const detectedWords = new Set<string>();
  const tokens = tokenizeText(text);

  for (const token of tokens) {
    const matchedWord = resolveMatchedWord(token);
    if (matchedWord) {
      detectedWords.add(matchedWord);
    }
  }

  return {
    hasProfanity: detectedWords.size > 0,
    detectedWords: [...detectedWords],
  };
}

/**
 * Mask profanity in text with asterisks
 * @param text - Text to mask
 * @returns Text with profanity masked
 */
export function maskProfanity(text: string): string {
  const tokens = tokenizeText(text);
  if (tokens.length === 0) {
    return text;
  }

  let result = "";
  let cursor = 0;

  for (const token of tokens) {
    result += text.slice(cursor, token.start);
    if (resolveMatchedWord(token)) {
      result += "*".repeat(token.raw.length);
    } else {
      result += token.raw;
    }
    cursor = token.end;
  }

  result += text.slice(cursor);
  return result;
}
