import { matches, compat, types as T } from "../deps.ts";
const {shape, literal} = matches
const matchIsRest = shape({advanced:shape({plugin: shape({rest: literal(true)})})}).test

// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: T.Config,
) => {
  const dependsOnCln: { [key: string]: string[] } = matchIsRest(newConfig) ? { "c-lightning": [] } : {};
  return compat.setConfig(effects, newConfig, {
    ...dependsOnCln,
  });
};