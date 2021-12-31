import { SERVERS } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    for (const server of SERVERS) {
        if (ns.hasRootAccess(server)) {
            ns.installBackdoor(server);
        }
    }
}
