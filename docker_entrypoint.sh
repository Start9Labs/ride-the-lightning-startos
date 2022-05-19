#!/bin/bash

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export RTL_CONFIG_PATH=/root

echo start9/public > /root/.backupignore
echo start9/shared >> /root/.backupignore

lnd_type=$(yq e '.lnd.type' /root/start9/config.yaml)
if [[ $lnd_type = "internal" ]]
  then

  if ! test -d /mnt/lnd
  then
    echo "LND mountpoint does not exist"
    exit 0
  fi

  while ! test -f /mnt/lnd/tls.cert
  do
      echo "Waiting for LND cert to be generated..."
      sleep 1
  done

  while ! test -f /mnt/lnd/admin.macaroon
  do
    echo "Waiting for LND admin macaroon to be generated..."
    sleep 1 
  done
fi

configurator
exec tini -g -- node rtl
