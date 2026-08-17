# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`main` throws rather than starting without a resolvable node address.** A fabricated loopback placeholder would just pretend to be the dependency and could never work; failing loudly with the dependency named is the intended behaviour.
- **LND is `https://`, clnrest is `http://`.** LND terminates its own TLS over the bridge; Core Lightning's REST interface serves plaintext. Getting this backwards fails at connect time with an opaque error.
