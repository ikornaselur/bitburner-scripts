import { SERVERS_MAP } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    const hackTools = [
        "BruteSSH",
        "FTPCrack",
        "HTTPWorm",
        "SQLInject",
        "relaySMTP",
    ];
    const toolCount = hackTools.filter((tool) =>
        ns.fileExists(`${tool}.exe`)
    ).length;

    for (const server of SERVERS_MAP[0]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.nuke(server);
        }
    }

    if (toolCount < 1) {
        return;
    }

    for (const server of SERVERS_MAP[1]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (toolCount < 2) {
        return;
    }

    for (const server of SERVERS_MAP[2]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.ftpcrack(server);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (toolCount < 3) {
        return;
    }

    for (const server of SERVERS_MAP[3]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.httpworm(server);
            ns.ftpcrack(server);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (toolCount < 4) {
        return;
    }

    for (const server of SERVERS_MAP[4]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.sqlinject(server);
            ns.httpworm(server);
            ns.ftpcrack(server);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (toolCount < 5) {
        return;
    }

    for (const server of SERVERS_MAP[5]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.relaysmtp(server);
            ns.sqlinject(server);
            ns.httpworm(server);
            ns.ftpcrack(server);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }
}
