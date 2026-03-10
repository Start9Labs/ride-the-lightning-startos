<p align="center">
  <img src="icon.svg" alt="Ride The Lightning Logo" width="21%">
</p>

# Ride The Lightning on StartOS

> **Upstream docs:** <https://github.com/Ride-The-Lightning/RTL>
>
> Everything not listed in this document should behave the same as upstream
> RTL. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[Ride The Lightning](https://github.com/Ride-The-Lightning/RTL) is a full-function, device-agnostic web user interface for managing Lightning nodes. RTL connects directly to your StartOS LND and/or CLN node and is accessible from any browser.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | `shahanafarooqui/rtl:v0.15.8` (upstream unmodified) |
| Architectures | x86_64, aarch64 |
| Command | `node rtl` |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/root` | RTL configuration and data |

**Key paths on the `main` volume:**

- `RTL-Config.json` — main configuration file
- `backup/Internal-LND/` — LND channel backups
- `backup/Internal-CLN/` — CLN channel backups
- `backup/{node-name}/` — remote node backups
- `remote-macaroons/{node-name}/` — remote node credentials

**Dependency mounts:**

- `/mnt/lnd` — LND volume (read-only, when configured)
- `/mnt/cln` — Core Lightning volume (read-only, when configured)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | npm install / Docker | Install from marketplace |
| Configuration | Edit RTL-Config.json manually | Managed via actions |
| Node connection | Manual URL and macaroon setup | Auto-configured for internal nodes |
| Password | Set in config file | Create via action |

**First-run steps:**

1. Install at least one Lightning node (LND or Core Lightning)
2. Install RTL from the StartOS marketplace
3. Run "Set Nodes" to select which Lightning nodes to manage
4. Run "Create Password" to set your login password
5. Access the web UI and log in

---

## Configuration Management

### Auto-Configured by StartOS

| Setting | Value | Purpose |
|---------|-------|---------|
| `host` | `0.0.0.0` | Bind address |
| `port` | `80` | Web UI port |
| `RTL_CONFIG_PATH` | `/root` | Config file location |
| `SSO.rtlSSO` | `0` | SSO disabled |

### Managed via Actions

| Setting | Action | Purpose |
|---------|--------|---------|
| Node list | Set Nodes | Configure internal and remote Lightning nodes |
| Password | Reset Password | Set or reset the login password |
| Lightning URLs | Set Nodes | Auto-configured for internal LND/CLN |
| Macaroon paths | Set Nodes | Auto-configured for internal nodes |

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 80 | HTTP | RTL web interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Set Nodes

| Property | Value |
|----------|-------|
| ID | `set-nodes` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Configure which Lightning nodes RTL manages |

**Inputs:**

- **Internal Nodes** (multi-select) — LND and/or CLN from your StartOS
- **Remote Nodes** (list) — external Lightning nodes with:
  - Implementation (LND or CLN)
  - Node name (alphanumeric)
  - REST server URL
  - Base64URL-encoded macaroon

Internal nodes are auto-configured with correct URLs and credential paths. Remote nodes require manual macaroon entry.

### Reset Password

| Property | Value |
|----------|-------|
| ID | `reset-password` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Create or reset the login password |

Generates a random 22-character password. The result is displayed once (masked, copyable). RTL will hash it on next startup.

---

## Dependencies

| Dependency | Required | Version | Purpose |
|------------|----------|---------|---------|
| LND | Optional | >=0.19.3-beta | Lightning node management |
| Core Lightning | Optional | >=25.9 | Lightning node management |

Dependencies are dynamically resolved based on which internal nodes are configured. At least one Lightning node (internal or remote) is needed for RTL to be useful.

---

## Backups and Restore

**Included in backup:**

- `main` volume — configuration, channel backups, remote credentials

**Restore behavior:**

- All configuration and credentials restored
- Channel backup files preserved
- No reconfiguration needed

---

## Health Checks

| Check | Display Name | Method | Messages |
|-------|--------------|--------|----------|
| Web UI | Web Interface | Port 80 listening | Ready / Not ready |

---

## Limitations and Differences

1. **No setup wizard** — node configuration is handled via the "Set Nodes" action instead of editing RTL-Config.json
2. **Password management** — passwords are set via action, not config file
3. **SSO disabled** — single sign-on is not available
4. **Theme defaults** — internal nodes default to NIGHT mode with PINK theme color

---

## What Is Unchanged from Upstream

- Full Lightning node management (channels, payments, invoices)
- LND and Core Lightning support
- Multi-node management
- Channel backup functionality
- On-chain wallet management
- Loop/Pool/Boltz integration (LND)
- Liquidity management
- Routing fee management
- All web UI features
- Two-factor authentication

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: ride-the-lightning
upstream_version: 0.15.8
image: shahanafarooqui/rtl:v0.15.8
architectures: [x86_64, aarch64]
volumes:
  main: /root
ports:
  ui: 80
dependencies:
  lnd:
    required: false
    min_version: ">=0.19.3-beta"
  c-lightning:
    required: false
    min_version: ">=25.9"
actions:
  - set-nodes (enabled, any)
  - reset-password (enabled, any)
health_checks:
  - webui: port_listening 80
backup_volumes:
  - main
startos_managed_config:
  host: 0.0.0.0
  port: 80
  RTL_CONFIG_PATH: /root
  SSO.rtlSSO: 0
not_available:
  - Single sign-on (SSO)
  - Config file editing (managed via actions)
```
