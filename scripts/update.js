const SCRIPTS = [
  "attack.js",
  "backdoor.js",
  "buy-servers.js",
  "constants.js",
  "cp-attack.js",
  "cp-focus.js",
  "cp-hyper.js",
  "find.js",
  "focus-attack.js",
  "hacknet.js",
  "hyper/dist.js",
  "hyper/grow.js",
  "hyper/hack.js",
  "hyper/runner.js",
  "hyper/status.js",
  "hyper/weaken.js",
  "init-hack.js",
  "list-max-money.js",
  "list-prices.js",
  "list-server-sizes.js",
  "ls.js",
  "scan.js",
  "terminate-all.js",
  "ui/base.js",
  "ui/monitor.js",
  "ui/serv-stats.js",
  "ui/port-stats.js",
  "update.js",
  "upgrade-servers.js",
  "utils.js",
];
/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("wget");

  for (const script of SCRIPTS) {
    const result = await ns.wget(
      `https://local.absalon.dev/${script}`,
      `/scripts/${script}`
    );
    if (result) {
      ns.tprint(`SUCCESS Downloaded ${script} to /scripts`);
    } else {
      ns.tprint(`ERROR Error downloading ${script}`);
    }
  }
}
