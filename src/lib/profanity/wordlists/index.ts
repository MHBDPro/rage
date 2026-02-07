/**
 * Combined wordlist from all languages
 */

import { turkishWords } from "./tr";
import { englishWords } from "./en";

// Combine all wordlists into a Set for O(1) lookup
export const profanitySet = new Set<string>([
  ...turkishWords,
  ...englishWords,
]);

// Export individual lists if needed
export { turkishWords, englishWords };
