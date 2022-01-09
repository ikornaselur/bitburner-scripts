import { Ports } from "/scripts/constants";
import { NS } from "bitburner";

export const updateStatus = async (
  ns: NS,
  hostname: string,
  status: string,
  extra = {}
): Promise<void> => {
  const payload = {
    hostname,
    status,
    ...extra,
  };

  await ns.writePort(Ports.STATUS, JSON.stringify(payload));
};

export async function* getStatus(ns: NS): AsyncGenerator<string> {
  while (ns.peek(Ports.STATUS) !== "NULL PORT DATA") {
    yield JSON.parse(ns.readPort(Ports.STATUS));
  }
}
