#!/bin/bash

rm -rf dist
mkdir -p dist/js
mkdir -p dist/img
mkdir -p dist/styles

settings=dist/js/settings.js
popup=dist/js/popup.js

rollup chrome/js/settings --file $settings
rollup chrome/js/popup.js --file $popup

\cp ./chrome/*.html dist/
\cp ./chrome/*.json dist/
\cp ./chrome/img/* dist/img/
\cp ./chrome/styles/* dist/styles/

echo "build done"
