import { NS } from "bitburner";
import { updateStatus } from "/scripts/utils/status";

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("Usage: attack.js <target>");
    ns.tprint("Example: attack.js n00dles -> Runs weaken and grow on n00dles");
    return ns.exit();
  }

  const target = ns.args[0];

  const securityThresh = ns.getServerMinSecurityLevel(target);
  ns.print(`Security threshold set to ${securityThresh}`);

  while (true) {
    const secLvl = ns.getServerSecurityLevel(target);
    ns.print("-------------------");
    ns.print(`Security Level: ${secLvl.toFixed(1)}`);

    if (secLvl > securityThresh) {
      ns.print(`Weaking system until security below ${securityThresh}...`);
      await updateStatus(ns, ns.getHostname(), "Weakening");
      await ns.weaken(target);
      await updateStatus(ns, ns.getHostname(), "Idling");
    } else {
      ns.print("Growing money!");
      await updateStatus(ns, ns.getHostname(), "Growing");
      await ns.grow(target);
      await updateStatus(ns, ns.getHostname(), "Idling");
    }
  }
};
