import { NS } from "bitburner";
import { humanReadableRAM } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  const results = {};
  for (const server of ns.getPurchasedServers()) {
    const ram = ns.getServerMaxRam(server);
    if (!results[ram]) {
      results[ram] = [];
    }
    results[ram].push(server);
  }

  const keys = Object.keys(results).map((key) => parseInt(key));
  keys.sort((a, b) => a - b);

  for (const key of keys) {
    ns.tprint(`--- ${humanReadableRAM(key)} ---`);
    for (const val of results[key]) {
      ns.tprint(val);
    }
  }
};
