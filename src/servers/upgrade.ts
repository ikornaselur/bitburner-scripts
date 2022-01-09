import { NS } from 'bitburner';
import { NODES } from "/scripts/constants";
import {
  humanReadableMoney,
  humanReadableRAM,
} from "/scripts/utils/format";

const getLowestSpec = (ns: NS): { server: string; lowestRAM: number; } => {
  let i = 0;
  let lowestRAM = 1024 * 1024;
  let server = NODES[i];

  let result = { server, lowestRAM };

  while (ns.serverExists(server)) {
    const RAM = ns.getServerMaxRam(server);
    if (RAM < lowestRAM) {
      lowestRAM = RAM;
      result = { server, lowestRAM };
    }

    i++;
    server = NODES[i];
  }

  return result;
}

/** @param {NS} ns **/
export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "number") {
    ns.tprint("Usage: upgrade.js <RAM> [TB]")
    ns.tprint("Example: upgrade.js 64 -> Upgrades servers to at least 64GB")
    ns.tprint("Example: upgrade.js 32 TB -> Upgrades servers to at least 32TB")
    return ns.exit();
  }

  let RAM = ns.args[0];
  if (ns.args[1] === "TB") {
    RAM *= 1024;
  }

  // Store cost of the server
  const serverCost = ns.getPurchasedServerCost(RAM);
  if (serverCost === Infinity) {
    ns.tprint("Invalid RAM value");
    ns.exit();
  }

  while (true) {
    const lowestSpec = getLowestSpec(ns);
    if (lowestSpec.lowestRAM === RAM) {
      ns.print(`All servers are are goal RAM: ${RAM}`);
      break;
    }
    ns.tprint(
      `Got server (${lowestSpec.server}) with ${humanReadableRAM(
        lowestSpec.lowestRAM
      )} RAM`
    );
    ns.tprint(`Upgrading to ${humanReadableRAM(RAM)}`);
    ns.tprint(
      `${humanReadableRAM(RAM)} server cost: ${humanReadableMoney(serverCost)}`
    );

    while (ns.getServerMoneyAvailable("home") < serverCost) {
      ns.print("Can't afford new server, sleeping for 60 seconds...");
      await ns.sleep(1000 * 60);
    }
    const hostname = lowestSpec.server;
    ns.tprint(`Deleting old server: ${hostname}`);
    ns.killall(hostname);
    ns.deleteServer(hostname);

    ns.tprint(`Purchasing server: ${hostname}`);
    ns.purchaseServer(hostname, RAM);

    await ns.sleep(200);
  }
}
