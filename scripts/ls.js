import { SERVERS } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("Looking for Contracts...");
    let found = false;
    for (const server of SERVERS) {
        const files = ns.ls(server);
        for (const file of files.filter(
            (file) => file.indexOf(".cct") !== -1
        )) {
            found = true;
            ns.tprint(`[${server}] ${file}`);
        }
    }
    if (!found) {
        ns.tprint("No contracts found!");
    }
}
