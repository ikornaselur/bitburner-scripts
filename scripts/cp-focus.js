import { executeFocus } from "/scripts/utils.js";

const ATTACK_MAP = {
    "serv-5": "summit-uni",
    "serv-6": "crush-fitness",
    "serv-7": "comptek",
    "serv-8": "rothman-uni",
    "serv-9": "millenium-fitness",
    "serv-10": "netlink",
    "serv-11": "catalyst",
    "serv-12": "aevum-police",
    "serv-13": "snap-fitness",
    "serv-14": "syscore",
    "serv-15": "rho-construction",
    "serv-16": "alpha-ent",
    "serv-17": "helios",
    "serv-18": "lexo-corp",
    "serv-19": "titan-labs",
    "serv-20": "solaris",
    "serv-21": "applied-energetics",
    "serv-22": "zb-institute",
    "serv-23": "zb-def",
    "serv-24": "unitalife",
};

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("Copying attack script to servers");
    for (const server of Object.keys(ATTACK_MAP)) {
        const target = ATTACK_MAP[server];
        ns.tprint(`Copying focus script to ${server} to attack ${target}`);
        await ns.scp(["/scripts/focus-attack.js", "/scripts/utils.js"], server);

        executeFocus(ns, server, target);

        await ns.sleep(250);
    }
}
