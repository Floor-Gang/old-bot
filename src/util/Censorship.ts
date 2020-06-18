/**
 * This is a utility class which has methods that can read a given string
 * and see if it should be censored or not.
 */
export class Censorship {
  /**
   * This method checks to see if a given string as the n-word.
   * @param {string} context
   * @returns {boolean}
   */
  public static hasNWord(context: string): boolean {
    const match = context.match(
      /(n\s{0,}([i!1])\s{0,}(g\s{0,}g?|b\s{0,}b?|q\s{0,}q?)\s{0,}(e\s{0,}r\s{0,}s?|a|n\s{0,}o\s{0,}g)\W|niU+1F171U+1F171?(er|a)?|(?<!(\w|\d))ni(q|b)e?\s?(?=\s)|(?<!(\w|\d)nige(?!ria))|(?<!(\w|\d))nig\s|nig(?!(\s|\w)))/g
    );

    if (!match)
      return false;

    return !match.every(x => x == '');
  }
}
