FROM node:16-alpine

RUN apk update
RUN apk add --no-cache bash tini curl bash

WORKDIR /RTL

COPY ./RTL/package.json /RTL/package.json
COPY ./RTL/package-lock.json /RTL/package-lock.json

# Install dependencies
RUN npm install --only=prod --force
RUN wget https://github.com/mikefarah/yq/releases/download/v4.25.1/yq_linux_arm.tar.gz -O - |\
  tar xz && mv yq_linux_arm /usr/bin/yq

COPY ./RTL /RTL

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
