export class Utils {
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
} 