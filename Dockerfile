# ---------------
# Install Dependencies
# ---------------
FROM node:16-stretch-slim as builder

ADD https://github.com/krallin/tini/releases/download/v0.19.0/tini-static-arm64 /tini
RUN chmod +x /tini

WORKDIR /RTL

COPY ./RTL/package.json /RTL/package.json
COPY ./RTL/package-lock.json /RTL/package-lock.json

RUN npm install

# ---------------
# Build App
# ---------------
COPY ./RTL .

# Build the Angular application
RUN npm run buildfrontend

# Build the Backend from typescript server
RUN npm run buildbackend

# Remove non production necessary modules
RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM arm64v8/node:16-stretch-slim as runner

RUN apt update
RUN apt install -y bash curl iproute2 wget

WORKDIR /RTL

COPY --from=builder /RTL/rtl.js ./rtl.js
COPY --from=builder /RTL/package.json ./package.json
COPY --from=builder /RTL/frontend ./frontend
COPY --from=builder /RTL/backend ./backend
COPY --from=builder /RTL/node_modules/ ./node_modules
COPY --from=builder "/tini" /sbin/tini

RUN wget https://github.com/mikefarah/yq/releases/download/v4.25.1/yq_linux_arm.tar.gz -O - |\
  tar xz && mv yq_linux_arm /usr/bin/yq

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh
ADD ./check-web.sh /usr/local/bin/check-web.sh
RUN chmod +x /usr/local/bin/check-web.sh
ADD ./configurator/target/aarch64-unknown-linux-musl/release/configurator /usr/local/bin/configurator
RUN chmod +x /usr/local/bin/configurator
ADD ./migrations /usr/local/bin/migrations
RUN chmod a+x /usr/local/bin/migrations/*

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
