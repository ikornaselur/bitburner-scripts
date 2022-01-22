import { humanReadable, humanReadableMoney, humanReadableRAM } from "./format";

test("humanReadable doens't change values below 1000", () => {
  expect(humanReadable(0)).toBe("0.00");
  expect(humanReadable(25)).toBe("25.00");
  expect(humanReadable(125)).toBe("125.00");
  expect(humanReadable(999)).toBe("999.00");
});

test("humanReadable handles 1K (inclusive) to 1M", () => {
  expect(humanReadable(1000)).toBe("1.00K");
  expect(humanReadable(2500)).toBe("2.50K");
  expect(humanReadable(1234)).toBe("1.23K");
  expect(humanReadable(1235)).toBe("1.24K");
  expect(humanReadable(125000)).toBe("125.00K");
  expect(humanReadable(999990)).toBe("999.99K");
  expect(humanReadable(999999)).toBe("1000.00K");
});

test("humanReadable handles 1M (inclusive) to 1B", () => {
  expect(humanReadable(1000000)).toBe("1.00M");
  expect(humanReadable(1234567)).toBe("1.23M");
  expect(humanReadable(12345678)).toBe("12.35M");
  expect(humanReadable(123456789)).toBe("123.46M");
  expect(humanReadable(999990000)).toBe("999.99M");
  expect(humanReadable(999999000)).toBe("1000.00M");
});

test("humanReadable handles 1B (inclusive) to 1T", () => {
  expect(humanReadable(1000000000)).toBe("1.00B");
  expect(humanReadable(1234567000)).toBe("1.23B");
  expect(humanReadable(12345678000)).toBe("12.35B");
  expect(humanReadable(123456789000)).toBe("123.46B");
  expect(humanReadable(999990000000)).toBe("999.99B");
  expect(humanReadable(999999000000)).toBe("1000.00B");
});

test("humanReadable handles 1T and up", () => {
  expect(humanReadable(1000000000000)).toBe("1.00T");
  expect(humanReadable(1234567000000)).toBe("1.23T");
  expect(humanReadable(12345678000000)).toBe("12.35T");
  expect(humanReadable(123456789000000)).toBe("123.46T");
  expect(humanReadable(999990000000000)).toBe("999.99T");
  expect(humanReadable(999999000000000)).toBe("1000.00T");
  expect(humanReadable(1000000000000000)).toBe("1000.00T");
  expect(humanReadable(1234567890000000)).toBe("1234.57T");
});

test("humanReadable precision", () => {
  expect(humanReadable(12345, 0)).toBe("12K");
  expect(humanReadable(12345, 1)).toBe("12.3K");
  expect(humanReadable(12345, 2)).toBe("12.35K");
  expect(humanReadable(12345, 3)).toBe("12.345K");
});

test("humanReadableMoney", () => {
  expect(humanReadableMoney(100)).toBe("$100.00");
  expect(humanReadableMoney(25000)).toBe("$25.00K");
  expect(humanReadableMoney(1000000)).toBe("$1.00M");
});

test("humanReadableRAM", () => {
  expect(humanReadableRAM(256)).toBe("256.0GB");
  expect(humanReadableRAM(512)).toBe("512.0GB");
  expect(humanReadableRAM(1024)).toBe("1.0TB");
  expect(humanReadableRAM(2 * 1024)).toBe("2.0TB");
  expect(humanReadableRAM(4 * 1024)).toBe("4.0TB");
  expect(humanReadableRAM(512 * 1024)).toBe("512.0TB");
  expect(humanReadableRAM(1024 * 1024)).toBe("1.0PB");
  expect(humanReadableRAM(2 * 1024 * 1024)).toBe("2.0PB");
  expect(humanReadableRAM(4 * 1024 * 1024)).toBe("4.0PB");
  expect(humanReadableRAM(512 * 1024 * 1024)).toBe("512.0PB");
  expect(humanReadableRAM(1024 * 1024 * 1024)).toBe("1.0EB");
  expect(humanReadableRAM(2 * 1024 * 1024 * 1024)).toBe("2.0EB");
  expect(humanReadableRAM(4 * 1024 * 1024 * 1024)).toBe("4.0EB");
  expect(humanReadableRAM(512 * 1024 * 1024 * 1024)).toBe("512.0EB");
  expect(humanReadableRAM(1024 * 1024 * 1024 * 1024)).toBe("1024.0EB");
  expect(humanReadableRAM(2 * 1024 * 1024 * 1024 * 1024)).toBe("2048.0EB");
});
