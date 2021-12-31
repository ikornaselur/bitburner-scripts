import { humanReadableRAM } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("getServerMaxRam");
    const results = {};
    for (const server of ns.getPurchasedServers()) {
        const ram = ns.getServerMaxRam(server);
        if (!results[ram]) {
            results[ram] = [];
        }
        results[ram].push(server);
    }
    let keys = Object.keys(results);
    keys.sort((a, b) => a - b);
    for (const key of keys) {
        ns.print(`--- ${humanReadableRAM(key)} ---`);
        ns.print(results[key]);
    }
}
