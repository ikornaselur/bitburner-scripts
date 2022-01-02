import { executeFocus } from "/scripts/utils.js";

const ATTACK_MAP = {
    "serv-0": "rho-construction",
    "serv-1": "microdyne",
    "serv-2": "alpha-ent",
    "serv-3": "helios",
    "serv-4": "vitalife",
    "serv-5": "lexo-corp",
    "serv-6": "titan-labs",
    "serv-7": "galactic-cyber",
    "serv-8": "defcomm",
    "serv-9": "taiyang-digital",
    "serv-10": "solaris",
    "serv-11": "applied-energetics",
    "serv-12": "omnia",
    "serv-13": "icarus",
    "serv-14": "zb-institute",
    "serv-15": "aerocorp",
    "serv-16": "zb-def",
    "serv-17": "unitalife",
    "serv-18": "nova-med",
    "serv-19": "univ-energy",
    "serv-20": "zeus-med",
    "serv-21": "deltaone",
    "serv-22": "global-pharm",
    "serv-23": "omnitek",
    "serv-24": "blade",
};

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("Copying attack script to servers");
    for (const server of Object.keys(ATTACK_MAP)) {
        const target = ATTACK_MAP[server];
        ns.tprint(`Copying focus script to ${server} to attack ${target}`);
        if (!ns.serverExists(server)) {
            ns.tprint(`${server} doesn't exist, skipping...`);
        } else {
            await ns.scp(["/scripts/focus-attack.js", "/scripts/utils.js"], server);
            executeFocus(ns, server, target);
        }
        await ns.sleep(250);
    }
}
