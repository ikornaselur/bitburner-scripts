import { NS } from "bitburner";

const TRAIN_TIME = 30; // seconds

export const main = async (ns: NS): Promise<void> => {
  while (true) {
    const player = ns.getPlayer();
    const stats: Array<{ type: string; exp: number }> = [
      { type: "Strength", exp: player.strength_exp },
      { type: "Defense", exp: player.defense_exp },
      { type: "Dexterity", exp: player.dexterity_exp },
      { type: "Agility", exp: player.agility_exp },
    ].sort((a, b) => a.exp - b.exp);
    const lowest = stats[0].type;
    ns.print(stats);
    ns.print(
      `INFO ${lowest} is lowest of all stats, increasing for ${TRAIN_TIME} seconds!`
    );

    ns.gymWorkout("Powerhouse Gym", lowest);

    await ns.sleep(TRAIN_TIME * 1000);
  }
};
