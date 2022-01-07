import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
  const hostname = ns.getHostname();
  let attempts = 1;
  if (ns.args[1] !== undefined) {
    attempts = parseInt(ns.args[1]);
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
}
