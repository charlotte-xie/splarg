export default class Utils {
  /**
   * Formats a number for display, using abbreviations for large numbers
   * @param number - The number to format
   * @returns Formatted string representation
   */
  static displayNumber(number: number): string {
    if (number < 10000) {
      return number.toString();
    } else if (number < 1000000) {
      const thousands = Math.floor(number / 1000);
      return `${thousands}k`;
    } else if (number < 1000000000) {
      const millions = Math.floor(number / 1000000);
      return `${millions}m`;
    } else {
      const billions = Math.floor(number / 1000000000);
      return `${billions}b`;
    }
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static vowelExceptions: string[] = ['un', 'us'];
  static silentPrefixes: string[] = ['hou','hei'];
  
  /**
   * Check if a word starts with a vowel sound (for determining "a" vs "an")
   * @param word - The word to check. Should be lowercase.
   * @returns True if the word starts with a vowel sound
   */
  static startsWithVowelSound(word: string): boolean {
    if (!word) throw new Error("No name provided");
    const firstChar = word.charAt(0).toLowerCase();
    switch (firstChar) {
      case 'a':
      case 'e':
      case 'i':
      case 'o':
        return true;
      case 'u':
        // Check for common exceptions where 'u' sounds like 'y'
        if (Utils.vowelExceptions.some(exception => word.startsWith(exception))) {
          return false;
        }
        return true;
      case 'h':
        // Check for 'h' words that are silent (like 'hour', 'honest')
        if (Utils.silentPrefixes.some(exception => word.startsWith(exception))) {
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  /**
   * Deep equality check for two objects (used for item props)
   */
  static deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!Utils.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!b.hasOwnProperty(key) || !Utils.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
} 