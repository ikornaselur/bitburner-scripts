import { PREFIX } from "/scripts/constants.js";
import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    const RAM = parseInt(ns.args[0]) * 1024; // In GB

    // Base server idx
    let i = 0;
    // Skip servers that already exist
    while (ns.serverExists(`${PREFIX}${i}`)) {
        ns.tprint(`${PREFIX}${i} already exists, skipping...`);
        i++;
    }
    // Store cost of the server
    const serverCost = ns.getPurchasedServerCost(RAM);
    ns.tprint(`${RAM}GB server cost: ${humanReadableMoney(serverCost)}`);

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") < serverCost) {
            ns.print("Can't afford new server, sleeping for 60 seconds...");
            await ns.sleep(60 * 1000);
        } else {
            const hostname = `${PREFIX}${i}`;
            ns.tprint(`Purchasing server: ${hostname}`);
            ns.purchaseServer(hostname, RAM);

            i++;
        }
    }
}
