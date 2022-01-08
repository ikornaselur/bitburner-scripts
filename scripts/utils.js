/** @param {number} value
 **/
export function humanReadable(value, precision) {
  const postfixes = ["", "K", "M", "B", "T"];
  let idx = 0;

  if (precision === undefined) {
    precision = 2;
  }

  while (value >= 1000) {
    value = value / 1000;
    idx += 1;
    if (idx > postfixes.length) {
      break;
    }
  }

  return `${value.toFixed(precision)}${postfixes[idx]}`;
}

export function humanReadableMoney(value, precision) {
  return `$${humanReadable(value, precision)}`;
}

export function humanReadableRAM(value, precision) {
  const postfixes = ["GB", "TB", "PB", "EB"];
  let idx = 0;

  if (precision === undefined) {
    precision = 1;
  }

  while (value >= 1024) {
    value = value / 1024;
    idx += 1;
    if (idx > postfixes.length) {
      break;
    }
  }

  return `${value.toFixed(precision)}${postfixes[idx]}`;
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
 ** @param {string} target
 ** @params {number} ram
 ** @params {boolean} killall
 **/
export function executeAttack(ns, server, target, ram, killall) {
  const attackRamReq = ns.getScriptRam("/scripts/attack.js");
  let threads = Math.floor(ram / attackRamReq);

  if (killall === undefined || killall) {
    ns.killall(server);
  }

  if (threads <= 0) {
    return;
  }

  ns.exec("/scripts/attack.js", server, threads, target);
}

/** @param {NS} ns
 ** @param {string} server
 ** @param {string} target
 **/
export function executeFocus(ns, server, target) {
  const serverRam = ns.getServerMaxRam(server);
  const ramReq = ns.getScriptRam("/scripts/focus-attack.js");
  const threads = Math.floor(serverRam / ramReq);

  ns.killall(server);

  ns.exec("/scripts/focus-attack.js", server, threads, target);
}

/** @param {NS} ns
 ** @param {string} server
 ** @param {string} target
 **/
export function executeHyper(ns, server, target) {
  const serverRam = ns.getServerMaxRam(server);
  const ramReq = ns.getScriptRam("/scripts/hyper/runner.js");
  const threads = Math.floor(serverRam / ramReq) / 2;

  ns.killall(server);

  ns.exec("/scripts/hyper/runner.js", server, threads, target);
}
