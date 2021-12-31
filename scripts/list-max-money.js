import { SERVERS } from "/scripts/constants.js";
import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("getServerMaxMoney");

    ns.print("Copying attack script to servers");
    const userHackingLevel = ns.getHackingLevel();
    const results = [];
    for (const server of SERVERS) {
        // Skip the serv-X servers
        if (server.startsWith("serv-")) {
            continue;
        }
        const maxMoney = ns.getServerMaxMoney(server);
        const serverHackingLevel = ns.getServerRequiredHackingLevel(server);
        results.push({
            server,
            maxMoney,
            hackable: serverHackingLevel < userHackingLevel,
        });
    }
    results.sort((a, b) => a.maxMoney - b.maxMoney);

    ns.print("--- Not hackable ---");
    for (const result of results.filter((res) => !res.hackable)) {
        ns.print(`[${result.server}] ${humanReadableMoney(result.maxMoney)}`);
    }

    ns.print("--- Hackable ---");
    for (const result of results.filter((res) => res.hackable)) {
        ns.print(`[${result.server}] ${humanReadableMoney(result.maxMoney)}`);
    }
}
