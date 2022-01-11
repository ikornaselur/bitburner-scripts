import { NS } from "bitburner";
import { SERVERS, NODES } from "/scripts/constants.js";

const ATTACK_SRC = "/scripts/attack/early/attack.js";
const STATUS_SRC = "/scripts/utils/status.js";

const scpAttackScripts = async (ns: NS, server: string): Promise<void> => {
  await ns.scp([STATUS_SRC, ATTACK_SRC], "home", server);
};

const executeAttack = (
  ns: NS,
  server: string,
  target: string,
  ram: number,
  killall = true
): void => {
  const attackRamReq = ns.getScriptRam(ATTACK_SRC);
  const threads = Math.floor(ram / attackRamReq);

  if (killall) {
    ns.killall(server);
  }

  if (threads <= 0) {
    return;
  }

  ns.exec(ATTACK_SRC, server, threads, target);
};

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("Usage: cp.js <target>");
    ns.tprint(
      "Example: cp.js n00dles -> Copies attack scripts to nodes and attacks n00dles"
    );
    return ns.exit();
  }

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
    await ns.sleep(10);
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
      await ns.sleep(10);
    }
  }
};
