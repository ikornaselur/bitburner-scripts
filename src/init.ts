import { NS } from "bitburner";
import { SERVERS_MAP } from "/scripts/constants";
import { humanReadableMoney } from "/scripts/utils/format";

const COST = {
  TOR: 200e3,  // $200k
  BRUTESSH: 500e3,  // $500k
  FTPCRACK: 1500e3, // $1.5m
  RELAYSMTP: 5e6,  // $5m
  HTTPWORM: 30e6,  // $30m
  SQLINJECT: 250e6,  // $250m
}

const waitForMoney = async (ns: NS, amount: number): Promise<void> => {
  ns.print(`Waiting for ${humanReadableMoney(amount)}`);
  while (ns.getServerMoneyAvailable("home") < amount) {
    await ns.sleep(10 * 1000);  // Check every 10 seconds
  }

}

export const main = async (ns: NS): Promise<void> => {
  const charInfo = ns.getPlayer();

  if (!charInfo.tor) {
    await waitForMoney(ns, COST.TOR);
    ns.tprint("INFO Buying TOR router");
    ns.purchaseTor();
  }

  ns.tprint("INFO ensuring root access on all 0-port servers");
  for (const server of SERVERS_MAP[0]) {
    if (!ns.hasRootAccess(server)) {
      ns.nuke(server);
    }
  }

  if (!ns.fileExists("BruteSSH.exe")) {
    await waitForMoney(ns, COST.BRUTESSH);
    ns.tprint("INFO Buying BruteSSH.exe");
    ns.purchaseProgram("BruteSSH.exe");
  } 
  ns.tprint("INFO ensuring root access on all 1-port servers");
  for (const server of SERVERS_MAP[1]) {
    if (!ns.hasRootAccess(server)) {
      ns.brutessh(server);
      ns.nuke(server);
    }
  }

  if (!ns.fileExists("FTPCrack.exe")) {
    await waitForMoney(ns, COST.FTPCRACK);
    ns.tprint("INFO Buying FTPCrack.exe");
    ns.purchaseProgram("FTPCrack.exe");
  } 
  ns.tprint("INFO ensuring root access on all 2-port servers");
  for (const server of SERVERS_MAP[2]) {
    if (!ns.hasRootAccess(server)) {
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.nuke(server);
    }
  }

  if (!ns.fileExists("relaySMTP.exe")) {
    await waitForMoney(ns, COST.RELAYSMTP);
    ns.tprint("INFO Buying relaySMTP.exe");
    ns.purchaseProgram("relaySMTP.exe");
  } 
  ns.tprint("INFO ensuring root access on all 3-port servers");
  for (const server of SERVERS_MAP[3]) {
    if (!ns.hasRootAccess(server)) {
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.relaysmtp(server);
      ns.nuke(server);
    }
  }

  if (!ns.fileExists("HTTPWorm.exe")) {
    await waitForMoney(ns, COST.HTTPWORM);
    ns.tprint("INFO Buying HTTPWorm.exe");
    ns.purchaseProgram("HTTPWorm.exe");
  } 
  ns.tprint("INFO ensuring root access on all 4-port servers");
  for (const server of SERVERS_MAP[4]) {
    if (!ns.hasRootAccess(server)) {
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.relaysmtp(server);
      ns.httpworm(server);
      ns.nuke(server);
    }
  }

  if (!ns.fileExists("SQLInject.exe")) {
    await waitForMoney(ns, COST.SQLINJECT);
    ns.tprint("INFO Buying SQLInject.exe");
    ns.purchaseProgram("SQLInject.exe");
  } 
  ns.tprint("INFO ensuring root access on all 5-port servers");
  for (const server of SERVERS_MAP[5]) {
    if (!ns.hasRootAccess(server)) {
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.relaysmtp(server);
      ns.httpworm(server);
      ns.sqlinject(server);
      ns.nuke(server);
    }
  }
};
