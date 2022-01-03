const BACKDOOR_TARGETS = ["CSEC", "I.I.I.I", "avmnite-02h", "run4theh111z"];

/** @param {NS} ns
 * @param {string} current
 * @param {string} target
 * @param {Array<string>} path
 * @param {Array<string>} visited
 */
async function find(ns, current, target, path, visited, backdoor) {
  if (current === target) {
    let output = path
        .concat(current)
        .slice(1)
        .map((server) => `ssh ${server}`)
        .join("; ")
    if (backdoor) {
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
      if (await find(ns, connected, target, path.concat(current), visited, backdoor)) {
        return true;
      }
      await ns.sleep(10);
    }
  }
}

/** @param {NS} ns **/
export async function main(ns) {
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
