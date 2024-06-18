# Wrapper for ride-the-lightning

This project wraps [ride-the-lightning](https://github.com/Ride-The-Lightning/RTL
) for StartOS. ride-the-lightning is a fully functional user interface to manage lightning node operations.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [deno](https://deno.land/)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/blob/v0.3.5.1/core/install-sdk.sh)

## Build environment

Before building the Ride The Lightning package, your build environment must be setup for building StartOS services. Instructions for setting up the proper build environment can be found in the [Developer Docs](https://docs.start9.com/latest/developer-docs/packaging).

## Cloning

Clone the project locally. Note the submodule link to the original project(s). 

```
git clone git@github.com:Start9Labs/ride-the-lightning-wrapper.git
cd ride-the-lightning-wrapper
git submodule update --init
cd RTL
npm install --omit=dev --legacy-peer-deps
```

## Building

To build the **ride-the-lightning** service as a universal package, run the following command:

```
make
```

Alternatively the package can be built for individual architectures by specifying the architecture as follows:

```
make x86
```

or

```
make arm
```

## Installing (on StartOS)

Run the following commands to determine successful install:
> :information_source: Change server-name.local to your Start9 server address

```
start-cli auth login
#Enter your StartOS password
start-cli --host https://server-name.local package install ride-the-lightning.s9pk
```

If you already have your `start-cli` config file setup with a default `host`, you can install simply by running:

```
make install
```

> **Tip:** You can also install the `ride-the-lightning.s9pk` using **Sideload Service** under the **System > Manage** section.