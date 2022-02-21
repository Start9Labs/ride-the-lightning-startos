#!/bin/bash

DURATION=$(</dev/stdin)
if (($DURATION <= 30000 )); then 
    exit 60
else
    curl --silent --fail ride-the-lightning.embassy &>/dev/null
    exit_code=$?
    if test "$exit_code" != 0; then
        echo "Web interface is unreachable" >&2
        exit 1
    fi
fi
