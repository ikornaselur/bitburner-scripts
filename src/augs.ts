import { NS } from "bitburner";
import { humanReadableMoney, humanReadable } from "/scripts/utils/format";

const MULT = 1.9;


export const main = async (ns: NS): Promise<void> => {
  const flags: { faction: string } = ns.flags([["faction", "CyberSec"]]);

  const augs = ns.getAugmentationsFromFaction(flags.faction);
  const owned = ns.getOwnedAugmentations(true);
  const rep = ns.getFactionRep(flags.faction);
  const userMoney = ns.getServerMoneyAvailable("home");

  ns.tprint(`INFO Current rep with ${flags.faction}: ${humanReadable(rep)}`);

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
    let logLevel = 'INFO';
    if (totalMoneyRequired > userMoney) {
      logLevel = 'WARN';
    }
    if (aug.rep > rep) {
      logLevel = 'ERROR';
    }

    totalMoneyRequired += cost
    ns.tprint(
      `${logLevel} ${humanReadableMoney(aug.cost)} -> ${humanReadableMoney(cost)} ${aug.name}: (${humanReadable(aug.rep)}) `
    );
    buyCount += 1;
  }

  ns.tprint(`INFO required money: ${humanReadableMoney(totalMoneyRequired)}`);
};
