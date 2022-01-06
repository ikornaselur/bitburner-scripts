/** @param {NS} ns **/
export async function main(ns) {
  const target = ns.args[0];

  const securityThresh = ns.getServerMinSecurityLevel(target) + 2;
  ns.print(`Security threshold set to ${securityThresh}`);

  while (true) {
    const secLvl = ns.getServerSecurityLevel(target);
    ns.print("-------------------");
    ns.print(`Security Level: ${secLvl.toFixed(1)}`);

    if (secLvl > securityThresh) {
      ns.print(`Weaking system until security below ${securityThresh}...`);
      await ns.weaken(target);
    } else {
      ns.print("Growing money!");
      await ns.grow(target);
    }
  }
}
