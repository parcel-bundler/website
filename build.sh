#!/bin/bash

rm -rf dist
mkdir dist

for lang in src/i18n/*; do
  rm -rf tmp;
  cp -R "$lang" tmp;
  cp -R src/assets tmp/layout/assets;
  ./node_modules/.bin/generate-md --layout tmp/layout --input tmp/docs --output "dist/$(basename "$lang")";
  cp "$lang/index.html" "dist/$(basename "$lang")/index.html";
done

rm -rf tmp
