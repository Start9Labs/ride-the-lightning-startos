import { matches, types as T } from "../deps.ts";

const { shape, boolean } = matches;

const matchClnConfig = shape({
  advanced: shape({
    plugins: shape({
      clnrest: boolean,
    })
  })
});

export const dependencies: T.ExpectedExports.dependencies = {
  "c-lightning": {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check c-lightning");
      const config = matchClnConfig.unsafeCast(configInput);
      if (!config.advanced.plugins.clnrest) {
        return { error: "CLNRest plugin must be enabled"};
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure c-lightning");
      const config = matchClnConfig.unsafeCast(configInput);
      config.advanced.plugins.clnrest = true;
      return { result: config };
    },
  },
};