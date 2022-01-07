import { SERVERS } from "/scripts/constants.js";
import { executeAttack, scpAttackScripts } from "/scripts/utils.js";

const CP_SLEEP = 50;

/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

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
    executeAttack(ns, server, target, availMem);
    ns.tprint("-------------------");
    await ns.sleep(CP_SLEEP);
  }
}
