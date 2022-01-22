export const humanReadable = (value: number, precision = 2) => {
  const postfixes = ["", "K", "M", "B", "T"];
  let idx = 0;

  while (value >= 1000) {
    value = value / 1000;
    idx += 1;
    if (idx + 1 === postfixes.length) {
      break;
    }
  }

  return `${value.toFixed(precision)}${postfixes[idx]}`;
};

export const humanReadableMoney = (value: number, precision = 2) => {
  return `$${humanReadable(value, precision)}`;
};

export const humanReadableRAM = (value: number, precision = 1) => {
  const postfixes = ["GB", "TB", "PB", "EB"];
  let idx = 0;

  while (value >= 1024) {
    value = value / 1024;
    idx += 1;
    if (idx + 1 === postfixes.length) {
      break;
    }
  }

  return `${value.toFixed(precision)}${postfixes[idx]}`;
};
