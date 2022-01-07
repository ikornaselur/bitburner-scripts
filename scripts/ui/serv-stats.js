import { humanReadableMoney, humanReadable } from "/scripts/utils.js";

/** @param {NS} ns
 * @param {number} idx
 */
function getServerStatus(ns, idx) {
  const server = `serv-${idx}`;

  if (!ns.serverExists(server)) {
    return "Offline";
  }

  const ps = ns.ps(server);
  // Find the hacky state script
  const state = ps.filter(
    (proc) => proc.filename == "/scripts/hyper/status.js"
  );

  if (state.length === 0) {
    return "No status";
  }

  const status = state[0].args[0];
  if (status !== undefined) {
    return status;
  }

  return "Unknown";
}

/** @param {NS} ns **/
export async function main(ns) {
  const doc = globalThis["document"];

  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");

  while (true) {
    try {
      const headers = [];
      const values = [];

      // Income
      headers.push("Income");
      values.push(`${humanReadableMoney(ns.getScriptIncome()[0])}/s`);

      // Exp
      headers.push("Exp");
      values.push(`${humanReadable(ns.getScriptExpGain())}/s`);

      for (let i = 0; i < 25; i++) {
        headers.push(`serv-${i}`);
        values.push(getServerStatus(ns, i));
      }

      hook0.innerText = headers.join(" \n");
      hook1.innerText = values.join("\n");
    } catch (err) {
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}
