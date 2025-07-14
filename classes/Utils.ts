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
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Check if a word starts with a vowel sound (for determining "a" vs "an")
   * @param word - The word to check
   * @returns True if the word starts with a vowel sound
   */
  static startsWithVowelSound(word: string): boolean {
    if (!word || word.length === 0) return false;
    
    const firstChar = word.charAt(0).toLowerCase();
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    
    // Check for common exceptions where 'u' sounds like 'y'
    const uExceptions = ['university', 'uniform', 'unique', 'united', 'useful', 'usual'];
    if (firstChar === 'u' && uExceptions.some(exception => word.toLowerCase().startsWith(exception))) {
      return false;
    }
    
    // Check for 'h' words that are silent (like 'hour', 'honest')
    const silentHWords = ['hour', 'honest', 'honor', 'heir'];
    if (firstChar === 'h' && silentHWords.some(exception => word.toLowerCase().startsWith(exception))) {
      return true;
    }
    
    return vowels.includes(firstChar);
  }
} 