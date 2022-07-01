import { matches, types as T } from "../deps.ts";

const { shape, arrayOf, string, boolean } = matches;

const matchLndConfig = shape({
  nodes: shape({
    type: string,
  }),
});

const matchClnConfig = shape({
  nodes: shape({
    type: string,
  }),
});

function times<T>(fn: (i: number) => T, amount: number): T[] {
  const answer = new Array(amount);
  for (let i = 0; i < amount; i++) {
    answer[i] = fn(i);
  }
  return answer;
}

function randomItemString(input: string) {
  return input[Math.floor(Math.random() * input.length)];
}

const serviceName = "ride-the-lightning";
const fullChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
type Check = {
  currentError(config: T.Config): string | void;
  fix(config: T.Config): T.Config;
};

export const dependencies: T.ExpectedExports.dependencies = {
  lnd: {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check lnd");
      const config = matchLndConfig.unsafeCast(configInput);
      if (config.nodes.type !== "lnd") {
        return { error: "Must have LND selected" };
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure lnd");
      const config = matchLndConfig.unsafeCast(configInput);
      config.nodes.type = "lnd";
      return { result: config };
    },
  },
  "c-lightning": {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check c-lightning");
      const config = matchLndConfig.unsafeCast(configInput);
      if (config.node.type !== "c-lightning") {
        return { error: "Must have CLN selected" };
      }
      return { result: null };
    },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure c-lightning");
      const config = matchLndConfig.unsafeCast(configInput);
      config.nodes.type = "lnd";
      return { result: config };
    },
  },
};
