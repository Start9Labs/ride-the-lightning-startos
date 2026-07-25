# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `ride-the-lightning`.** RTL is a web UI for managing lightning nodes. It has two optional dependencies — `lnd` and `c-lightning` (CLN) — and the node list is user-managed via the `set-nodes` action, persisted in `RTL-Config.json`.
- **Internal nodes reach LND/CLN over the LXC bridge, not `.startos` DNS** (retired in StartOS 0.4.x). The `sdk.host.getBridgeAddress` in `utils.ts` resolves a dependency binding’s derived bridge address. `main.ts` chains `.const()` on it and rewrites the internal nodes' `lnServerUrl` each start: LND’s REST on the `control` host / `restPort` (HTTPS — terminated by the StartOS proxy, which the mounted `tls.cert` fullchain still validates), CLN's clnrest on host id `clnrest` / `clnrestPort` (HTTP — clnrest serves plaintext). `controlHostId`/`restPort` import from `lnd-startos/startos/interfaces`, `clnrestPort` from `cln-startos/startos/utils`; the `clnrest` host id stays a literal since cln exports only `peer`/`watchtower`. The bridge address changes only on dependency install/uninstall/port-change, so RTL restarts to heal exactly then and never on dependency updates. The `set-nodes` action resolves the same address via the helper's `.once()` (left absent — `lnServerUrl` is optional — when the dep isn't installed), so main's first merge is a no-op rather than an extra restart.
- **Internal vs remote nodes are distinguished by credential mountpoint** (`/mnt/lnd`, `/mnt/cln`), never by the server URL — `hasInternal` in `utils.ts` — because main rewrites that URL to a bridge IP.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach ride-the-lightning -n rtl-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `rtl-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
