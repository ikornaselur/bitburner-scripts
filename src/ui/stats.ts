import { NS } from "bitburner";
import { NODES } from "/scripts/constants.js";
import { humanReadableMoney, humanReadable } from "/scripts/utils/format";
import { getStatus, NodeStatus } from "/scripts/utils/status";

interface Nodes {
  [Key: string]: NodeStatus;
}

const formatStatus = (ns: NS, data: NodeStatus): string => {
  const theme = ns.ui.getTheme();

  let colour = theme.primary;

  switch (data.status) {
    case "Offline":
      colour = theme.error;
      break;
    case "Idle":
      colour = theme.secondary;
      break;
    case "Prepping":
      colour = theme.warning;
      break;
    case "Growing":
    case "Weakening":
      colour = theme.info;
      break;
    case "Hacking":
      colour = theme.success;
      break;
  }

  let body = data.status;
  if (data.type) {
    body += ` (${data.type})`;
  }

  if (data.endTime && data.startTime) {
    const elapsed = Date.now() - data.startTime;
    let progress = (elapsed / (data.endTime - data.startTime)) * 100;
    if (progress > 100) {
      progress = 100;
    }
    body += ` ${progress.toFixed(0)}%`;
  }

  return `<span style='color: ${colour};'>${body}</span>`;
};

const updateUI = (ns: NS, nodes: Nodes): void => {
  const doc = globalThis["document"];

  const hook0 = doc.getElementById("overview-extra-hook-0");
  const hook1 = doc.getElementById("overview-extra-hook-1");

  if (!hook0 || !hook1) {
    ns.tprint("ERROR unable to get hooks");
    return;
  }

  const headers: Array<string> = [];
  const values: Array<string> = [];

  // Income
  headers.push("Income");
  values.push(`${humanReadableMoney(ns.getScriptIncome()[0])}/s`);

  // Exp
  headers.push("Exp");
  values.push(`${humanReadable(ns.getScriptExpGain())}/s`);

  // Server statuses
  for (const node of Object.keys(nodes)) {
    headers.push(`<span style='color: white;'>${node}</span>`);
    values.push(formatStatus(ns, nodes[node]));
  }

  hook0.innerHTML = headers.join(" <br/>");
  hook1.innerHTML = values.join(" <br/>");
};

export const main = async (ns: NS): Promise<void> => {
  ns.disableLog("sleep");
  const nodes: Nodes = {
    home: { hostname: "home", status: "Unknown" },
  };
  for (const node of NODES) {
    if (ns.serverExists(node)) {
      nodes[node] = { hostname: node, status: "Unknown" };
    } else {
      nodes[node] = { hostname: node, status: "Offline" };
    }
  }

  while (true) {
    updateUI(ns, nodes);
    for await (const status of getStatus(ns)) {
      const hostname = status.hostname;
      if (Object.keys(nodes).indexOf(hostname) === -1) {
        continue;
      }
      ns.print(status);
      nodes[hostname] = status;
    }

    await ns.sleep(1000);
  }
};
