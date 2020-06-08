#!/bin/env bash

if [ "${TRAVIS_BRANCH}" = "prod" ]
then
    curl https://cloud.redhat.com/api/policies/v1.0/openapi.json -o ./utils/openapi-generator/openapi.json
    yarn schema:generate && yarn schema:clean
    [[ -z $(git status --porcelain) ]] ||
    (
      git status &&
      git diff &&
      echo "----------------------------------------------------------------" &&
      echo "  openapi.json types or actions are out of sync aborting build. " &&
      echo "----------------------------------------------------------------" &&
      false
    )
fi
