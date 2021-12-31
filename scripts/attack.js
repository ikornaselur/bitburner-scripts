import { humanReadableMoney } from "/scripts/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    // ns.disableLog("ALL");

    const target = ns.args[0];
    let moneyMult = 0.75;
    if (ns.args[1] === "--moneyThresh") {
        moneyMult = parseFloat(ns.args[2]);
    }

    const moneyThresh = ns.getServerMaxMoney(target) * moneyMult;
    ns.tprint(`Money threshold set to ${humanReadableMoney(moneyThresh)}`);

    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    ns.tprint(`Security threshold set to ${securityThresh}`);

    while (true) {
        const secLvl = ns.getServerSecurityLevel(target);
        const moneyAvail = ns.getServerMoneyAvailable(target);
        ns.tprint("-------------------");
        ns.tprint(`Security Level: ${secLvl.toFixed(1)}`);
        ns.tprint(`Money available: ${humanReadableMoney(moneyAvail)}`);

        if (secLvl > securityThresh) {
            ns.tprint(
                `Weaking system until security below ${securityThresh}...`
            );
            await ns.weaken(target);
        } else if (moneyAvail < moneyThresh) {
            ns.tprint(
                `Growing money until above ${humanReadableMoney(
                    moneyThresh
                )}...`
            );
            await ns.grow(target);
        } else {
            ns.tprint("Hacking...");
            await ns.hack(target);
        }
    }
}
