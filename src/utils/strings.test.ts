import { levenshtein, CompareResult, compareStrings } from "./strings";

test("levenshtein same string being 0", () => {
  expect(levenshtein("a", "a")).toBe(0);
  expect(levenshtein("aa", "aa")).toBe(0);
  expect(levenshtein("aaa", "aaa")).toBe(0);
});

test("levenshtein with one extra char being 1", () => {
  expect(levenshtein("a", "aa")).toBe(1);
  expect(levenshtein("aa", "aaa")).toBe(1);
});

test("levenshtein with one different being 1", () => {
  expect(levenshtein("a", "b")).toBe(1);
  expect(levenshtein("aa", "ba")).toBe(1);
  expect(levenshtein("aa", "ab")).toBe(1);
});

test("compareStrings with full match", () => {
  expect(compareStrings("foo", "foo")).toBe(CompareResult.FULL_MATCH);
  expect(compareStrings("Sector-12", "Sector-12")).toBe(
    CompareResult.FULL_MATCH
  );
  expect(compareStrings("A String with SPACES", "A String with SPACES")).toBe(
    CompareResult.FULL_MATCH
  );
});

test("compareStrings with casing match", () => {
  expect(compareStrings("foo", "Foo")).toBe(CompareResult.CASING_MATCH);
  expect(compareStrings("foo", "FOO")).toBe(CompareResult.CASING_MATCH);
  expect(compareStrings("FOO", "foo")).toBe(CompareResult.CASING_MATCH);
  expect(compareStrings("bitrunners", "BitRunners")).toBe(
    CompareResult.CASING_MATCH
  );
});

test("compareStrings with stripped match", () => {
  expect(compareStrings("a a", "aa")).toBe(CompareResult.STRIPPED_MATCH);
  expect(compareStrings("sector12", "Sector-12")).toBe(
    CompareResult.STRIPPED_MATCH
  );
});

test("compareStrings with levenshtein match", () => {
  // Up to 5 chars allows 2 changes
  expect(compareStrings("a", "b")).toBe(CompareResult.LEVENSHTEIN_MATCH);
  expect(compareStrings("a", "bb")).toBe(CompareResult.LEVENSHTEIN_MATCH);
  expect(compareStrings("a", "bbb")).toBe(CompareResult.NO_MATCH);
  expect(compareStrings("ab", "bbb")).toBe(CompareResult.LEVENSHTEIN_MATCH);

  expect(compareStrings("Sector-12", "Zector-13")).toBe(
    CompareResult.LEVENSHTEIN_MATCH
  );
  expect(compareStrings("BitRunners", "ZitBurners")).toBe(
    CompareResult.LEVENSHTEIN_MATCH
  );
  expect(compareStrings("CyberSec", "BitBurners")).toBe(CompareResult.NO_MATCH);
});
