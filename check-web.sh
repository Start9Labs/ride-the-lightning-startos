#!/bin/bash

set -ea

DURATION=$(</dev/stdin)
if (($DURATION <= 30000 )); then 
    exit 60
else
    curl --silent --show-error --fail ride-the-lightning.embassy:80
    RES=$?
    if test "$RES" != 0; then
        echo "Web interface is unreachable"
        exit 1
    else 
        exit 0
    fi
fi
