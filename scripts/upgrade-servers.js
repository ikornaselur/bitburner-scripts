import { TARGETS, PREFIX } from "/scripts/constants.js";
import {
    humanReadableMoney,
    humanReadableRAM,
    executeAttack,
    scpAttackScripts,
} from "/scripts/utils.js";

/** @param {NS} ns **/
function getLowestSpec(ns) {
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
    const RAM = parseInt(ns.args[0]) * 1024; // GB
    // Store cost of the server
    const serverCost = ns.getPurchasedServerCost(RAM);

    while (true) {
        const lowestSpec = getLowestSpec(ns);
        if (lowestSpec.lowestRAM === RAM) {
            ns.print(`All servers are are goal RAM: ${RAM}`);
            break;
        }
        ns.tprint(
            `Got server (${lowestSpec.server}) with ${humanReadableRAM(
                lowestSpec.lowestRAM
            )} RAM`
        );
        ns.tprint(`Upgrading to ${humanReadableRAM(RAM)}`);
        ns.tprint(
            `${humanReadableRAM(RAM)} server cost: ${humanReadableMoney(
                serverCost
            )}`
        );

        while (ns.getServerMoneyAvailable("home") < serverCost) {
            ns.print("Can't afford new server, sleeping for 60 seconds...");
            await ns.sleep(1000 * 60);
        }
        const hostname = lowestSpec.server;
        ns.tprint(`Deleting old server: ${hostname}`);
        ns.killall(hostname);
        ns.deleteServer(hostname);

        ns.tprint(`Purchasing server: ${hostname}`);
        ns.purchaseServer(hostname, RAM);
        await scpAttackScripts(ns, hostname);

        executeAttack(ns, hostname, TARGETS, RAM);
        await ns.sleep(200);
    }
}
