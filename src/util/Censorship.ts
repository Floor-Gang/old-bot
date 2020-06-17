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
      /(n([i!1])gg?(er|a)?\s|ni(gg|bb|qq)ers|ni(bb?|qq?)(er|a)?\W|niU+1F171U+1F171?(er|a)?|n\s?([i1])\s?g\s?g\s?([e3])\s?r|n\s?i\s?g\s?g\s?a|niger(?!ia)|)/g
    );

    if (!match)
      return false;

    return !match.every(x => x == '');
  }
}
