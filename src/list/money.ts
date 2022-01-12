import { NS } from "bitburner";
import { SERVERS, NODES } from "/scripts/constants";
import { humanReadableMoney } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  ns.disableLog("getServerMaxMoney");

  const userHackingLevel = ns.getHackingLevel();
  const results: Array<{
    server: string;
    maxMoney: number;
    hackingLevel: number;
  }> = [];

  for (const server of SERVERS) {
    // Skip the serv-X servers
    if (NODES.indexOf(server) > -1) {
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
};
