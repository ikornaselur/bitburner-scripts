import { SERVERS } from "/scripts/constants.js";
import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("getServerMaxMoney");

    ns.print("Copying attack script to servers");
    const results = [];
    for (const server of SERVERS) {
        // Skip the serv-X servers
        if (server.startsWith("serv-")) {
            continue;
        }
        const maxMoney = ns.getServerMaxMoney(server);
        const rootAccess = ns.hasRootAccess(server);
        results.push({
            server,
            maxMoney,
            rootAccess,
        });
    }
    results.sort((a, b) => a.maxMoney - b.maxMoney);

    ns.print("--- No root access ---");
    for (const result of results.filter(res => !res.rootAccess)) {
        ns.print(
            `[${result.server}] ${humanReadableMoney(result.maxMoney)}`
        );
    }

    ns.print("--- With root access ---");
    for (const result of results.filter(res => res.rootAccess)) {
        ns.print(
            `[${result.server}] ${humanReadableMoney(result.maxMoney)}`
        );
    }
}
