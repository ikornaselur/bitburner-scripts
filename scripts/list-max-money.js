import { SERVERS } from "/scripts/constants.js";
import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("getServerMaxMoney");

  const userHackingLevel = ns.getHackingLevel();
  const results = [];

  for (const server of SERVERS) {
    // Skip the serv-X servers
    if (server.startsWith("serv-")) {
      continue;
    }
    const maxMoney = ns.getServerMaxMoney(server);
    const serverHackingLevel = ns.getServerRequiredHackingLevel(server);
    results.push({
      server,
      maxMoney,
      hackingLevel: serverHackingLevel,
    });
  }
  results.sort((a, b) => a.maxMoney - b.maxMoney);

  ns.tprint("--- Not hackable ---");
  for (const result of results.filter(
    (res) => res.hackingLevel > userHackingLevel
  )) {
    ns.tprint(
      `${humanReadableMoney(result.maxMoney)}\t${result.hackingLevel}\t${
        result.server
      }`
    );
  }

  ns.tprint("--- Hackable ---");
  for (const result of results.filter(
    (res) => res.hackingLevel <= userHackingLevel
  )) {
    ns.tprint(
      `${humanReadableMoney(result.maxMoney)}\t${result.hackingLevel}\t${
        result.server
      }`
    );
  }
}
