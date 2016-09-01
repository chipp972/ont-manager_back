#!/bin/bash

cd "$(dirname $(readlink -f $0))/.."

if [ ! -e node_modules/.bin/mocha ]
then
  echo "no mocha detected !"
  echo "run npm install before starting the tests"
  exit 1
fi

FILES=$(find ./dist -name 'index.js' | grep -v node_modules | grep __tests__)

for file in $FILES
do
  node_modules/.bin/mocha --reporter spec $file
done

exit 0
