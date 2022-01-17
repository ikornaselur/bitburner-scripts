import { NS } from "bitburner";
import { NODES } from "/scripts/constants";
import { getServers } from "/scripts/utils/servers";
import { humanReadableMoney } from "/scripts/utils/format";

export const executeLateAttack = (
  ns: NS,
  server: string,
  target: string
): void => {
  const runner_script = "/scripts/attack/late/runner.js";
  const serverRam = ns.getServerMaxRam(server);
  const ramReq = ns.getScriptRam(runner_script);
  const threads = Math.floor(serverRam / ramReq) / 2;

  ns.killall(server);

  ns.exec(runner_script, server, threads, target);
};

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "number") {
    ns.tprint("Usage: cp.js <targetIdx>");
    ns.tprint("Example: cp.js 10 -> Copies attack scripts to nodes and");
    ns.tprint("         starts individually attacking one server per node,");
    ns.tprint("         starting at the 10th server in order of max money");
    return ns.exit();
  }

  let targetIdx = ns.args[0];
  let serverIdx = 0;

  const servers = getServers(ns).sort((a, b) => a.moneyMax - b.moneyMax);
  const maxVal = servers.length - 25;

  if (targetIdx > maxVal) {
    ns.tprint(`Specify a value below ${maxVal}`);
    ns.exit();
  }

  ns.tprint("Copying attack script to servers");

  while (serverIdx < 25) {
    const target = servers[targetIdx];
    const server = NODES[serverIdx];

    while (!ns.serverExists(server)) {
      ns.print("Server not bought yet, sleeping for 10 seconds...");
      await ns.sleep(10 * 1000);
    }

    ns.tprint(
      `INFO [${server}] Copying later script to attack ${
        target.hostname
      } (${humanReadableMoney(target.moneyMax)})`
    );
    await ns.scp(
      [
        "/scripts/constants.js",
        "/scripts/utils/format.js",
        "/scripts/utils/status.js",
        "/scripts/ui/log-window.js",
        "/scripts/attack/late/runner.js",
        "/scripts/attack/late/weaken.js",
        "/scripts/attack/late/hack.js",
        "/scripts/attack/late/grow.js",
        "/scripts/attack/late/status.js",
      ],
      "home",
      server
    );

    executeLateAttack(ns, server, target.hostname);
    serverIdx++;
    targetIdx++;
    await ns.sleep(100);
  }
};
