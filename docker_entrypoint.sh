#!/bin/sh

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

configurator
exec tini -g -- node rtl
