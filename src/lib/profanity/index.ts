/**
 * Profanity Filter Module
 *
 * Multi-language profanity detection with support for:
 * - Turkish and English
 * - Leet speak (@ -> a, 3 -> e, etc.)
 * - Turkish character normalization (ş -> s, ğ -> g, etc.)
 * - Obfuscation detection (f.u.c.k, f-u-c-k, etc.)
 * - Repeated character handling (fuuuuck -> fuck)
 */

export { containsProfanity, checkProfanity, maskProfanity } from "./filter";
export { normalizeText } from "./normalizer";
export type { ProfanityResult } from "./filter";
