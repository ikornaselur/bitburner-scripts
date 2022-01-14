import { NS } from "bitburner";

const TO_KILL = ["monitor.js", "hack.js"];

export const main = async (ns: NS): Promise<void> => {
  for (const script of ns.ps()) {
    for (const toKill of TO_KILL) {
      if (script.filename.indexOf(toKill) > -1) {
        ns.kill(script.pid);
      }
    }
  }

  ns.run("/scripts/ui/monitor.js", 1, ns.args[0]);
  ns.run("/scripts/attack/early/cp.js", 1, ns.args[0], "--nodes");
  ns.run("/scripts/attack/early/hack.js", 1, ns.args[0]);
};
