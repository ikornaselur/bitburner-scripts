import { humanReadableMoney } from '/scripts/utils.js';

const WEAKEN = '/scripts/hyper/weaken.js';
const GROW = '/scripts/hyper/grow.js';
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
  const hostname = ns.getHostname();
  const target = ns.args[0];
  let sequential = ns.args[1] === '--sequential';

  const cores = ns.getServer().cpuCores;


  const minSecurity = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  let prepped = false;
  while (!prepped) {
    prepped = true;
    // Prep the server to min security
    while (ns.getServerSecurityLevel(target) > minSecurity + 5) {
      prepped = false;
      const weakenTime = ns.getWeakenTime(target);
      // Run with max threads possible
      const weakenThreads = Math.floor(getAvailableRam(ns) / ns.getScriptRam(WEAKEN));

      ns.run(WEAKEN, weakenThreads, target);
      await ns.sleep(weakenTime + 10);
    }

    // Prep max money, buy only one round before weakening again to be safe
    if (ns.getServerMoneyAvailable(target) < maxMoney) {
      prepped = false;
      const growTime = ns.getGrowTime(target);
      // Cap the threads to max ram
      const maxGrowThreads = Math.floor(getAvailableRam(ns) / ns.getScriptRam(GROW));
      const growThreads = Math.min(ns.growthAnalyze(target, 100, cores), maxGrowThreads);

      ns.run(GROW, growThreads, target);
      await ns.sleep(growTime + 10);
    }
  }

  while (true) {
    // Times in milliseconds
    const growTime = ns.getGrowTime(target);
    const hackTime = ns.getHackTime(target);
    const weakenTime = ns.getWeakenTime(target);

    // Time so that hack finishes right before grow and then weaken

    if (hackTime > growTime || growTime > weakenTime) {
      ns.tprint("!!!")
      ns.exit();
    }

    ns.print("--------");
    ns.print(`Security: ${ns.getServerSecurityLevel(target)} (min: ${minSecurity})`);
    ns.print(`Money: ${humanReadableMoney(ns.getServerMoneyAvailable(target))} (max: ${humanReadableMoney(maxMoney)})`);

    const growThreads = ns.growthAnalyze(target, 100, cores);
    const hackThreads = ns.hackAnalyzeThreads(target, maxMoney / 2);

    const availableRam = getAvailableRam(ns);
    ns.print("availableRam: ", availableRam);

    const growRam = growThreads * ns.getScriptRam(GROW);
    ns.print("growRam: ", growRam);
    const hackRam = hackThreads * ns.getScriptRam(HACK);
    ns.print("hackRam: ", hackRam);
    const weakenRam = availableRam - growRam - hackRam;
    ns.print("weakenRam: ", weakenRam);

    if (!sequential) {
      if (weakenRam < availableRam * 0.2) {
        ns.tprint(`[${hostname}] Not enough RAM to parallel attack server!`)
        ns.tprint(`[${hostname}] Switching to sequential mode`);
        sequential = true;
        continue;
      }

      const weakenThreads = Math.floor(weakenRam / ns.getScriptRam(WEAKEN));
      ns.print("weakenThreads: ", weakenThreads);

      ns.run(WEAKEN, weakenThreads, target);
      ns.run(GROW, growThreads, target);
      ns.run(HACK, hackThreads, target, Math.max(1, Math.floor(weakenTime / hackTime)));

      await ns.sleep(weakenTime + 10);
    } else {
      ns.run(HACK, hackThreads, target);
      await ns.sleep(hackTime + 10);

      while (ns.getServerSecurityLevel(target) > minSecurity + 10) {
        const weakenTimeSeq = ns.getWeakenTime(target);
        // Run with max threads possible
        const weakenThreadsSeq = Math.floor(getAvailableRam(ns) / ns.getScriptRam(WEAKEN));

        ns.run(WEAKEN, weakenThreadsSeq, target);
        await ns.sleep(weakenTimeSeq + 10);
      }
      while (ns.getServerMoneyAvailable(target) < maxMoney) {
        const growTimeSeq = ns.getGrowTime(target);
        // Cap the threads to max ram
        const maxGrowThreads = Math.floor(getAvailableRam(ns) / ns.getScriptRam(GROW));
        const growThreadsSeq = Math.min(ns.growthAnalyze(target, 100, cores), maxGrowThreads);

        ns.run(GROW, growThreadsSeq, target);
        await ns.sleep(growTimeSeq + 10);
      }
    }
  }
}
