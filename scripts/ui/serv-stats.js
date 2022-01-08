import { NODES } from "/scripts/constants.js";
import { humanReadableMoney, humanReadable } from "/scripts/utils.js";

function getProgress(args) {
  const runTime = parseInt(args[1]);
  const startTime = parseInt(args[2]);
  const now = Date.now();

  const elapsed = now - startTime;

  let progress = ((elapsed / runTime) * 100).toFixed(0);

  if (progress >= 100) {
    progress = 100;
  }
  return `${progress}%`;
}

/** @param {NS} ns
 * @param {number} idx
 */
function getServerStatus(ns, server) {
  const theme = ns.ui.getTheme();

  if (!ns.serverExists(server)) {
    return `<span style='color: ${theme.error};'>Offline</span>`;
  }

  const ps = ns.ps(server);

  // Find the hacky state script
  const state = ps.filter(
    (proc) => proc.filename === "/scripts/hyper/status.js"
  );

  if (state.length === 0) {
    return `<span style='color: ${theme.secondary};'>Idle</span>`;
  }

  const args = state[0].args;

  const status = args[0];
  if (status !== undefined) {
    const progress = getProgress(args);
    if (status.indexOf("Prep") > -1) {
      return `<span style='color: ${theme.warning};'>${status} ${progress}</span>`;
    }
    if (status.indexOf("Growing") > -1 || status.indexOf("Weakening") > -1) {
      return `<span style='color: ${theme.info};'>${status} ${progress}</span>`;
    }
    if (status.indexOf("Hacking") > -1 || status.indexOf("Weakening") > -1) {
      return `<span style='color: ${theme.success};'>${status} ${progress}</span>`;
    }
    return `<span style='color: ${theme.primary};'>${status} ${progress}</span>`;
  }

  return "Unknown";
}

/** @param {NS} ns **/
export async function main(ns) {
  const doc = globalThis["document"];

  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");

  const theme = ns.ui.getTheme();

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
      headers.push(`<span style='color: ${theme.primary};'>home</span>`);
      values.push(getServerStatus(ns, "home"));

      for (const server of NODES) {
        headers.push(`<span style='color: white;'>${server}</span>`);
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
