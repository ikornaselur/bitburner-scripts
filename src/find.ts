import { NS } from "bitburner";

const BACKDOOR_TARGETS = ["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z"];

const find = async (
  ns: NS,
  current: string,
  target: string,
  path: Array<string>,
  visited: Array<string>,
  backdoor: boolean
): Promise<boolean> => {
  if (current === target) {
    let output = path
      .concat(current)
      .slice(1)
      .map((server) => `ssh ${server}`)
      .join("; ");
    if (backdoor) {
      const hackLevel = ns.getServerRequiredHackingLevel(target);
      ns.tprint(`${target} Hack level: ${hackLevel}`);
      output += "; backdoor";
    }
    ns.tprint(output);
    return true;
  } else {
    const connectedServers = ns
      .scan(current)
      .filter((s) => visited.indexOf(s) === -1);
    for (const connected of connectedServers) {
      visited.push(connected);
      if (
        await find(
          ns,
          connected,
          target,
          path.concat(current),
          visited,
          backdoor
        )
      ) {
        return true;
      }
      await ns.sleep(10);
    }
  }
  return false;
};

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("Usage: find.js <target>");
    ns.tprint("Example: find.js The-Cave -> Returns the path to connect to The-Cave");
    ns.tprint("If 'backdoor' is provided as target, list all faction servers");
    return ns.exit();
  }

  const target = ns.args[0];
  if (target === "backdoor") {
    for (const target of BACKDOOR_TARGETS) {
      await find(ns, "home", target, [], ["home"], true);
    }
  } else {
    if (!ns.serverExists(target)) {
      ns.tprint(`"${target}" doesn't exist. Aborting...`);
      ns.exit();
    }
    await find(ns, "home", target, [], ["home"], false);
  }
}
