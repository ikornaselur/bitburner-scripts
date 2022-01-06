import { humanReadableMoney } from '/scripts/utils.js';


/** @param {NS} ns **/
export async function main(ns) {
  const doc = globalThis['document'];
  const target = ns.args[0];

  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');

  const minSec = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  while (true) {
    try {
      const headers = []
      const values = [];

      // Server
      headers.push("Server");
      values.push(target);

      // Security level
      headers.push("Sec");
      const sec = ns.getServerSecurityLevel(target);
      values.push(`${sec.toFixed(1)}/${minSec}`);

      // Cash
      headers.push("$$$");
      const money = ns.getServerMoneyAvailable(target);
      values.push(`${humanReadableMoney(money)}/${humanReadableMoney(maxMoney)}`);

      hook0.innerText = headers.join(" \n");
      hook1.innerText = values.join("\n");
    } catch (err) {
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}
