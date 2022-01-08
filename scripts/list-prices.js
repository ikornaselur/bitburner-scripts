import { humanReadableMoney, humanReadableRAM } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
  for (let ram = 1; ram < 2**21; ram *= 2) {
    const serverCost = ns.getPurchasedServerCost(ram);
    ns.tprint(
      `INFO ${humanReadableRAM(ram, 0)} server cost: ${humanReadableMoney(serverCost)}`
    );
  }
}
