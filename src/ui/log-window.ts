import { NS } from "bitburner";
import { Ports } from "/scripts/constants";
import { humanReadableMoney } from "/scripts/utils/format";

export interface LogEntry {
  node: string;
  message?: string;
  timestamp?: string;
}

export interface AttackLogEntry extends LogEntry {
  target: string;
  amount: number;
}

async function* getAttackLogEntries(ns: NS): AsyncGenerator<AttackLogEntry> {
  while (ns.peek(Ports.ATTACK_LOG) !== "NULL PORT DATA") {
    yield JSON.parse(ns.readPort(Ports.ATTACK_LOG));
  }
}

export const publishLog = async (
  ns: NS,
  entry: AttackLogEntry
): Promise<void> => {
  await ns.writePort(
    Ports.ATTACK_LOG,
    JSON.stringify({
      timestamp: new Date().toISOString().substring(11, 19),
      ...entry,
    })
  );
};

const updateUI = (
  ns: NS,
  entries: { [key: string]: AttackLogEntry },
  total: { [key: string]: number }
): void => {
  ns.clearLog();
  const nodeWidth = Math.max(
    ...Object.values(entries).map((entry) => entry.node.length)
  );
  const targetWidth = Math.max(
    ...Object.values(entries).map((entry) => entry.target.length)
  );
  const totalWidth = 8;

  ns.print(
    `Last Event | ${"Node".padEnd(nodeWidth, " ")} | ${"Target".padEnd(
      targetWidth,
      " "
    )} | ${"Total".padEnd(totalWidth, " ")} | Message`
  );
  for (const node of Object.keys(entries).sort()) {
    const entry = entries[node];
    const nodeTotal = humanReadableMoney(total[node]);
    ns.print(
      `${entry.timestamp}   | ${node.padEnd(
        nodeWidth,
        " "
      )} | ${entry.target.padEnd(targetWidth, " ")} | ${nodeTotal.padEnd(totalWidth, " ")} | ${
        entry.message
      }`
    );
  }
};

export const main = async (ns: NS): Promise<void> => {
  ns.disableLog("ALL");
  ns.clearPort(Ports.ATTACK_LOG);
  const entries: { [key: string]: AttackLogEntry } = {};
  const total: { [key: string]: number } = {};

  while (true) {
    for await (const logEntry of getAttackLogEntries(ns)) {
      entries[logEntry.node] = logEntry;
      total[logEntry.node] = logEntry.amount + (total[logEntry.node] ?? 0);
    }
    updateUI(ns, entries, total);
    await ns.sleep(100);
  }
};
