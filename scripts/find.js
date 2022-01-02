/** @param {NS} ns
 * @param {string} current
 * @param {string} target
 * @param {Array<string>} path
 * @param {Array<string>} visited
 */
async function find(ns, current, target, path, visited) {
    if (current === target) {
        ns.tprint(
            path
                .concat(current)
                .slice(1)
                .map((server) => `ssh ${server}`)
                .join("; ")
        );
        ns.exit();
    } else {
        const connectedServers = ns
            .scan(current)
            .filter((s) => visited.indexOf(s) === -1);
        for (const connected of connectedServers) {
            visited.push(connected);
            await find(ns, connected, target, path.concat(current), visited);
            await ns.sleep(10);
        }
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    if (!ns.serverExists(target)) {
        ns.tprint(`"${target}" doesn't exist. Aborting...`);
        ns.exit();
    }
    await find(ns, "home", target, [], ["home"]);
}
