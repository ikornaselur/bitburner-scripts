export const SERVERS_PORT_0 = [
    "foodnstuff",
    "harakiri-sushi",
    "hong-fang-tea",
    "joesguns",
    "n00dles",
    "nectar-net",
    "sigma-cosmetics",
];

export const SERVERS_PORT_1 = [
    "CSEC",
    "iron-gym",
    "max-hardware",
    "neo-net",
    "zer0",
];

export const SERVERS_PORT_2 = [
    "avmnite-02h",
    "crush-fitness",
    "johnson-ortho",
    "omega-net",
    "phantasy",
    "silver-helix",
    "the-hub",
];

export const SERVERS_PORT_3 = [
    "I.I.I.I",
    "catalyst",
    "comptek",
    "millenium-fitness",
    "netlink",
    "rho-construction",
    "rothman-uni",
    "summit-uni",
];

export const SERVERS_PORT_4 = [
    "syscore",
    "lexo-corp",
    "unitalife",
    "nova-med",
    "univ-energy",
    "alpha-ent",
    "zb-def",
    "snap-fitness",
    "aevum-police",
    "global-pharm",
];

export const SERVERS_PORT_5 = [
    "aerocorp",
    "darkweb",
    "defcomm",
    "deltaone",
    "galactic-cyber",
    "icarus",
    "infocomm",
    "omnia",
    "solaris",
    "taiyang-digital",
    "zb-institute",
    "zeus-med",
];

export const SERVERS = SERVERS_PORT_0.concat(SERVERS_PORT_1)
    .concat(SERVERS_PORT_2)
    .concat(SERVERS_PORT_3)
    .concat(SERVERS_PORT_4)
    .concat(SERVERS_PORT_5);

/**
 * 1TB: ~$56M
 * 2TB: ~$112M
 * 4TB: ~$225M
 * 8TB: ~$450M
 * 16TB: $901.120M
 **/
export const PREFIX = "serv-";
export const RAM = 1024 * 16;

export const RAM_REQUIREMENTS = 2.4;
const TARGETS_0 = ["joesguns"];
const TARGETS_1 = ["iron-gym"];
const TARGETS_2 = ["omega-net"];
const TARGETS_3 = ["iron-gym", "omega-net"];
const TARGETS_4 = ["silver-helix", "omega-net", "johnson-ortho"];
const TARGETS_5 = [
    "silver-helix",
    "omega-net",
    "johnson-ortho",
    "the-hub",
    "rothman-uni",
];
export const TARGETS = TARGETS_4;

export const ATTACK_THRESH = 0.75;
