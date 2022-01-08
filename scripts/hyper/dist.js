const HACK = "/scripts/hyper/hack.js";

function getAvailableRam(ns) {
  // Calculate number of threads possible for weaken
  const hostname = ns.getHostname();
  const maxRam = ns.getServerMaxRam(hostname);
  const usedRam = ns.getServerUsedRam(hostname);
  return maxRam - usedRam - 5; // Leave ~5GB additional for ad-hoc scripts
}

const MONEY_THRESH = 0.75;

/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

  const minSecurity = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  while (true) {
    // Times in milliseconds
    const hackTime = ns.getHackTime(target);

    const availableRam = getAvailableRam(ns);
    ns.print("availableRam: ", availableRam);

    const maxThreads = Math.floor(availableRam / ns.getScriptRam(HACK));

    const hackThreads = Math.min(ns.hackAnalyzeThreads(target, maxMoney / 2), maxThreads);
    ns.print("hackThreads: ", hackThreads);

    const hackRam = hackThreads * ns.getScriptRam(HACK);
    ns.print("hackRam: ", hackRam);

    if (ns.getServerMoneyAvailable(target) < maxMoney * MONEY_THRESH) {
      ns.print("WARN Not enough money available");
      await ns.sleep(1000);
      continue;
    }
    if (hackRam > availableRam) {
      ns.print("ERROR Not enough ram available to hack!");
      await ns.sleep(1000);
      continue;
    }
    if (ns.getServerSecurityLevel(target) > minSecurity * 3) {
      ns.print("WARN Server security level too high");
      await ns.sleep(1000);
      continue;
    }
    ns.run(HACK, hackThreads, target);
    await ns.sleep(hackTime + 10);
  }
}
