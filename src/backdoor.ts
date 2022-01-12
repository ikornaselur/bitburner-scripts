import { NS } from "bitburner";

const BACKDOOR_TARGETS = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];

const find = async (
  ns: NS,
  current: string,
  target: string,
  path: Array<string>,
  visited: Array<string>
): Promise<Array<string>> => {
  if (current === target) {
    return path.concat(current).slice(1);
  } else {
    const connectedServers = ns
      .scan(current)
      .filter((s) => visited.indexOf(s) === -1);
    for (const connected of connectedServers) {
      visited.push(connected);
      const resultPath = await find(
        ns,
        connected,
        target,
        path.concat(current),
        visited
      );
      if (resultPath.length > 0) {
        return resultPath;
      }
      await ns.sleep(10);
    }
  }
  return [];
};

export const main = async (ns: NS): Promise<void> => {
  const player = ns.getPlayer();
  const hackLevel = player.hacking;

  for (const target of BACKDOOR_TARGETS) {
    const serverHackLevel = ns.getServerRequiredHackingLevel(target);
    if (serverHackLevel > hackLevel) {
      ns.tprint(`WARN [${target}] Hack level too high (${serverHackLevel})`);
    } else {
      ns.tprint(
        `INFO [${target}] Hack level low enough (${serverHackLevel}). Installing backdoor...`
      );
      const path = await find(ns, "home", target, [], ["home"]);
      for (const server of path) {
        ns.connect(server);
      }
      await ns.installBackdoor();
      ns.tprint(`SUCCESS [${target}] Backdoor successfully insalled!`);
      ns.connect("home");
    }
  }
};
