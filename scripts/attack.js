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
    ns.print(`Money threshold set to ${humanReadableMoney(moneyThresh)}`);

    const securityThresh = ns.getServerMinSecurityLevel(target) + 15;
    ns.print(`Security threshold set to ${securityThresh}`);

    while (true) {
        const secLvl = ns.getServerSecurityLevel(target);
        const moneyAvail = ns.getServerMoneyAvailable(target);
        ns.print("-------------------");
        ns.print(`Security Level: ${secLvl.toFixed(1)}`);
        ns.print(`Money available: ${humanReadableMoney(moneyAvail)}`);

        if (secLvl > securityThresh) {
            ns.print(
                `Weaking system until security below ${securityThresh}...`
            );
            await ns.weaken(target);
        } else if (moneyAvail < moneyThresh) {
            ns.print(
                `Growing money until above ${humanReadableMoney(
                    moneyThresh
                )}...`
            );
            await ns.grow(target);
        } else {
            ns.print("Hacking...");
            await ns.hack(target);
        }
    }
}
