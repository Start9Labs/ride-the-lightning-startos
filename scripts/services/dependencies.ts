import { matches, types as T } from "../deps.ts";

const { shape, boolean } = matches;

const matchClnConfig = shape({
  advanced: shape({
    plugins: shape({
      rest: boolean,
    })
  })
});

export const dependencies: T.ExpectedExports.dependencies = {
  "c-lightning": {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check c-lightning");
      const config = matchClnConfig.unsafeCast(configInput);
      if (!config.advanced.plugins.rest) {
        return { error: "C-Lightning-REST plugin must be enabled"};
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure c-lightning");
      const config = matchClnConfig.unsafeCast(configInput);
      config.advanced.plugins.rest = true;
      return { result: config };
    },
  },
};