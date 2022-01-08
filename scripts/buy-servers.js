import { NODES } from "/scripts/constants.js";
import { humanReadableMoney, humanReadableRAM } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
  let RAM = parseInt(ns.args[0]); // GB
  if (ns.args[1] === "TB") {
    RAM *= 1024;
  }

  // Store cost of the server
  const serverCost = ns.getPurchasedServerCost(RAM);
  if (serverCost === Infinity) {
    ns.tprint("ERROR Invalid RAM value");
    ns.exit();
  }
  ns.tprint(
    `${humanReadableRAM(RAM)} server cost: ${humanReadableMoney(serverCost)}`
  );

  // Base server idx
  let i = 0;
  // Skip servers that already exist
  while (ns.serverExists(NODES[i])) {
    ns.tprint(`INFO ${NODES[i]} already exists, skipping...`);
    i++;
  }

  while (i < ns.getPurchasedServerLimit()) {
    const currentMoney = ns.getServerMoneyAvailable("home");
    if (currentMoney < serverCost) {
      ns.print(
        `${humanReadableMoney(currentMoney)} < ${humanReadableMoney(
          serverCost
        )}`
      );
      ns.print("Can't afford new server, sleeping for 10 seconds...");
      await ns.sleep(10 * 1000);
    } else {
      const hostname = NODES[i];
      ns.tprint(`SUCCESS Purchasing server: ${hostname}`);
      ns.purchaseServer(hostname, RAM);

      i++;
    }
  }
}
