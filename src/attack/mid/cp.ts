import { NS } from "bitburner";
import { NODES } from "/scripts/constants";

// TODO: Replace to make dynamic
const MONEY_MAP = {
  "n00dles": "$1.75M",
  "fulcrumassets": "$25.00M",
  "foodnstuff": "$50.00M",
  "sigma-cosmetics": "$57.50M",
  "joesguns": "$62.50M",
  "nectar-net": "$68.75M",
  "hong-fang-tea": "$75.00M",
  "harakiri-sushi": "$100.00M",
  "neo-net": "$125.00M",
  "zer0": "$187.50M",
  "max-hardware": "$250.00M",
  "iron-gym": "$500.00M",
  "phantasy": "$600.00M",
  // "silver-helix": "$1.13B",
  "crush-fitness": "$1.42B",
  "omega-net": "$1.59B",
  "johnson-ortho": "$1.99B",
  "the-hub": "$4.04B",
  "rothman-uni": "$4.40B",
  "comptek": "$5.93B",
  "millenium-fitness": "$6.25B",
  "summit-uni": "$6.43B",
  "netlink": "$6.88B",
  "aevum-police": "$8.35B",
  "snap-fitness": "$11.25B",
  "syscore": "$12.69B",
  "rho-construction": "$12.87B",
  "catalyst": "$13.65B",
  "alpha-ent": "$16.47B",
  "microdyne": "$16.78B",
  "helios": "$17.55B",
  "vitalife": "$18.32B",
  "applied-energetics": "$18.38B",
  "infocomm": "$18.55B",
  "solaris": "$18.85B",
  "lexo-corp": "$19.43B",
  "zb-institute": "$20.50B",
  "galactic-cyber": "$21.13B",
  "defcomm": "$21.32B",
  "taiyang-digital": "$22.39B",
  "titan-labs": "$22.45B",
  "powerhouse-fitness": "$22.50B",
  "omnia": "$23.64B",
  "icarus": "$24.70B",
  "unitalife": "$25.15B",
  "zb-def": "$25.16B",
  "stormtech": "$25.50B",
  "aerocorp": "$25.96B",
  "univ-energy": "$28.42B",
  "nova-med": "$29.87B",
  "zeus-med": "$35.35B",
  "fulcrumtech": "$36.13B",
  "global-pharm": "$38.63B",
  "deltaone": "$41.83B",
  "blade": "$296.69B",
  "omnitek": "$465.60B",
  "b-and-a": "$475.79B",
  "4sigma": "$515.12B",
  "clarkinc": "$559.14B",
  "kuai-gong": "$604.87B",
  "nwo": "$633.12B",
  "megacorp": "$1.26T",
  "ecorp": "$1.47T",
};

export const executeFocus = (ns: NS, server: string, target: string): void => {
  const attack_script = "/scripts/attack/mid/attack.js";
  const serverRam = ns.getServerMaxRam(server);
  const ramReq = ns.getScriptRam(attack_script);
  const threads = Math.floor(serverRam / ramReq);

  ns.killall(server);

  ns.exec(attack_script, server, threads, target);
};

export const main = async (ns: NS): Promise<void> => {
  if (typeof ns.args[0] !== "number") {
    ns.tprint("Usage: cp.js <targetIdx>");
    ns.tprint("Example: cp.js 10 -> Copies attack scripts to nodes and");
    ns.tprint("         starts individually attacking one server per node,");
    ns.tprint("         starting at the 10th server in order of max money");
    return ns.exit();
  }

  let targetIdx = ns.args[0];
  let serverIdx = 0;

  const userHackingLevel = ns.getHackingLevel();

  const maxVal = Object.keys(MONEY_MAP).length - 25;

  if (targetIdx > maxVal) {
    ns.tprint(`Specify a value below ${maxVal}`);
    ns.exit();
  }

  ns.tprint("Copying attack script to servers");

  while (serverIdx < 25) {
    const server = NODES[serverIdx];
    let target: string;
    while (true) {
      target = Object.keys(MONEY_MAP)[targetIdx];
      if (target === undefined) {
        ns.tprint("ERROR Ran out of valid servers");
        return;
      }
      const serverHackingLevel = ns.getServerRequiredHackingLevel(target);
      if (serverHackingLevel > userHackingLevel) {
        ns.tprint(
          `WARN [${server}] user hacking level (${userHackingLevel}) too low for ${target} (${serverHackingLevel})`
        );
        targetIdx++;
      } else {
        break;
      }
      await ns.sleep(100);
    }

    while (!ns.serverExists(server)) {
      ns.print("Server not bought yet, sleeping for 60 seconds...");
      await ns.sleep(60 * 1000);
    }

    ns.tprint(
      `[${server}] Copying focus script to attack ${target} (${MONEY_MAP[target]})`
    );
    await ns.scp(
      [
        "/scripts/utils/format.js",
        "/scripts/ui/log-window.js",
        "/scripts/constants.js",
        "/scripts/attack/mid/attack.js",
      ],
      "home",
      server
    );

    executeFocus(ns, server, target);
    serverIdx++;
    targetIdx++;
    await ns.sleep(100);
  }
};
