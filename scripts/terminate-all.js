/** @param {NS} ns **/
export async function main(ns) {
  const servers = {
    home: false,
  };

  let unscanned;
  while (
    (unscanned = Object.keys(servers).filter((server) => !servers[server]))
      .length > 0
  ) {
    for (const server of unscanned) {
      ns.tprint(`Scanning ${server}`);
      if (server !== "home") {
        ns.killall(server);
      }
      const connectedServers = ns.scan(server);
      servers[server] = true;
      for (const connected of connectedServers) {
        if (!servers[connected]) {
          servers[connected] = false;
        }
      }
    }
    await ns.sleep(100);
  }
}
