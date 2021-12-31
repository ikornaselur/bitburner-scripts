import {
    SERVERS_PORT_0,
    SERVERS_PORT_1,
    SERVERS_PORT_2,
    SERVERS_PORT_3,
    SERVERS_PORT_4,
    SERVERS_PORT_5,
} from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    for (const server of SERVERS_PORT_0) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.nuke(server);
        }
    }

    if (!ns.fileExists("BruteSSH.exe")) {
        return;
    }

    for (const server of SERVERS_PORT_1) {
        if (!ns.hasRootAccess(server)) {
            ns.tprint(`Getting root access on ${server}`);
            ns.brutessh(server);
            ns.nuke(server);
        }
    }

    if (!ns.fileExists("FTPCrack.exe")) {
        return;
    }

    for (const server of SERVERS_PORT_2) {
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

    for (const server of SERVERS_PORT_3) {
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

    for (const server of SERVERS_PORT_4) {
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

    for (const server of SERVERS_PORT_5) {
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
