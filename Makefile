ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
CONFIGURATOR_SRC := $(shell find ./configurator/src) configurator/Cargo.toml configurator/Cargo.lock
# RTL_GIT_REF := $(shell cat .git/modules/RTL/HEAD)
# RTL_GIT_FILE := $(addprefix .git/modules/RTL/,$(if $(filter ref:%,$(RTL_GIT_REF)),$(lastword $(RTL_GIT_REF)),HEAD))
RTL_SRC := $(shell find ./RTL/src)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
PKG_ID := $(shell yq e ".id" manifest.yaml)
VERSION := $(shell yq e ".version" manifest.yaml)
HEALTH_CHECK := $(shell find ./check-web.sh)
TS_FILES := $(shell find . -name \*.ts )

.DELETE_ON_ERROR:

all: verify

clean:
	rm -rf docker-images
	rm -f  $(PKG_ID).s9pk
	rm -f image.tar
	rm -f scripts/*.js

verify: $(PKG_ID).s9pk
	embassy-sdk verify s9pk $(PKG_ID).s9pk

install: $(PKG_ID).s9pk
	embassy-cli package install $(PKG_ID).s9pk

# ride-the-lightning.s9pk: manifest.yaml assets/compat/* image.tar instructions.md scripts/embassy.js $(ASSET_PATHS)
$(PKG_ID).s9pk: manifest.yaml instructions.md scripts/embassy.js LICENSE docker-images/aarch64.tar docker-images/x86_64.tar
	if ! [ -z "$(ARCH)" ]; then cp docker-images/$(ARCH).tar image.tar; fi
	embassy-sdk pack

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh configurator/target/aarch64-unknown-linux-musl/release/configurator $(RTL_SRC)
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --build-arg ARCH=aarch64 --build-arg PLATFORM=arm64 --platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh configurator/target/x86_64-unknown-linux-musl/release/configurator $(RTL_SRC)
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --build-arg ARCH=x86_64 --build-arg PLATFORM=amd64 --platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .

# image.tar: Dockerfile docker_entrypoint.sh check-web.sh configurator/target/aarch64-unknown-linux-musl/release/configurator migrations/* $(RTL_GIT_FILE) $(HEALTH_CHECK)
# 	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --no-cache --tag start9/ride-the-lightning/main:$(VERSION) --platform=linux/arm64 -o type=docker,dest=image.tar .

configurator/target/aarch64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo +beta build --release

configurator/target/x86_64-unknown-linux-musl/release/configurator: $(CONFIGURATOR_SRC)
	docker run --rm -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/configurator:/home/rust/src start9/rust-musl-cross:x86_64-musl cargo build --release

scripts/embassy.js: $(TS_FILES)
	deno bundle scripts/embassy.ts scripts/embassy.js
