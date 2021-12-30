/** @param {number} value
 **/
export function humanReadable(value) {
    const postfixes = ["", "K", "M", "B", "T"];
    let idx = 0;

    while (value > 1000) {
        value = value / 1000;
        idx += 1;
    }

    return `${value.toFixed(2)}${postfixes[idx]}`;
}

export function humanReadableMoney(value) {
    return `$${humanReadable(value)}`;
}

export function humanReadableRAM(value) {
    const postfixes = ["GB", "TB", "PB", "EB"];
    let idx = 0;

    while (value > 1000) {
        value = value / 1000;
        idx += 1;
    }

    return `${value.toFixed(0)}${postfixes[idx]}`;
}
