import { SERVERS } from "/scripts/constants.js";
import { executeAttack, scpAttackScripts } from "/scripts/utils.js";

const CP_SLEEP = 50;

/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];
  const home = ns.args[1] === "--home";

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

  // Copy to the serv-X servers
  let i = 0;
  let server = `serv-${i}`;
  while (ns.serverExists(server)) {
    ns.tprint(`[${server}] Copying script`);
    await scpAttackScripts(ns, server);

    const availMem = ns.getServerMaxRam(server);
    executeAttack(ns, server, target, availMem);
    ns.tprint("-------------------");

    i++;
    server = `serv-${i}`;
    await ns.sleep(CP_SLEEP);
  }

  if (home) {
    // Execute attack on home as well
    const homeMem = ns.getServerMaxRam("home");
    for (const process of ns.ps("home")) {
      if (process.filename.indexOf("/scripts/attack.js") > -1) {
        ns.kill(process.pid, "home");
      }
    }
    executeAttack(ns, "home", target, homeMem, false);
  }
}
