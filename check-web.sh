#!/bin/bash

DURATION=$(</dev/stdin)
if (($DURATION <= 30000 )); then 
    exit 60
else
    curl --silent --fail ride-the-lightning.embassy:80
    RES=$?
    if test "$RES" != 0; then
        echo "Web interface is unreachable" >&2
        exit 1
    fi
fi
