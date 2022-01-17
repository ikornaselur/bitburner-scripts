import { NS } from "bitburner";
import { humanReadableMoney } from "/scripts/utils/format";
import { publishLog } from "/scripts/ui/log-window";

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("ERROR Missing target argument");
    return ns.exit();
  }
  const target = ns.args[0];
  const hostname = ns.getHostname();
  let attempts = 1;
  if (typeof ns.args[1] === "number") {
    attempts = ns.args[1];
  }

  while (attempts > 0) {
    attempts--;
    const stolen = await ns.hack(target);

    if (stolen > 0) {
      await publishLog(ns, {
        node: hostname,
        target,
        amount: stolen,
        message: `Stole ${humanReadableMoney(stolen)}`,
      });
      break;
    } else {
      ns.tprint(
        `WARN [${hostname}] failed stealing from ${ns.args[0]}! Attempts left: ${attempts}`
      );
    }
  }
};
