import { SERVERS, NODES } from "/scripts/constants.js";
import { executeAttack, scpAttackScripts } from "/scripts/utils.js";

const CP_SLEEP = 50;

/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

  ns.tprint("Copying attack script to servers");
  for (const server of SERVERS) {
    if (!ns.hasRootAccess(server)) {
      // Skip the servers without root access
      ns.tprint(`ERROR [${server}] No root access!`);
      continue;
    }
    ns.tprint(`INFO [${server}] Copying script`);
    await scpAttackScripts(ns, server);

    const availMem = ns.getServerMaxRam(server);
    executeAttack(ns, server, target, availMem);
    await ns.sleep(CP_SLEEP);
  }

  if (ns.args[1] === "--nodes") {
    for (const node of NODES) {
      if (!ns.serverExists(node)) {
        ns.tprint(`ERROR [${node}] Node is offline`);
        continue;
      }
      ns.tprint(`INFO [${node}] Copying script`);
      await scpAttackScripts(ns, node);

      const availMem = ns.getServerMaxRam(node);
      executeAttack(ns, node, target, availMem);
      await ns.sleep(CP_SLEEP);
    }
  }
}
