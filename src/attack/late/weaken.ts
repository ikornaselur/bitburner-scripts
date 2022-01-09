import { NS } from 'bitburner';

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== 'string') {
    ns.tprint("ERROR Missing target argument");
    return ns.exit();
  }

  await ns.weaken(ns.args[0]);
}
