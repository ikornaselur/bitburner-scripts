import { ATTACK_THRESH, TARGET, RAM_REQUIREMENTS } from "/scripts/constants.js";
import { humanReadableMoney } from "/scripts/utils.js";

/* Rough prices
 * 512GB ~$28m
 * 1TB ~$56m
 * 2TB ~$112m
 * 4TB ~$224m
 * 8TB ~$448m
 */

/** @param {NS} ns **/
export async function main(ns) {
    const prefix = "serv-";
    const ram = 1024; // ~$56m

    // Base server idx
    let i = 0;
    // Skip servers that already exist
    while (ns.serverExists(`${prefix}${i}`)) {
        ns.print(`${prefix}${i} already exists, skipping...`);
        i++;
    }
    // Store cost of the server
    const serverCost = ns.getPurchasedServerCost(ram);
    ns.print(`${ram}GB server cost: ${humanReadableMoney(serverCost)}`);

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") < serverCost) {
            ns.print("Can't afford new server, sleeping for 60 seconds...");
            await ns.sleep(60 * 1000);
        } else {
            const hostname = `${prefix}${i}`;
            ns.print(`Purchasing server: ${hostname}`);
            ns.purchaseServer(hostname, ram);
            await ns.scp(["/scripts/attack.js", "/scripts/utils.js"], hostname);

            const threads = Math.floor(ram / RAM_REQUIREMENTS);
            ns.exec(
                "/scripts/attack.js",
                hostname,
                threads,
                TARGET,
                "--moneyThresh",
                ATTACK_THRESH
            );

            i++;
        }
    }
}
