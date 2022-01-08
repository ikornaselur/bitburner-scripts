import { humanReadableMoney, humanReadable } from "/scripts/utils.js";

/** @param {NS} ns
 * @param {number} idx
 */
function getServerStatus(ns, server) {
  if (!ns.serverExists(server)) {
    return "<span style='color: red;'>Offline</span>";
  }

  const ps = ns.ps(server);
  // Find the hacky state script
  const state = ps.filter(
    (proc) => proc.filename == "/scripts/hyper/status.js"
  );

  if (state.length === 0) {
    return "<span style='color: gray;'>Idle</span>";
  }

  const status = state[0].args[0];
  if (status !== undefined) {
    if (status.indexOf("Prep") > -1) {
      return `<span style='color: yellow;'>${status}</span>`;
    }
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

      // Server statuses
      headers.push("home");
      values.push(getServerStatus(ns, "home"));

      for (let i = 0; i < 25; i++) {
        const server = `serv-${i}`;
        headers.push(server);
        values.push(getServerStatus(ns, server));
      }

      hook0.innerHTML = headers.join(" <br/>");
      hook1.innerHTML = values.join(" <br/>");
    } catch (err) {
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}
