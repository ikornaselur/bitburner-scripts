import { NS } from "bitburner";
import { humanReadableMoney, humanReadableRAM } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  for (let ram = 1; ram < 2 ** 21; ram *= 2) {
    const serverCost = ns.getPurchasedServerCost(ram);
    ns.tprint(
      `INFO ${humanReadableRAM(ram, 0)} server cost: ${humanReadableMoney(
        serverCost
      )}`
    );
  }
};
