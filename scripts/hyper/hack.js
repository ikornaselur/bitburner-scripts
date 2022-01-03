import { humanReadableMoney } from '/scripts/utils.js';


/** @param {NS} ns **/
export async function main(ns) {
  const hostname = ns.getHostname();
  const res = await ns.hack(ns.args[0]);
  if (res > 0) {
    ns.tprint(`[${hostname}] $$$ Stole ${humanReadableMoney(res)} from ${ns.args[0]}!`);
  }
}
