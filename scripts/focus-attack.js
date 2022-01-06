import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
function getCurrentThreads(ns) {
  let ps = ns.ps(ns.getHostname());
  let current = ps.filter(
    (process) => process.filename.indexOf("focus-attack.js") > -1
  )[0];
  return current.threads;
}

/** @param {NS} ns **/
export async function main(ns) {
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
      ns.tprint(`[${hostname}] $$$ Stole ${humanReadableMoney(stolen)} $$$`);
    }
  }
}
