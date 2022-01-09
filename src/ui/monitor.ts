import { NS } from "bitburner";
import { humanReadableMoney, humanReadable } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("Usage: monitor.js <target>");
    return ns.exit();
  }
  const doc = globalThis["document"];
  const target = ns.args[0];

  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");

  const minSec = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  if (!hook0 || !hook1) {
    ns.tprint("ERROR unable to get hooks");
    return ns.exit();
  }

  while (true) {
    try {
      const headers: Array<string> = [];
      const values: Array<string> = [];

      // Server
      headers.push("Server");
      values.push(target);

      // Security level
      headers.push("Sec");
      const sec = ns.getServerSecurityLevel(target);
      values.push(`${sec.toFixed(1)}/${minSec.toFixed(1)}`);

      // Cash
      headers.push("$$$");
      const money = ns.getServerMoneyAvailable(target);
      values.push(
        `${humanReadableMoney(money)}/${humanReadableMoney(maxMoney)}`
      );

      // Income
      headers.push("Income");
      values.push(`${humanReadableMoney(ns.getScriptIncome()[0])}/s`);

      // Exp
      headers.push("Exp");
      values.push(`${humanReadable(ns.getScriptExpGain())}/s`);

      hook0.innerText = headers.join(" \n");
      hook1.innerText = values.join("\n");
    } catch (err) {
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
};
