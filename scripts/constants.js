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
    "silver-helix",
    "zer0",
];

export const SERVERS_PORT_2 = [
    "avmnite-02h",
    "crush-fitness",
    "johnson-ortho",
    "omega-net",
    "phantasy",
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

/*
 * 16TB: ~$901.120M
 */
export const PREFIX = "serv-";
export const RAM = 1024 * 16; // 16TB  ~$896M

export const RAM_REQUIREMENTS = 2.4;
export const TARGET = "omega-net";
export const ATTACK_THRESH = 0.75;
