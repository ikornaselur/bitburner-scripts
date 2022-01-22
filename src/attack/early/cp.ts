import { NS } from "bitburner";
import { SERVERS, NODES } from "/scripts/constants.js";

const ATTACK_SRC = "/scripts/attack/early/attack.js";
const CONSTANTS_SRC = "/scripts/constants.js";
const STATUS_SRC = "/scripts/utils/status.js";

const scpAttackScripts = async (ns: NS, server: string): Promise<void> => {
  await ns.scp([STATUS_SRC, CONSTANTS_SRC, ATTACK_SRC], "home", server);
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
  const flags = ns.flags([
    ["verbose", false],
    ["nodes", false],
  ]);
  const target = flags["_"][0];
  if (typeof target !== "string") {
    ns.tprint("Usage: cp.js <target>");
    ns.tprint(
      "Example: cp.js n00dles -> Copies attack scripts to nodes and attacks n00dles"
    );
    return ns.exit();
  }

  ns.tprint("Copying attack script to servers");
  for (const server of SERVERS) {
    if (!ns.hasRootAccess(server)) {
      if (flags.verbose) {
        // Skip the servers without root access
        ns.tprint(`ERROR [${server}] No root access!`);
      }
      continue;
    }
    ns.tprint(`INFO [${server}] Copying script`);
    await scpAttackScripts(ns, server);

    const availMem = ns.getServerMaxRam(server);
    executeAttack(ns, server, target, availMem);
    await ns.sleep(10);
  }

  if (flags.nodes) {
    for (const node of NODES) {
      if (!ns.serverExists(node)) {
        if (flags.verbose) {
          ns.tprint(`ERROR [${node}] Node is offline`);
        }
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
