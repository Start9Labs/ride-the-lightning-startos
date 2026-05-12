# Ride The Lightning

## Documentation

- [Ride The Lightning on GitHub](https://github.com/Ride-The-Lightning/RTL) — the upstream project, including the README and detailed configuration reference.

## What you get on StartOS

- A **Web UI** for managing one or more Lightning nodes from a single dashboard — channels, on-chain wallet, payments, invoices, routing, and channel backups.
- Automatic wiring to your StartOS **LND** and/or **Core Lightning** nodes when you select them — RTL gets the right REST URL and credentials without you copying macaroons.
- Optional remote Lightning nodes you connect to by REST URL and a base64url-encoded macaroon (LND) or rune (CLN).

## Getting set up

RTL posts two critical tasks after install. Both must be completed before the service starts.

1. Run **Set Nodes** and choose which Lightning nodes RTL should manage:
   - Pick any combination of your installed StartOS **LND** and **Core Lightning** as **Internal Nodes**. The selection drives RTL's dependency set, so install at least one of them first if you want internal management.
   - Add any **Remote Nodes** you want to manage from this RTL instance. For each, provide a name (letters and digits only), the node's REST URL (not a `.onion`), and the admin macaroon (LND) or access macaroon (CLN) base64url-encoded.
2. Run **Create Password**. RTL generates a 22-character password and shows it once — copy it into a password manager before dismissing the dialog. You will use it to log in to the Web UI.

Once both tasks are done, start RTL and open the **Web UI** interface. Log in with the generated password.

## Using Ride The Lightning

### Web UI

The Web UI is RTL itself — multi-node dashboard with channel management, payments, invoices, on-chain wallet, routing analytics, and per-node channel backups (LND) or emergency recovery (CLN). The full upstream documentation applies once you're logged in.

### Actions

- **Set Nodes** — change which internal nodes RTL manages and edit the list of remote nodes. Selecting or deselecting an internal node updates RTL's dependency on that service. Re-run any time you add a node or rotate a remote macaroon.
- **Reset Password** — generate a new 22-character login password. The password is shown once; save it before dismissing. Run this if you've lost the password or want to rotate it.
