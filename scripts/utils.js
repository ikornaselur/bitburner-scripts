/** @param {number} value
 **/
export function humanReadableMoney(value) {
    const postfixes = ["", "K", "M", "B", "T"];
    let idx = 0;

    while (value > 1000) {
        value = value / 1000;
        idx += 1;
    }

    return `$${value.toFixed(2)}${postfixes[idx]}`;
}
