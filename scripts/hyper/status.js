/** @param {NS} ns **/
export async function main(ns) {
  // A dummy script that does nothing, it's just a hack to get the state
  let sleepTime = parseInt(ns.args[1]);  // [0] is status
  if (sleepTime === undefined) {
    sleepTime = 1000 * 60 * 60;  // 1 Hour default
  }

  await ns.sleep(sleepTime);
}
