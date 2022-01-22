export const levenshtein = (a: string, b: string): number => {
  if (b.length === 0) {
    return a.length;
  }
  if (a.length === 0) {
    return b.length;
  }

  if (a[0] === b[0]) {
    return levenshtein(a.substring(1), b.substring(1));
  }

  return (
    1 +
    Math.min(
      levenshtein(a.substring(1), b),
      levenshtein(a, b.substring(1)),
      levenshtein(a.substring(1), b.substring(1))
    )
  );
};

export enum CompareResult {
  FULL_MATCH = 0,
  CASING_MATCH = 1,
  STRIPPED_MATCH = 2,
  LEVENSHTEIN_MATCH = 3,
  NO_MATCH = 4,
}

export const compareStrings = (
  candidate: string,
  comparing: string
): CompareResult => {
  if (candidate === comparing) {
    return CompareResult.FULL_MATCH;
  }
  if (candidate.toLocaleLowerCase() === comparing.toLocaleLowerCase()) {
    return CompareResult.CASING_MATCH;
  }
  const candidateStripped = candidate.toLocaleLowerCase().replace(/\W+/g, "");
  const comparingStripped = comparing.toLocaleLowerCase().replace(/\W+/g, "");
  if (candidateStripped === comparingStripped) {
    return CompareResult.STRIPPED_MATCH;
  }

  // For 0-5 chars, allow 2 changes
  // For 6-10 chars, allow 3 changes
  // For 11-15 chars, allow 4 changes
  // .... and so on
  const levenshteinLimit = candidate.length / 5 + 2;
  if (levenshtein(candidate, comparing) < levenshteinLimit) {
    return CompareResult.LEVENSHTEIN_MATCH;
  }

  return CompareResult.NO_MATCH;
};
