import { NS } from "bitburner";
import { humanReadableMoney, humanReadable } from "/scripts/utils/format";
import { FACTIONS } from "/scripts/constants";

const MULT = 1.9;

const findAug = (ns: NS, aug: string): void => {
  ns.tprint(`Factions with ${aug}:`);
  for (const faction of FACTIONS) {
    const augs = ns.getAugmentationsFromFaction(faction);
    if (augs.indexOf(aug) > -1) {
      ns.tprint(`  - ${faction}`);
    }
  }
};

const getFactionAugs = (
  ns: NS,
  faction: string,
  buy = false,
  info = false
): void => {
  const augs = ns.getAugmentationsFromFaction(faction);
  const owned = ns.getOwnedAugmentations(true);
  const rep = ns.getFactionRep(faction);
  const userMoney = ns.getServerMoneyAvailable("home");

  ns.tprint(`INFO Current rep with ${faction}: ${humanReadable(rep)}`);

  const augStats = augs
    .filter((aug) => owned.indexOf(aug) === -1)
    .map((aug) => {
      return {
        name: aug,
        cost: ns.getAugmentationPrice(aug),
        rep: ns.getAugmentationRepReq(aug),
      };
    })
    .sort((a, b) => b.cost - a.cost);

  let buyCount = 0;
  let totalMoneyRequired = 0;

  for (const aug of augStats) {
    const cost = aug.cost * Math.pow(MULT, buyCount);
    let logLevel = "INFO";
    if (totalMoneyRequired > userMoney) {
      logLevel = "WARN";
    }
    if (aug.rep > rep) {
      logLevel = "ERROR";
    }
    const shouldBuy = buy && logLevel === "INFO";

    totalMoneyRequired += cost;
    ns.tprint(
      `${logLevel} ${humanReadableMoney(aug.cost)} -> ${humanReadableMoney(
        cost
      )} ${aug.name}: (${humanReadable(aug.rep)}) `
    );
    if (info) {
      const stat = ns.getAugmentationStats(aug.name);
      for (const key of Object.keys(stat)) {
        ns.tprint(`  ${key}: ${stat[key]}`);
      }
    }

    buyCount += 1;
    if (shouldBuy) {
      if (ns.purchaseAugmentation(faction, aug.name)) {
        ns.tprint("SUCCESS Augmentation purchased");
      } else {
        ns.tprint("ERROR FAiled to buy augmentation");
      }
    }
  }

  ns.tprint(`INFO required money: ${humanReadableMoney(totalMoneyRequired)}`);
};

export const main = async (ns: NS): Promise<void> => {
  const flags: {
    faction: string;
    buy: boolean;
    help: boolean;
    info: boolean;
    find: string;
  } = ns.flags([
    ["faction", ""],
    ["find", ""],
    ["buy", false],
    ["info", false],
    ["help", false],
  ]);

  if (flags.help) {
    ns.tprint("Usage:");
    ns.tprint('./augs.js [--faction "Faction Name"] [--buy] [--info]');
    ns.tprint('./augs.js [--find "Augmentation name"]');
    return;
  } else if (flags.faction.length > 0) {
    getFactionAugs(ns, flags.faction, flags.buy, flags.info);
  } else if (flags.find.length > 0) {
    findAug(ns, flags.find);
  }
};
