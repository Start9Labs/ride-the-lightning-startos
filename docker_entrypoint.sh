#!/bin/bash

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export RTL_CONFIG_PATH=/root

rm -rf /root/cl-external-* /root/lnd-external-*

echo start9/public > /root/.backupignore
echo start9/shared >> /root/.backupignore

result=$(yq '.nodes.[] | select(.connection-settings.type == "internal" and .type == "lnd")' /root/start9/config.yaml)
if [[ ! -z $result ]]
  then

  if ! test -d /mnt/lnd
  then
    echo "LND mountpoint does not exist"
    exit 0
  fi

  while ! test -f /mnt/lnd/admin.macaroon
  do
    echo "Waiting for LND admin macaroon to be generated..."
    sleep 1
  done
fi

result=$(yq '.nodes.[] | select(.connection-settings.type == "internal" and .type == "c-lightning")' /root/start9/config.yaml)
if [[ ! -z $result ]]
  then

  if ! test -d /mnt/c-lightning
  then
    echo "Core Lightning mountpoint does not exist"
    exit 0
  fi

  while ! test -f /mnt/c-lightning/access.macaroon
  do
    echo "Waiting for c-Lightning-REST access macaroon to be generated..."
    sleep 1
  done
fi

configurator
exec tini -g -- node rtl
