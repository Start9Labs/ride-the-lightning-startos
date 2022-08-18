ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
RTL_GIT_REF := $(shell cat .git/modules/RTL/HEAD)
RTL_GIT_FILE := $(addprefix .git/modules/RTL/,$(if $(filter ref:%,$(RTL_GIT_REF)),$(lastword $(RTL_GIT_REF)),HEAD))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock
VERSION := $(shell yq e ".version" manifest.yaml)
HEALTH_CHECK := $(shell find ./check-web.sh)
TS_FILES := $(shell find . -name \*.ts )

.DELETE_ON_ERROR:

all: verify

verify: ride-the-lightning.s9pk
	embassy-sdk verify s9pk ride-the-lightning.s9pk

install: all ride-the-lightning.s9pk
	embassy-cli package install ride-the-lightning.s9pk

ride-the-lightning.s9pk: manifest.yaml assets/compat/* image.tar instructions.md scripts/embassy.js $(ASSET_PATHS)
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh check-web.sh configurator/target/aarch64-unknown-linux-musl/release/configurator migrations/* $(RTL_GIT_FILE) $(HEALTH_CHECK)
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --no-cache --tag start9/ride-the-lightning/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo +beta build --release

scripts/embassy.js: $(TS_FILES)
	deno bundle scripts/embassy.ts scripts/embassy.js

clean:
	rm -f image.tar
	rm -f ride-the-lightning.s9pk
	rm -f scripts/*.js
