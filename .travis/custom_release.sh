#!/bin/bash
set -e
set -x

source ./.github/scripts/commands.sh

# Commenting them out to avoid any push to {ci|qa}-{stable|beta} when merging to master
#if [ "${TRAVIS_BRANCH}" = "master" ]
#then
#    ensure_beta
#    for env in ci qa
#    do
#        echo "PUSHING ${env}-beta"
#        rm -rf ./dist/.git
#        .travis/release.sh "${env}-beta"
#    done
#
#    ensure_stable
#    for env in ci qa
#    do
#        echo "PUSHING ${env}-stable"
#        rm -rf ./dist/.git
#        .travis/release.sh "${env}-stable"
#    done
#fi

if [ "${TRAVIS_BRANCH}" = "prod" ]
then
    ensure_beta
    echo "PUSHING prod-beta"
    rm -rf ./dist/.git
    .travis/release.sh "prod-beta"

    ensure_stable
    echo "PUSHING prod-stable"
    rm -rf ./dist/.git
    .travis/release.sh "prod-stable"
fi

# Pushing to a release branch ({ci|qa|prod}-{beta|stable}
if [[ "${TRAVIS_BRANCH}" =~ ^(ci|qa|prod)-(stable|beta)$  ]]
then
  # No need to call ensure_beta/stable, insights libs will take care from that if this is a release branch
  echo "PUSHING ${TRAVIS_BRANCH}"
  rm -rf ./dist/.git
  .travis/release.sh "${TRAVIS_BRANCH}"
fi
