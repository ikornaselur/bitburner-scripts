import { NS } from "bitburner";

export const main = async (ns: NS): Promise<void> => {
  while (true) {
    const ramCost = ns.getUpgradeHomeRamCost();
    const coresCost = ns.getUpgradeHomeCoresCost();
    const money = ns.getServerMoneyAvailable("home");

    if (money < Math.min(ramCost, coresCost)) {
      // Sleep for 60 seconds
      await ns.sleep(60 * 1000);
    } else if (ramCost < coresCost) {
      ns.tprint("INFO Upgrading home RAM");
      ns.upgradeHomeRam();
    } else {
      ns.tprint("INFO Upgrading home CPU cores");
      ns.upgradeHomeCores();
    }
  }
};
