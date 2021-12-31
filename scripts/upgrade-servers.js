import { TARGETS, RAM, PREFIX } from "/scripts/constants.js";
import {
    humanReadableMoney,
    humanReadableRAM,
    executeAttack,
} from "/scripts/utils.js";

/** @param {NS} ns **/
function getLowestSpec(ns) {
    ns.disableLog("getServerMaxRam");
    let i = 0;
    let lowestRAM = 1024 * 1024;
    let server = `${PREFIX}${i}`;

    let result = { server, lowestRAM };

    while (ns.serverExists(server)) {
        let RAM = ns.getServerMaxRam(server);
        if (RAM < lowestRAM) {
            lowestRAM = RAM;
            result = { server, lowestRAM };
        }

        i++;
        server = `${PREFIX}${i}`;
    }

    return result;
}

/** @param {NS} ns **/
export async function main(ns) {
    const lowestSpec = getLowestSpec(ns);

    if (lowestSpec.lowestRAM === RAM) {
        ns.print(`All servers are are goal RAM: ${RAM}`);
        return;
    }
    ns.print(
        `Got server (${lowestSpec.server}) with ${humanReadableRAM(
            lowestSpec.lowestRAM
        )} RAM`
    );
    ns.print(`Upgrading to ${humanReadableRAM(RAM)}`);

    // Store cost of the server
    const serverCost = ns.getPurchasedServerCost(RAM);
    ns.print(
        `${humanReadableRAM(RAM)} server cost: ${humanReadableMoney(
            serverCost
        )}`
    );

    let success = false;

    while (!success) {
        if (ns.getServerMoneyAvailable("home") < serverCost) {
            ns.print("Can't afford new server, aborting...");
            return;
        }
        const hostname = lowestSpec.server;
        ns.print(`Deleting old server: ${hostname}`);
        ns.killall(hostname);
        ns.deleteServer(hostname);

        ns.print(`Purchasing server: ${hostname}`);
        ns.purchaseServer(hostname, RAM);
        await ns.scp(["/scripts/attack.js", "/scripts/utils.js"], hostname);

        executeAttack(ns, hostname, TARGETS, RAM);
        success = true;
    }
}
