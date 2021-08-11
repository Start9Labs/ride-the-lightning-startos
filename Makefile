ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
VERSION_TAG := $(shell git --git-dir=RTL/.git describe --abbrev=0)
VERSION := $(VERSION_TAG:v%=%)
RTL_GIT_REF := $(shell cat .git/modules/RTL/HEAD)
RTL_GIT_FILE := $(addprefix .git/modules/RTL/,$(if $(filter ref:%,$(RTL_GIT_REF)),$(lastword $(RTL_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock

.DELETE_ON_ERROR:

all: ride-the-lightning.s9pk

install: ride-the-lightning.s9pk
	embassy-sdk pack

ride-the-lightning.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md $(ASSET_PATHS)
	appmgr -vv pack $(shell pwd) -o ride-the-lightning.s9pk
	appmgr -vv verify ride-the-lightning.s9pk

image.tar: Dockerfile docker_entrypoint.sh configurator/target/aarch64-unknown-linux-musl/release/configurator $(RTL_GIT_FILE)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/ride-the-lightning --build-arg BITCOIN_VERSION=$(BITCOIN_VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo +beta build --release
	docker run --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl musl-strip target/aarch64-unknown-linux-musl/release/configurator
