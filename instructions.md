# Ride The Lightning

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting wallets and dashboards to a Lightning node on StartOS.
- [Ride The Lightning on GitHub](https://github.com/Ride-The-Lightning/RTL) — the upstream project, including the README and detailed configuration reference.

## What you get on StartOS

- A **Web UI** for managing one or more Lightning nodes from a single dashboard — channels, on-chain wallet, payments, invoices, routing, and channel backups.
- Automatic wiring to your StartOS **LND**, **Core Lightning** and **Eclair** nodes when you select them — RTL gets the right URL and credentials without you copying macaroons or passwords.
- Optional remote LND and Core Lightning nodes you connect to by REST URL and a base64url-encoded admin macaroon (LND) or a rune (CLN). A remote Eclair node cannot be added here.

## Getting set up

RTL posts two critical tasks after install. Both must be completed before the service starts.

1. Run **Set Nodes** and choose which Lightning nodes RTL should manage:
   - Pick any combination of your installed StartOS **LND**, **Core Lightning** and **Eclair** as **Internal Nodes**. The selection drives RTL's dependency set, so install at least one of them first if you want internal management. Eclair also needs its API password set — run its **Set API Password** action before selecting it here, or RTL will refuse to start.
   - Add any **Remote Nodes** you want to manage from this RTL instance. For each, provide a name (letters and digits only), the node's REST URL (not a `.onion`), and either the admin macaroon base64url-encoded (LND) or a rune from `lightning-cli createrune` (CLN).
2. Run **Create Password**. RTL generates a 22-character password and shows it once — copy it into a password manager before dismissing the dialog. You will use it to log in to the Web UI.

Once both tasks are done, start RTL and open the **Web UI** interface. Log in with the generated password.

## Using Ride The Lightning

### Web UI

The Web UI is RTL itself — multi-node dashboard with channel management, payments, invoices, on-chain wallet, routing analytics, and per-node channel backups (LND) or emergency recovery (CLN). The full upstream documentation applies once you're logged in.

### Actions

- **Set Nodes** — change which internal nodes RTL manages and edit the list of remote nodes. Selecting or deselecting an internal node updates RTL's dependency on that service. Re-run any time you add a node or rotate a remote macaroon or rune. Each node keeps the RTL settings you changed in its UI.
- **Reset Password** — generate a new 22-character login password, replacing the current one after you confirm. The password is shown once; save it before dismissing. Run this if you've lost the password or want to rotate it.
