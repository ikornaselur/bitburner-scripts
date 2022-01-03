import { SERVERS_MAP } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
  const hackTools = [
    "BruteSSH",
    "FTPCrack",
    "HTTPWorm",
    "SQLInject",
    "relaySMTP",
  ];
  const ownedTools = hackTools.filter((tool) => ns.fileExists(`${tool}.exe`));

  for (let serverIdx = 0; serverIdx < ownedTools.length + 1; serverIdx++) {
    for (const server of SERVERS_MAP[serverIdx]) {
      if (!ns.hasRootAccess(server)) {
        ns.tprint(`[${server}] Getting root access`);
        if (ownedTools.indexOf("BruteSSH") > -1) {
          ns.brutessh(server);
        }
        if (ownedTools.indexOf("FTPCrack") > -1) {
          ns.ftpcrack(server);
        }
        if (ownedTools.indexOf("HTTPWorm") > -1) {
          ns.httpworm(server);
        }
        if (ownedTools.indexOf("SQLInject") > -1) {
          ns.sqlinject(server);
        }
        if (ownedTools.indexOf("relaySMTP") > -1) {
          ns.relaysmtp(server);
        }
        ns.nuke(server);
      }
    }
  }
}
