# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `ride-the-lightning`.** RTL is a web UI for managing lightning nodes. It has two optional dependencies — `lnd` and `c-lightning` (CLN) — and the node list is user-managed via the `set-nodes` action, persisted in `RTL-Config.json`.
- **Internal nodes reach LND/CLN over the LXC bridge, not `.startos` DNS** (retired in StartOS 0.4.x). `main.ts` resolves the live bridge addresses each start and rewrites the internal nodes' `lnServerUrl`: LND's REST via `sdk.host.get` against LND's `control` host (`controlHostId`/`lndconnectRestId` imported from `lnd-startos/startos/interfaces`, HTTPS — LND terminates its own TLS), and CLN's clnrest via host/interface id `clnrest` (referenced by literal, since cln exports only `peer`/`watchtower`; HTTP — clnrest serves plaintext). The `set-nodes` action writes placeholder `.startos` URLs that main overrides.
- **Internal vs remote nodes are distinguished by credential mountpoint** (`/mnt/lnd`, `/mnt/cln`), never by the server URL — `hasInternal` in `utils.ts` — because main rewrites that URL to a bridge IP.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach ride-the-lightning -n rtl-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `rtl-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
