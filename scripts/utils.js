import { ATTACK_THRESH } from "/scripts/constants.js";

/** @param {number} value
 **/
export function humanReadable(value) {
    const postfixes = ["", "K", "M", "B", "T"];
    let idx = 0;

    while (value > 1000) {
        value = value / 1000;
        idx += 1;
    }

    return `${value.toFixed(2)}${postfixes[idx]}`;
}

export function humanReadableMoney(value) {
    return `$${humanReadable(value)}`;
}

export function humanReadableRAM(value) {
    const postfixes = ["GB", "TB", "PB", "EB"];
    let idx = 0;

    while (value > 1024) {
        value = value / 1024;
        idx += 1;
    }

    return `${value.toFixed(1)}${postfixes[idx]}`;
}

/**
 ** @param {NS} ns
 ** @param {string} server
 **/
export async function scpAttackScripts(ns, server) {
    await ns.scp(
        ["/scripts/utils.js", "/scripts/constants.js", "/scripts/attack.js"],
        server
    );
}

/** @param {NS} ns
 ** @param {string} server
 ** @param {Array<string>} targets
 ** @params {number} ram
 ** @params {boolean} killall
 **/
export function executeAttack(ns, server, targets, ram, killall) {
    const attackRamReq = ns.getScriptRam("/scripts/attack.js");
    ns.print(`Attack RAM requirements: ${humanReadableRAM(attackRamReq)}`);
    let threads = Math.floor(ram / attackRamReq);
    if (threads > 100) {
        threads -= 10;
    } else if (threads < 1) {
        // Exit early if no threads available
        return;
    }
    if (killall === undefined || killall) {
        ns.killall(server);
    }

    if (threads < targets.length * 10) {
        ns.exec(
            "/scripts/attack.js",
            server,
            threads,
            targets[0],
            "--moneyThresh",
            ATTACK_THRESH
        );
    } else {
        for (const target of targets) {
            ns.exec(
                "/scripts/attack.js",
                server,
                Math.floor(threads / targets.length),
                target,
                "--moneyThresh",
                ATTACK_THRESH
            );
        }
    }
}
