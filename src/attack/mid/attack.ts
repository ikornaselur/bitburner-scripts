import { NS } from "bitburner";
import { humanReadableMoney } from "/scripts/utils/format";

const getCurrentThreads = (ns: NS): number => {
  const ps = ns.ps(ns.getHostname());
  const current = ps.filter(
    (process) => process.filename.indexOf("mid/attack.js") > -1
  )[0];
  return current.threads;
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
  const hostname = ns.getHostname();

  const minSecurity = ns.getServerMinSecurityLevel(target) + 10;
  const maxMoney = ns.getServerMaxMoney(target);

  while (true) {
    // Maximize the money
    let currentMoney = ns.getServerMoneyAvailable(target);
    while (currentMoney < maxMoney) {
      let secLevel = ns.getServerSecurityLevel(target);
      while (secLevel > minSecurity) {
        ns.print(
          `[${hostname}] Security level (${secLevel}) above min (${minSecurity}). Dropping...`
        );
        await ns.weaken(target);
        secLevel = ns.getServerSecurityLevel(target);
      }

      // Get required threads for 100% growth
      const requiredThreads = ns.growthAnalyze(target, 100, 1);

      ns.print(
        `[${hostname}] Current money (${humanReadableMoney(
          currentMoney
        )}) is less than max (${humanReadableMoney(
          maxMoney
        )}), increasing with ${requiredThreads} threads`
      );
      await ns.grow(target, {
        threads: Math.min(requiredThreads, getCurrentThreads(ns)),
      });
      currentMoney = ns.getServerMoneyAvailable(target);
    }
    ns.print(`[${hostname}] Money at ${humanReadableMoney(currentMoney)}`);

    // Figure out number of threads to steal 50% of the money
    const requiredHackThreads = ns.hackAnalyzeThreads(target, maxMoney / 2);
    // Run the attack
    ns.print(
      `[${hostname}] Hacking with ${requiredHackThreads} threads for 50% of the money`
    );
    const stolen = await ns.hack(target, {
      threads: Math.min(requiredHackThreads, getCurrentThreads(ns)),
    });
    if (stolen > 0) {
      ns.tprint(
        `SUCCESS [${hostname}] $$$ Stole ${humanReadableMoney(stolen)} $$$`
      );
    } else {
      ns.tprint(`WARN [${hostname}] Failed a hacking attempt`);
    }
  }
};
