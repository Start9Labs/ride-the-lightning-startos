import { compat, matches, types as T } from "../deps.ts";

const { shape, string, array, object, unknown } = matches;

const hasLnd = matches.shape({
  lnd: object,
}).test;

const hasNodes = shape({
  nodes: array,
  lnd: unknown,
}, ["lnd"]).test;

const isNodeShape = shape({
  type: string,
  "connection-settings": shape({
    type: string,
  }),
}).test;

const omit = <Obj extends {}, Key extends String & keyof Obj>(
  obj: Obj,
  omitKey: Key,
): Omit<Obj, Key> => {
  // deno-lint-ignore no-explicit-any
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== omitKey),
  ) as any;
};

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping(
    {
      // 0.11.0.1: initial version
      // 0.12.2: no migration needed
      "0.12.3": {
        up: compat.migrations.updateConfig(
          async (config, effects) => {
            await effects.removeDir({
              path: "lnd-external",
              volumeId: "main",
            }).catch((_) => {});

            if (hasLnd(config)) {
              return omit({
                ...config,
                nodes: [{
                  type: "lnd",
                  name: "Embassy LND",
                  "connection-settings": config.lnd,
                }],
              }, "lnd");
            }
            return config;
          },
          true,
          { version: "0.12.3", type: "up" },
        ),
        down: compat.migrations.updateConfig(
          async (config, effects) => {
            if (hasNodes(config)) {
              // select the first lnd node, sorted by {external, internal} (so external will always appear first) and use that as the official single node
              const oldNodes = config.nodes.filter(isNodeShape).filter((x) =>
                x.type === "lnd"
              );
              oldNodes.sort((left, right) =>
                left["connection-settings"].type.localeCompare(
                  right["connection-settings"].type,
                )
              );
              effects.debug(`oldNodes = ${JSON.stringify(oldNodes)}`);
              await effects.removeFile({
                path: "RTL-Config.json",
                volumeId: "main",
              }).catch((_) => {});
              return omit({
                ...config,
                lnd: oldNodes[0]?.["connection-settings"],
              }, "nodes") as T.Config;
            }
            return config;
          },
          false,
          { version: "0.12.3", type: "down" },
        ),
      },
    },
    "0.13.5",
  );
