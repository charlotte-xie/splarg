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
} 