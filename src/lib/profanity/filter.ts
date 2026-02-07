/**
 * Profanity filter implementation
 * Checks text against wordlists with normalization
 */

import { normalizeText, generateVariations } from "./normalizer";
import { profanitySet } from "./wordlists";

export interface ProfanityResult {
  hasProfanity: boolean;
  detectedWords: string[];
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
  const normalized = normalizeText(text);
  const detectedWords: string[] = [];

  // Check for exact matches in the wordlist
  for (const word of profanitySet) {
    // Generate variations of the profanity word
    const variations = generateVariations(word);

    for (const variant of variations) {
      // Check if the normalized text contains this word
      if (normalized.includes(variant)) {
        detectedWords.push(word);
        break; // No need to check other variations of the same word
      }
    }
  }

  // Also check if the entire normalized text matches any word
  if (profanitySet.has(normalized) && !detectedWords.includes(normalized)) {
    detectedWords.push(normalized);
  }

  // Check with single-letter collapse (catches "fuuuck" etc.)
  const collapsed = normalized.replace(/(.)\1+/g, "$1");
  if (collapsed !== normalized) {
    for (const word of profanitySet) {
      const wordCollapsed = word.replace(/(.)\1+/g, "$1");
      if (collapsed.includes(wordCollapsed) && !detectedWords.includes(word)) {
        detectedWords.push(word);
      }
    }
  }

  return {
    hasProfanity: detectedWords.length > 0,
    detectedWords: [...new Set(detectedWords)], // Remove duplicates
  };
}

/**
 * Mask profanity in text with asterisks
 * @param text - Text to mask
 * @returns Text with profanity masked
 */
export function maskProfanity(text: string): string {
  let result = text;
  const { detectedWords } = checkProfanity(text);

  for (const word of detectedWords) {
    // Create a regex that matches the word case-insensitively
    const regex = new RegExp(escapeRegex(word), "gi");
    result = result.replace(regex, "*".repeat(word.length));
  }

  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
