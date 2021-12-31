import { SERVERS, TARGETS } from "/scripts/constants.js";
import { executeAttack, scpAttackScripts } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.print("Copying attack script to servers");
    for (const server of SERVERS) {
        ns.print(`[${server}] Checking server...`);
        if (!ns.hasRootAccess(server)) {
            // Skip the servers without root access
            ns.print(`[${server}] No root access!`);
            continue;
        }
        ns.print(`[${server}] Copying script`);
        await scpAttackScripts(ns, server);

        const availMem = ns.getServerMaxRam(server);
        executeAttack(ns, server, TARGETS, availMem);
        ns.print("-------------------");
    }

    // Copy to the serv-X servers
    let i = 0;
    let server = `serv-${i}`;
    while (ns.serverExists(server)) {
        await scpAttackScripts(ns, server);

        const availMem = ns.getServerMaxRam(server);
        executeAttack(ns, server, TARGETS, availMem);
        ns.print("-------------------");

        i++;
        server = `serv-${i}`;
    }

    // Execute attack on home as well
    const homeMem = ns.getServerMaxRam("home");
    ns.kill('attack.js', "home");
    executeAttack(ns, "home", TARGETS, homeMem, false);
}
