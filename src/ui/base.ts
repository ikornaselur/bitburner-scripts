import { NS } from "bitburner";
import { humanReadableMoney, humanReadable } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  const doc = globalThis["document"];

  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");

  if (!hook0 || !hook1) {
    ns.tprint("ERROR unable to get hooks");
    return ns.exit();
  }

  while (true) {
    try {
      const headers: Array<string> = [];
      const values: Array<string> = [];

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
