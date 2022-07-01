import { compat, types as T } from "../deps.ts";

// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: T.Config,
) => {
  // deno-lint-ignore no-explicit-any
  const dependsOnCln: { [key: string]: string[] } = (newConfig as any) ?.nodes?.find((x: any) => x?.type ===  'c-lightning') ? { "c-lightning": [] } : {};
  // deno-lint-ignore no-explicit-any
  const dependsOnLnd: { [key: string]: string[] } = (newConfig as any) ?.nodes?.find((x: any) => x?.type ===  'lnd') ? { "lnd": [] } : {};
  return compat.setConfig(effects, newConfig, {
    ...dependsOnCln,
    ...dependsOnLnd,
  });
};
