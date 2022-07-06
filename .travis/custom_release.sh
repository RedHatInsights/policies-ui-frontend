#!/bin/bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
    done

    for env in ci qa
    do
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done
fi

if [ "${TRAVIS_BRANCH}" = "prod" ]
then
    echo "PUSHING prod-beta"
    rm -rf ./dist/.git
    .travis/release.sh "prod-beta"

    echo "PUSHING prod-stable"
    rm -rf ./dist/.git
    .travis/release.sh "prod-stable"
fi

# Pushing to a release branch ({ci|qa|prod}-{beta|stable} if we want to override a specific environment
if [[ "${TRAVIS_BRANCH}" =~ ^(ci|qa|prod)-(stable|beta)$  ]]
then
  echo "PUSHING ${TRAVIS_BRANCH}"
  rm -rf ./dist/.git
  .travis/release.sh "${TRAVIS_BRANCH}"
fi
