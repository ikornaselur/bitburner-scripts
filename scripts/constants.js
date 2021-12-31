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
 ** 1TB:  ~$56M
 ** 2TB:  ~$112M
 ** 4TB:  ~$225M
 ** 8TB:  ~$450M
 ** 16TB:  $901.120M
 ** 32TB:  $1.8B
 ** 64TB:  $3.6B
 **/
export const PREFIX = "serv-";
export const RAM = 1024 * 64;

export const TARGETS_0 = ["joesguns"];
export const TARGETS_1 = ["iron-gym"];
export const TARGETS_2 = ["omega-net"];
export const TARGETS_3 = ["iron-gym", "omega-net"];
export const TARGETS_4 = ["silver-helix", "omega-net", "johnson-ortho"];
export const TARGETS_5 = [
    "silver-helix",
    "omega-net",
    "johnson-ortho",
    "the-hub",
    "rothman-uni",
];
export const TARGETS_6 = [
    "the-hub",
    "comptek",
    "rothman-uni",
    "netlink",
    "aevum-police",
    "catalyst",
];
export const TARGETS_TEST = [
    "joesguns",
    "nectar-net",
    "hong-fang-tea",
    "harakiri-sushi",
    "neo-net",
    "zer0",
    "max-hardware",
    "iron-gym",
    "phantasy",
    "crush-fitness",
    "silver-helix",
    "omega-net",
    "johnson-ortho",
    "the-hub",
    "comptek",
    "rothman-uni",
];
export const TARGETS = TARGETS_TEST;

export const ATTACK_THRESH = 0.75;
