import { Ports } from "/scripts/constants";
import { NS } from "bitburner";

export interface NodeStatus {
  hostname: string;
  status: string;
  type?: string;
  endTime?: number;
  startTime?: number;
}

export const updateStatus = async (
  ns: NS,
  hostname: string,
  status: string,
  extra = {}
): Promise<void> => {
  const payload: NodeStatus = {
    hostname,
    status,
    ...extra,
  };

  await ns.writePort(Ports.STATUS, JSON.stringify(payload));
};

export async function* getStatus(ns: NS): AsyncGenerator<NodeStatus> {
  while (ns.peek(Ports.STATUS) !== "NULL PORT DATA") {
    yield JSON.parse(ns.readPort(Ports.STATUS));
  }
}
