import { humanReadableMoney, humanReadable } from "/scripts/utils.js";

function getProgress(args) {
  const runTime = parseInt(args[1]);
  const startTime = parseInt(args[2]);
  const now = Date.now();

  const elapsed = now - startTime;

  let progress = (elapsed / runTime * 100).toFixed(0);

  if (progress >= 100) {
    progress = 100;
  }
  return `${progress}%`
}

/*
  "primarylight":"#FFF","primary":"#F8F8F2","primarydark":"#FAFAEB","successlight":"#ADE146","success":"#A6E22E","successdark":"#98E104","errorlight":"#FF69A0","error":"#F92672","errordark":"#D10F56","secondarylight":"#AAA","secondary":"#888","secondarydark":"#666","warninglight":"#E1D992","warning":"#E6DB74","warningdark":"#EDDD54","infolight":"#92E1F1","info":"#66D9EF","infodark":"#31CDED","welllight":"#444","well":"#222","white":"#fff","black":"#000","hp":"#F92672","money":"#E6DB74","hack":"#A6E22E","combat":"#75715E","cha":"#AE81FF","int":"#66D9EF","rep":"#E69F66","disabled":"#66cfbc","backgroundprimary":"#272822","backgroundsecondary":"#1B1C18","button":"#333"}
  */

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
  if (server === "serv-0") {
    ns.print(ps);
    ns.print(state);
  }

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

      for (let i = 0; i < 25; i++) {
        const server = `serv-${i}`;
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
