<p align="center">
  <img src="icon.svg" alt="Ride The Lightning Logo" width="21%">
</p>

# Ride The Lightning on StartOS

> Everything not listed in this document should behave the same as upstream
> RTL. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Ride The Lightning](https://github.com/Ride-The-Lightning/RTL) is a management interface for Lightning nodes. This package can manage the LND or Core Lightning on this server without you handling a credential — it mounts theirs read-only — and can also point at nodes elsewhere.

- **Upstream repo:** <https://github.com/Ride-The-Lightning/RTL>
- **Wrapper repo:** <https://github.com/Start9Labs/ride-the-lightning-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, unmodified.

| Property      | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| Image         | `shahanafarooqui/rtl`                                               |
| Architectures | Whatever the image publishes — the manifest declares no restriction |
| Command       | `node rtl`                                                          |

| Subcontainer | Purpose                                       |
| ------------ | --------------------------------------------- |
| `rtl-sub`    | The `primary` daemon — the one to `attach` to |

## Volume and Data Layout

One volume, plus a read-only view of each internal node's.

| Volume | Mount Point | Purpose                                                                 |
| ------ | ----------- | ----------------------------------------------------------------------- |
| `main` | `/root`     | `RTL-Config.json`, RTL's own database, and the channel backups it takes |

Each internal node's data directory is mounted **read-only** — `/mnt/lnd` or `/mnt/cln` — which is how RTL reads LND's macaroon or Core Lightning's rune. **No node credential is stored by this package**; it reads them in place.

Channel backups RTL takes land under this volume, one directory per node.

## File Models

One model, and it is RTL's own configuration file.

| File              | Format | Modelled                | Written by                           |
| ----------------- | ------ | ----------------------- | ------------------------------------ |
| `RTL-Config.json` | JSON   | Yes — `FileHelper.json` | Every init, `main`, and both actions |

**Enforced** — rewritten whenever the package writes: the listen address and port, and the whole SSO block held off.

**Derived** — each internal node's `lnServerUrl`, rewritten by `main` on every start from the dependency's live bridge address. **Internal nodes are identified by their credential mountpoint, not by their URL** — the macaroon under `/mnt/lnd`, the rune under `/mnt/cln` — because the URL is the thing being rewritten and the mountpoints are stable.

The address is a reactive read, so it changes only when the dependency is installed, uninstalled, or its assigned port moves — a routine LND or CLN update restarts nothing here. **If an internal node's dependency is not reachable, the service refuses to start** with a message naming it, rather than running against an address that does not resolve.

**Set by RTL itself** — the hashed password and the 2FA secret. The package writes the plaintext password field; RTL hashes it on first read and clears it.

**Yours** — the node list, and each node's theme and backup path.

`defaultNodeIndex` is owned by the package rather than left alone: it must match one of the nodes' indexes or **RTL crashes at startup, in its logger constructor**, before anything useful happens. The package keeps it consistent whenever it rewrites the node list.

## Dependencies

Two, both optional, and each declared only while an internal node of that kind is configured.

| Dependency    | Kind      | Required when                      | Health check |
| ------------- | --------- | ---------------------------------- | ------------ |
| `lnd`         | `running` | An internal LND node is configured | `lnd`        |
| `c-lightning` | `running` | An internal CLN node is configured | `lightningd` |

Configuring only external nodes leaves this package with no dependencies at all.

**LND and CLN are reached differently over the bridge.** LND terminates its own TLS, so its URL is `https://`; Core Lightning's REST interface serves plaintext, so its URL is `http://`.

## Network Access and Interfaces

One interface, serving RTL's web UI.

| Interface | Id   | Type | Port | Description              |
| --------- | ---- | ---- | ---- | ------------------------ |
| Web UI    | `ui` | ui   | 80   | The web interface of RTL |

The port is bound on the `main` MultiHost and is not masked.

**RTL's own password is the only thing in front of it**, which is why setting one is a `critical` task. Single sign-on is held off in the config; there is no second authentication layer here.

## Installation and First-Run Flow

Install seeds an empty config and raises two `critical` tasks. **The service cannot start until the first one is done** — with no nodes configured, `main` throws rather than starting a useless daemon.

1. **Set Nodes** — pick the internal LND or Core Lightning on this server, and add any external nodes. Internal nodes need no credential from you: the package mounts the node's data directory read-only and points RTL at the macaroon or rune inside it.
2. **Create Password** — the RTL web UI's password. Shown once.

Both tasks are checked on every start, not only at install, so clearing either brings its task back.

## Actions

Two actions, both available whether or not the service is running.

### Set Nodes

Chooses which Lightning nodes RTL manages.

- **What it changes:** the `nodes` array in `RTL-Config.json`, and through it the package's dependencies, the container's mounts, and the channel-backup directories it creates.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent per node, keyed by name. Removing a node from the list removes it from RTL; **the channel backups it took are left on the volume.**
- **Internal versus external.** An internal node is the LND or CLN on this server, wired up with no credential from you. An external node needs its own URL and macaroon, which you supply.
- **Node indexes are renumbered positionally** when the list is rewritten, and the default-node index is kept pointing at a real entry.

### Create Password / Reset Password

One action whose name flips once a password exists.

- **What it changes:** the password field in `RTL-Config.json`; RTL hashes it on its next start.
- **Cost:** seconds, then a restart.
- **Repeat safety:** safe to re-run; each run replaces the previous password.
- **Outputs:** the new password, shown once.

## Tasks

Two tasks, and both can come back.

| Task            | Severity   | Raised when             | Cleared when    |
| --------------- | ---------- | ----------------------- | --------------- |
| Set Nodes       | `critical` | No nodes are configured | The action runs |
| Create Password | `critical` | No password is set      | The action runs |

Both are checked on every init rather than only at install. Both are `critical` for the same reason: with no nodes the service will not start at all, and with no password the web UI — which can move funds — has nothing in front of it.

## Health Checks

One check, on the only daemon.

| Check     | Displayed       | Method               |
| --------- | --------------- | -------------------- |
| `primary` | "Web Interface" | Port 80 is listening |

RTL binds quickly, so a failure means it did not start. The two common causes are both configuration: a node list RTL rejects, or a default-node index pointing at an entry that does not exist — the latter crashes it before it logs anything useful about why.

A service that will not start with a clear message about a node being unreachable is the deliberate refusal described above: the dependency is not running, or has not published its address yet.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** `RTL-Config.json` with the node list, the hashed password, and any external node's macaroon; RTL's own database; and every channel backup it has taken.
- **Not included:** anything belonging to LND or Core Lightning. Channel state and funds are those packages' backups — the channel-backup files here are RTL's copies, not a substitute.
- **Restore:** complete, and no task is raised. Internal nodes' URLs are re-resolved on the first start, so a node now on a different port is repaired automatically. External nodes keep the URLs you gave them.

## Limitations and Differences

1. **The service will not start with no nodes configured.** That is a deliberate refusal, not a crash.
2. **It will not start when an internal node's dependency is unreachable**, rather than running against a dead address.
3. **`defaultNodeIndex` must point at a real node** or RTL crashes at startup; the package owns it for that reason.
4. **Single sign-on is held off.** The RTL password is the only authentication.
5. **Removing a node leaves its channel backups on the volume.**
6. **Internal node credentials are never copied** — the node's directory is mounted read-only and read in place.
7. **The manifest declares no architecture restriction**, so which architectures work is whatever the published image covers.

---

## Quick Reference for AI Consumers

```yaml
package_id: ride-the-lightning
image: shahanafarooqui/rtl
architectures: as published by the image # the manifest declares no restriction
subcontainers:
  - rtl-sub # the only container
volumes:
  main: /root
file_models:
  - /root/RTL-Config.json
startos_managed_env_vars:
  - RTL_CONFIG_PATH
dependencies: # each declared only while an internal node of that kind exists
  - lnd # /mnt/lnd, read-only
  - c-lightning # /mnt/cln, read-only
interfaces:
  ui: { type: ui, port: 80 }
actions:
  - set-nodes
  - reset-password # name flips Create/Reset
tasks:
  - { action: set-nodes, severity: critical } # re-raises whenever no node exists
  - { action: reset-password, severity: critical } # re-raises whenever no password exists
health_checks:
  - primary # displayed "Web Interface"
```
