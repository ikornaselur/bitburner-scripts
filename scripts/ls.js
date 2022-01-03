import { SERVERS } from "/scripts/constants.js";

/** @param {NS} ns **/
export async function main(ns) {
  ns.tprint("Looking for Contracts...");
  const fileFilter = ns.args[0];

  for (const server of SERVERS) {
    // Don't care about /scripts/ files
    let files = ns
      .ls(server)
      .filter((file) => file.indexOf("/scripts/") === -1);

    if (fileFilter) {
      files = files.filter((file) => file.indexOf(fileFilter) !== -1);
    }

    for (const file of files) {
      ns.tprint(`[${server}] ${file}`);
    }
  }
}
