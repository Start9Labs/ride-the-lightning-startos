# Wrapper for ride-the-lightning

This project wraps [ride-the-lightning](https://github.com/Ride-The-Lightning/RTL
) for EmbassyOS. ride-the-lightning is a fully functional user interface to manage lightning node operations.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [appmgr](https://github.com/Start9Labs/embassy-os/tree/master/appmgr)
- [make](https://www.gnu.org/software/make/)

## Cloning

Clone the project locally. Note the submodule link to the original project(s). 

```
git clone git@github.com:Start9Labs/ride-the-lightning-wrapper.git
cd ride-the-lightning-wrapper
git submodule update --init

```

## Building

To build the project, run the following commands:

```
make
```

## Installing (on Embassy)

SSH into an Embassy device.
`scp` the `.s9pk` to any directory from your local machine.
Run the following command to determine successful install:

```
appmgr install ride-the-lightning.s9pk
```
