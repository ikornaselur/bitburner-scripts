import { NS } from "bitburner";
import { updateStatus } from "/scripts/utils/status";

const HACK = "/scripts/attack/late/hack.js";

const getAvailableRam = (ns: NS): number => {
  // Calculate number of threads possible for weaken
  const hostname = ns.getHostname();
  const maxRam = ns.getServerMaxRam(hostname);
  const usedRam = ns.getServerUsedRam(hostname);
  return maxRam - usedRam - 5; // Leave ~5GB additional for ad-hoc scripts
};

const MONEY_THRESH = 0.75;

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "string") {
    ns.tprint("Usage: hack.js <target>");
    ns.tprint("Example: hack.js n00dles -> Start hacking n00dles,");
    ns.tprint(
      "         assumes other nodes are weakening and growing the server"
    );
    return ns.exit();
  }

  const target = ns.args[0];
  const hostname = ns.getHostname();

  const minSecurity = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);

  while (true) {
    // Times in milliseconds
    const hackTime = ns.getHackTime(target);

    const availableRam = getAvailableRam(ns);
    ns.print("availableRam: ", availableRam);

    const maxThreads = Math.floor(availableRam / ns.getScriptRam(HACK));

    const hackThreads = Math.min(
      ns.hackAnalyzeThreads(target, maxMoney / 2),
      maxThreads
    );
    ns.print("hackThreads: ", hackThreads);

    const hackRam = hackThreads * ns.getScriptRam(HACK);
    ns.print("hackRam: ", hackRam);

    if (ns.getServerMoneyAvailable(target) < maxMoney * MONEY_THRESH) {
      ns.print("WARN Not enough money available");
      await ns.sleep(1000);
      continue;
    }
    if (hackRam > availableRam) {
      ns.print("ERROR Not enough ram available to hack!");
      await ns.sleep(1000);
      continue;
    }
    if (ns.getServerSecurityLevel(target) > minSecurity * 3) {
      ns.print("WARN Server security level too high");
      await ns.sleep(1000);
      continue;
    }
    await updateStatus(ns, hostname, "Hacking", {
      startTime: Date.now(),
      endTime: Date.now() + hackTime,
    });
    ns.run(HACK, hackThreads, target);
    await ns.sleep(hackTime + 100);
    await updateStatus(ns, hostname, "Idle");
  }
};
