/** @param {NS} ns **/
export async function main(ns) {
  // A dummy script that does nothing, it's just a hack to get the state
  while (true) {
    await ns.sleep(100 * 1000);
  }
}
