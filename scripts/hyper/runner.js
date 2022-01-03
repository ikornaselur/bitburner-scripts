import { humanReadableMoney } from '/scripts/utils.js';

const WEAKEN = '/scripts/hyper/weaken.js';
const GROW = '/scripts/hyper/grow.js';
const HACK = '/scripts/hyper/hack.js';


/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

  const minSecurity = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  // Prep the server to min security
  while (ns.getServerSecurityLevel(target) > minSecurity) {
    await ns.weaken(target);
  }
  // Prep max money
  while (ns.getServerMoneyAvailable(target) < maxMoney) {
    await ns.grow(target);
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

    ns.print(`Security: ${ns.getServerSecurityLevel(target)} (min: ${minSecurity})`);
    ns.print(`Money: ${humanReadableMoney(ns.getServerMoneyAvailable(target))} (max: ${humanReadableMoney(maxMoney)})`);

    const weakenThreads = 20000;  // TODO
    const growThreads = ns.growthAnalyze(target, 100);
    const hackThreads = ns.hackAnalyzeThreads(target, maxMoney / 2);

    ns.run(WEAKEN, weakenThreads, target);
    ns.run(GROW, growThreads, target);
    ns.run(HACK, hackThreads, target);

    await ns.sleep(weakenTime + 10);
  }
}
