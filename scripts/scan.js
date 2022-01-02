/** @param {NS} ns **/
export async function main(ns) {
    const servers = {
        home: false,
    };

    const portMap = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    };

    let unscanned;
    while (
        (unscanned = Object.keys(servers).filter((server) => !servers[server]))
            .length > 0
    ) {
        for (const server of unscanned) {
            ns.tprint(`Scanning ${server}`);
            const connectedServers = ns.scan(server);
            servers[server] = true;
            for (const connected of connectedServers) {
                if (!servers[connected]) {
                    const hasRoot = ns.hasRootAccess(connected);
                    const requiredPorts =
                        ns.getServerNumPortsRequired(connected);
                    portMap[requiredPorts].push(connected);
                    ns.tprint(`  - Found ${connected} connected to ${server}`);
                    ns.tprint(`      - Root: ${hasRoot}`);
                    ns.tprint(`      - Ports: ${requiredPorts}`);
                    servers[connected] = false;
                }
            }
        }
        await ns.sleep(100);
    }

    ns.tprint(portMap);
}
