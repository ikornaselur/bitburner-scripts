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

                ns.tprint(
                    `Purchasing Hacknet node for ${humanReadableMoney(cost)}`
                );
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
        ns.tprint(`Upgrading Hacknet node #${i}`);
        const stat = ns.hacknet.getNodeStats(i);
        ns.hacknet.upgradeLevel(i, MAX_LEVEL - stat.level);
        ns.hacknet.upgradeRam(i, MAX_RAM - stat.ram);
        ns.hacknet.upgradeCore(i, MAX_CORES - stat.cores);
        await ns.sleep(10);
    }
}
