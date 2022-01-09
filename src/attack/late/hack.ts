import { NS } from "bitburner";
import { humanReadableMoney } from "/scripts/utils/format";

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("ERROR Missing target argument");
    return ns.exit();
  }

  const hostname = ns.getHostname();
  let attempts = 1;
  if (typeof ns.args[1] === "number") {
    attempts = ns.args[1];
  }

  while (attempts > 0) {
    attempts--;
    const res = await ns.hack(ns.args[0]);

    if (res > 0) {
      ns.tprint(
        `SUCCESS [${hostname}] $$$ Stole ${humanReadableMoney(res)} from ${
          ns.args[0]
        }!`
      );
      break;
    } else {
      ns.tprint(
        `WARN [${hostname}] failed stealing from ${ns.args[0]}! Attempts left: ${attempts}`
      );
    }
  }
};
