import { SERVERS } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
    for (const server of SERVERS) {
        const files = ns.ls(server);
        for (const file of files.filter(file => file.indexOf('.cct') !== -1)) {
            ns.print(`[${server}] ${file}`);
        }
    }
}
