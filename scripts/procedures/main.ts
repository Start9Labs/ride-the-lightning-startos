import { types as T } from "../deps.ts";

export const main: T.ExpectedExports.main = async (effects) => {
  return await effects.runDaemon(
    {
      command: "docker_entrypoint.sh",
      args: [],
    },
  ).wait();
};
