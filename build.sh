#!/bin/bash

mkdir -p tmp

cp -rf node_modules workflow icon.png info.plist tmp

ditto -ck tmp clipboard-to-qiniu.alfredworkflow

rm -rf tmp