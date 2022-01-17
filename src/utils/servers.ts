import { NS, Server } from "bitburner";
import { SERVERS } from "/scripts/constants";

export const getServers = (ns: NS): Array<Server> => {
  return SERVERS.map((server) => ns.getServer(server));
};
