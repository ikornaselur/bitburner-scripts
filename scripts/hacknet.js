import { humanReadableMoney } from "/scripts/utils.js";

const MAX_NODES = 100;
const MAX_LEVEL = 200;
const MAX_RAM = 64; // GB
const MAX_CORES = 16;

/** @param {NS} ns **/
export async function main(ns) {
  // Make sure we have the number of nodes, if specified
  const nodes = parseInt(ns.args[0]);
  if (Number.isInteger(nodes)) {
    const newNodes = Math.min(nodes, MAX_NODES) - ns.hacknet.numNodes();

    if (newNodes > 0) {
      ns.tprint(`Buying ${newNodes} nodes`);
      for (let i = 0; i < newNodes; i++) {
        const cost = ns.hacknet.getPurchaseNodeCost();
        const cash = ns.getServerMoneyAvailable("home");

        ns.tprint(`Purchasing Hacknet node for ${humanReadableMoney(cost)}`);
        if (cost > cash) {
          ns.tprint("Can't afford a new hacknode server!");
          break;
        }
        ns.hacknet.purchaseNode();
        await ns.sleep(10);
      }
    }
  }

  // Make sure all the nodes are upgraded
  const numNodes = ns.hacknet.numNodes();
  for (let i = 0; i < numNodes; i++) {
    const stat = ns.hacknet.getNodeStats(i);

    const levelUpgrades = MAX_LEVEL - stat.level;
    const ramUpgrades = MAX_RAM - stat.ram;
    const coreUpgrades = MAX_CORES - stat.cores;

    if (levelUpgrades + ramUpgrades + coreUpgrades > 0) {
      ns.tprint(`Upgrading Hacknet node #${i}`);

      ns.hacknet.upgradeLevel(i, levelUpgrades);
      ns.hacknet.upgradeRam(i, ramUpgrades);
      ns.hacknet.upgradeCore(i, coreUpgrades);
    }

    await ns.sleep(10);
  }
}
