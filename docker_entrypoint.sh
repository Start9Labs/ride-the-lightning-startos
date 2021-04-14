#!/bin/sh

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
export RTL_CONFIG_PATH=/root

echo start9/public > .backupignore
echo start9/shared >> .backupignore

configurator
exec tini -g -- node rtl
