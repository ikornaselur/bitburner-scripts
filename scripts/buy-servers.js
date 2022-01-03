import { PREFIX } from "/scripts/constants.js";
import { humanReadableMoney, humanReadableRAM } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
  const RAM = parseInt(ns.args[0]) * 1024; // In GB

  // Store cost of the server
  const serverCost = ns.getPurchasedServerCost(RAM);
  if (serverCost === Infinity) {
    ns.tprint("Invalid RAM value");
    ns.exit();
  }
  ns.tprint(
    `${humanReadableRAM(RAM)} server cost: ${humanReadableMoney(serverCost)}`
  );

  // Base server idx
  let i = 0;
  // Skip servers that already exist
  while (ns.serverExists(`${PREFIX}${i}`)) {
    ns.tprint(`${PREFIX}${i} already exists, skipping...`);
    i++;
  }

  while (i < ns.getPurchasedServerLimit()) {
    if (ns.getServerMoneyAvailable("home") < serverCost) {
      ns.print("Can't afford new server, sleeping for 60 seconds...");
      await ns.sleep(60 * 1000);
    } else {
      const hostname = `${PREFIX}${i}`;
      ns.tprint(`Purchasing server: ${hostname}`);
      ns.purchaseServer(hostname, RAM);

      i++;
    }
  }
}
