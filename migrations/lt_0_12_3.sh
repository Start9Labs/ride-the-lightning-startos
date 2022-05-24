#!/bin/bash

set -ea

if [ $1 = "from" ]; then
    yq -i '.nodes = [{"type": "lnd", "name":"Embassy LND", "connection-settings": .lnd}] | del(.lnd)' /root/start9/config.yaml
    echo '{"configured": true }'
    exit 0
elif [ $1 = "to" ]; then
    # select the first lnd node, sorted by {external, internal} (so external will always appear first) and use that as the official single node
    yq -i '.lnd = (.nodes | map(select(.type == "lnd")) | sort_by(.connection-settings.type).0.connection-settings) | del(.nodes)' /root/start9/config.yaml
    rm -rf /root/RTL-Config.json /root/cl-external-* /root/lnd-external-*
    echo '{"configured": false }'
    exit 0
else
    echo "FATAL: Invalid argument: {from, to}. Migration failed." >&2
    exit 1
fi
