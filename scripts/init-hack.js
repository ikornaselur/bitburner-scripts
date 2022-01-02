import { SERVERS_MAP } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    for (const server of SERVERS_MAP[0]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.nuke(server);
        }
    }

    if (!ns.fileExists("BruteSSH.exe")) {
        return;
    }

    for (const server of SERVERS_MAP[1]) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (!ns.fileExists("FTPCrack.exe")) {
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

    if (!ns.fileExists("HTTPWorm.exe")) {
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

    if (!ns.fileExists("SQLInject.exe")) {
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

    if (!ns.fileExists("relaySMTP.exe")) {
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
