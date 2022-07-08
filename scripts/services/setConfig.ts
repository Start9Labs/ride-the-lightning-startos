import { compat, types as T } from "../deps.ts";

// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: T.Config,
) => {
  const dependsOnCln: { [key: string]: string[] } = (newConfig as any).advanced.plugins.rest ? { "c-lightning": [] } : {};
  return compat.setConfig(effects, newConfig, {
    ...dependsOnCln,
  });
};
