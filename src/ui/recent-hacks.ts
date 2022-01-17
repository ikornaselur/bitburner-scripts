import { NS } from "bitburner";
import { Ports } from "/scripts/constants";

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

const updateUI = (ns: NS, entries: Array<AttackLogEntry>): void => {
  ns.clearLog();
  const nodeWidth = Math.max(
    ...Object.values(entries).map((entry) => entry.node.length)
  );
  const targetWidth = Math.max(
    ...Object.values(entries).map((entry) => entry.target.length)
  );

  ns.print(
    `Timestamp | ${"Node".padEnd(nodeWidth, " ")} | ${"Target".padEnd(
      targetWidth,
      " "
    )} | Message`
  );
  for (const entry of entries) {
    ns.print(
      `${entry.timestamp}  | ${entry.node.padEnd(
        nodeWidth,
        " "
      )} | ${entry.target.padEnd(targetWidth, " ")} | ${entry.message}`
    );
  }
};

export const main = async (ns: NS): Promise<void> => {
  ns.disableLog("ALL");
  ns.clearPort(Ports.ATTACK_LOG);
  const flags = ns.flags([["last", 10]]);
  let entries: Array<AttackLogEntry> = [];

  while (true) {
    for await (const logEntry of getAttackLogEntries(ns)) {
      entries.push(logEntry);
    }
    if (entries.length > flags.last) {
      entries = entries.slice(entries.length - flags.last);
    }
    updateUI(ns, entries);
    await ns.sleep(100);
  }
};
