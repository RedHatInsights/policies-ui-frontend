#!/bin/bash
set -e
set -x

source ./.github/scripts/commands.sh

if [ "${TRAVIS_BRANCH}" = "master" ]
then
    ensure_beta
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
    done
fi


if [ "${TRAVIS_BRANCH}" = "master" ]
then
    ensure_stable
    for env in ci qa
    do
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done
fi

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
