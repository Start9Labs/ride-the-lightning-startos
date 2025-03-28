# ---------------
# Install Dependencies
# ---------------
FROM node:20-alpine as builder

RUN apk add --no-cache \
  python3 \
  make \
  g++

ENV PYTHON=/usr/bin/python3

WORKDIR /RTL

COPY ./RTL/package.json /RTL/package.json
COPY ./RTL/package-lock.json /RTL/package-lock.json

RUN npm install --legacy-peer-deps

# ---------------
# Build App
# ---------------
COPY ./RTL .

# Build the Angular application
RUN npm run buildfrontend

# Build the Backend from typescript server
RUN npm run buildbackend

# Remove non production necessary modules
RUN npm prune --production --legacy-peer-deps

# ---------------
# Release App
# ---------------
FROM node:20-alpine as runner

ARG ARCH

RUN apk add --no-cache \
  bash \
  curl \
  iproute2 \
  yq \
  tini

WORKDIR /RTL

COPY --from=builder /RTL/rtl.js ./rtl.js
COPY --from=builder /RTL/package.json ./package.json
COPY --from=builder /RTL/frontend ./frontend
COPY --from=builder /RTL/backend ./backend
COPY --from=builder /RTL/node_modules/ ./node_modules

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh
ADD ./check-web.sh /usr/local/bin/check-web.sh
RUN chmod +x /usr/local/bin/check-web.sh
ADD ./configurator/target/${ARCH}-unknown-linux-musl/release/configurator /usr/local/bin/configurator
RUN chmod +x /usr/local/bin/configurator
ADD ./migrations /usr/local/bin/migrations
RUN chmod a+x /usr/local/bin/migrations/*

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
