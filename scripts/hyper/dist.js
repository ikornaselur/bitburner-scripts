const HACK = '/scripts/hyper/hack.js';

function getAvailableRam(ns) {
    // Calculate number of threads possible for weaken
    const hostname = ns.getHostname();
    const maxRam = ns.getServerMaxRam(hostname);
    const usedRam = ns.getServerUsedRam(hostname);
    return maxRam - usedRam - 5;  // Leave ~5GB additional for ad-hoc scripts
}


/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

  const minSecurity = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  while (true) {
    // Times in milliseconds
    const hackTime = ns.getHackTime(target);

    const hackThreads = ns.hackAnalyzeThreads(target, maxMoney / 2);
    ns.print("hackThreads: ", hackThreads);

    const availableRam = getAvailableRam(ns);
    ns.print("availableRam: ", availableRam);

    const hackRam = hackThreads * ns.getScriptRam(HACK);
    ns.print("hackRam: ", hackRam);

    if (ns.getServerMoneyAvailable(target) < maxMoney) {
      await ns.sleep(1000);
      continue;
    }
    if (hackRam > availableRam || ns.getServerSecurityLevel(target) > minSecurity + 5) {
      await ns.sleep(1000);
      continue;
    }
    ns.run(HACK, hackThreads, target);
    await ns.sleep(hackTime + 10);
  }
}
