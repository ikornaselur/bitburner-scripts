export const SERVERS_MAP = {
    0: [
        "n00dles",
        "foodnstuff",
        "sigma-cosmetics",
        "joesguns",
        "hong-fang-tea",
        "harakiri-sushi",
        "nectar-net",
    ],
    1: ["iron-gym", "zer0", "CSEC", "max-hardware", "neo-net"],
    2: [
        "phantasy",
        "omega-net",
        "silver-helix",
        "crush-fitness",
        "avmnite-02h",
        "the-hub",
        "johnson-ortho",
    ],
    3: [
        "comptek",
        "netlink",
        "rothman-uni",
        "summit-uni",
        "catalyst",
        "I.I.I.I",
        "millenium-fitness",
        "rho-construction",
    ],
    4: [
        "syscore",
        "lexo-corp",
        "aevum-police",
        "alpha-ent",
        "global-pharm",
        "snap-fitness",
        "unitalife",
        "univ-energy",
        "zb-def",
        "nova-med",
        "applied-energetics",
        "run4theh111z",
        ".",
    ],
    5: [
        "darkweb",
        "zb-institute",
        "aerocorp",
        "galactic-cyber",
        "deltaone",
        "omnia",
        "icarus",
        "solaris",
        "defcomm",
        "zeus-med",
        "infocomm",
        "taiyang-digital",
        "microdyne",
        "titan-labs",
        "fulcrumtech",
        "vitalife",
        "stormtech",
        "helios",
        "kuai-gong",
        "omnitek",
        "4sigma",
        "b-and-a",
        "blade",
        "clarkinc",
        "nwo",
        "powerhouse-fitness",
        "megacorp",
        "ecorp",
        "The-Cave",
        "fulcrumassets",
    ],
};

export const SERVERS = Object.values(SERVERS_MAP).flat();

/**
 ** 1TB:  ~$56M
 ** 2TB:  ~$112M
 ** 4TB:  ~$225M
 ** 8TB:  ~$450M
 ** 16TB:  $901.120M
 ** 32TB:  $1.8B
 ** 64TB:  $3.6B
 ** 128TB: $7.2B
 ** 256TB: $14.4B
 **/
export const PREFIX = "serv-";

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
    "iron-gym",
    "phantasy",
    "crush-fitness",
    "silver-helix",
    "omega-net",
    "johnson-ortho",
    "the-hub",
    "comptek",
    "rothman-uni",
    "millenium-fitness",
    "summit-uni",
    "netlink",
    "aevum-police",
    "catalyst",
    "syscore",
    "alpha-ent",
    "rho-construction",
];
export const TARGETS = TARGETS_4;
export const ATTACK_THRESH = 0.75;
