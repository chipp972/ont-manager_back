#!/bin/sh

node_modules/.bin/typings install
node_modules/.bin/tsc
node dist/scripts/app_config.js
