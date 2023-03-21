import { Configuration } from "./configuration";
import { Server } from "http";

export const stop = async () => {
  throw "NYI";
};

export const start = (
  getConfiguration: () => Promise<Configuration>,
): Promise<Server> => {
  throw "NYI";
};
