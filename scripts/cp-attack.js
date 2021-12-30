import {
    ATTACK_THRESH,
    SERVERS,
    TARGET,
    RAM_REQUIREMENTS,
} from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");

    ns.print("Copying attack script to servers");
    for (const server of SERVERS) {
        ns.print(`[${server}] Checking server...`);
        if (!ns.hasRootAccess(server)) {
            // Skip the servers without root access
            ns.print(`[${server}] No root access!`);
            continue;
        }
        ns.print(`[${server}] Copying script`);
        await ns.scp(["/scripts/utils.js", "/scripts/attack.js"], server);

        const availMem = ns.getServerMaxRam(server);
        let threads = Math.floor(availMem / RAM_REQUIREMENTS);

        if (threads > 100) {
            threads -= 10;
        } else if (threads < 1) {
            continue;
        }

        ns.killall(server);
        ns.exec(
            "/scripts/attack.js",
            server,
            threads,
            TARGET,
            "--moneyThresh",
            ATTACK_THRESH
        );

        ns.print("-------------------");
    }

    // Copy to the serv-X servers
    let i = 0;
    let server = `serv-${i}`;
    while (ns.serverExists(server)) {
        await ns.scp(["/scripts/utils.js", "/scripts/attack.js"], server);

        const availMem = ns.getServerMaxRam(server);
        let threads = Math.floor(availMem / RAM_REQUIREMENTS);

        if (threads > 100) {
            threads -= 10;
        } else if (threads < 1) {
            continue;
        }

        ns.killall(server);
        ns.exec(
            "/scripts/attack.js",
            server,
            threads,
            TARGET,
            "--moneyThresh",
            ATTACK_THRESH
        );

        ns.print("-------------------");

        i++;
        server = `serv-${i}`;
    }
}
