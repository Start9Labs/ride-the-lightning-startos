# CLAUDE.md

See [CONTRIBUTING.md](CONTRIBUTING.md) for the doc map and contribution workflow.

## TODOs

- **Remove the rune-file wait loop in `startos/main.ts` once [upstream RTL #1601](https://github.com/Ride-The-Lightning/RTL/pull/1601) ships in a bundled RTL release.** The loop polls `/mnt/cln/.commando-env` before letting the daemon run; it's a workaround for upstream RTL's `setOptions` cache poisoning when CLN's rune file isn't yet present on first read. When upstream is in, the wait becomes redundant — `setOptions` will retry per-node on its own.
