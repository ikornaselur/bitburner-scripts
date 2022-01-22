import { NS } from "bitburner";

export const main = async (ns: NS): Promise<void> => {
  while (true) {
    const ramCost = ns.getUpgradeHomeRamCost();
    const money = ns.getServerMoneyAvailable("home");

    if (ramCost > 7500e6) {
      // First CPU core upgrade costs $7.5b, so we can focus only on RAM until
      // RAM upgrade cost is on par with CPU cores cost
      ns.tprint("INFO Switching to tier 2 script to upgrade CPU cores as well");
      ns.spawn("/scripts/upgrade-home-tier-2.js");
    }

    if (ramCost < money) {
      // Upgrade RAM
      ns.tprint("INFO Upgrading home RAM");
      ns.upgradeHomeRam();
    } else {
      // Sleep for 60 seconds
      await ns.sleep(60 * 1000);
    }
  }
};
