#!/bin/sh

node_modules/.bin/typings install
node dist/scripts/app_config.js
node_modules/.bin/tsc
