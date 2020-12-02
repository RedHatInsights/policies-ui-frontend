#!/bin/bash

yarn lock-dependencies -u lock -i
[[ -z $(git status --porcelain) ]] ||
(
  git status &&
  git diff &&
  echo "----------------------------------------------------------------" &&
  echo "  Not every dependency in package.json is pinned. " &&
  echo "----------------------------------------------------------------" &&
  false
)
