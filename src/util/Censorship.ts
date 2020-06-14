export class Censorship {
  public static isNWord(context: string): boolean {
    const match = context.match(
      /(n([i!1])gg?(er|a)?\s|ni(gg|bb|qq)ers|ni(bb?|qq?)(er|a)?|niU+1F171U+1F171?(er|a)?|n\s?([i1])\s?g\s?g\s?([e3])\s?r|n\s?i\s?g\s?g\s?a|niger(?!ia)|)/g
    );

    if (!match)
      return false;

    return !match.every(x => x == '');
  }
}
