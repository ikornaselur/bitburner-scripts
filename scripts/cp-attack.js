import { SERVERS, TARGETS } from "/scripts/constants.js";
import { executeAttack, scpAttackScripts } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("DEPRECATED!!");
    ns.exit();
    ns.tprint("Copying attack script to servers");
    for (const server of SERVERS) {
        ns.tprint(`[${server}] Checking server...`);
        if (!ns.hasRootAccess(server)) {
            // Skip the servers without root access
            ns.tprint(`[${server}] No root access!`);
            continue;
        }
        ns.tprint(`[${server}] Copying script`);
        await scpAttackScripts(ns, server);

        const availMem = ns.getServerMaxRam(server);
        executeAttack(ns, server, TARGETS, availMem);
        ns.tprint("-------------------");
        await ns.sleep(200);
    }

    // Copy to the serv-X servers
    let i = 0;
    let server = `serv-${i}`;
    while (ns.serverExists(server)) {
        await scpAttackScripts(ns, server);

        const availMem = ns.getServerMaxRam(server);
        executeAttack(ns, server, TARGETS, availMem);
        ns.tprint("-------------------");

        i++;
        server = `serv-${i}`;
        await ns.sleep(200);
    }

    // Execute attack on home as well
    const homeMem = ns.getServerMaxRam("home");
    for (const process of ns.ps("home")) {
        if (process.filename.indexOf("/scripts/attack.js") > -1) {
            ns.kill(process.pid, "home");
        }
    }
    executeAttack(ns, "home", TARGETS, homeMem, false);
}
