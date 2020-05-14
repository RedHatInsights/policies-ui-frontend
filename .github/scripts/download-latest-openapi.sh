#!/bin/env bash

TARGET_BRANCH="${TARGET_BRANCH:-master}"
TARGET_PATH="${TARGET_PATH:-openapi.json}"
TOKEN="${TOKEN:-$ACTIONS_RUNTIME_TOKEN}"

CURL="${CURL_COMMAND:-curl --silent}"

function definedOrExit {
  if [[ -z "$1" ]]; then
    echo "$2"
    cat "$3"
    exit 1
  fi
}

echo "Using curl as \"${CURL}\""

function call_curl {
  ${CURL} -H "Authorization: Bearer ${TOKEN}" "$@"
}

JOBS_URL="https://api.github.com/repos/RedHatInsights/policies-ui-backend/actions/workflows/main.yml/runs?status=success&branch=${TARGET_BRANCH}&event=push"

echo "Getting artifacts_url from ${JOBS_URL}"
call_curl "${JOBS_URL}" > .returned
ARTIFACTS_URL=$(jq --raw-output '.workflow_runs[0].artifacts_url | if . == null then "" else . end' < .returned)
definedOrExit "${ARTIFACTS_URL}" "Unable to get artifacts_url" .returned

echo "Getting archive download url from ${ARTIFACTS_URL}"
call_curl "${ARTIFACTS_URL}" > .returned
ARCHIVE_DOWNLOAD_URL=$(jq --raw-output '.artifacts[0].archive_download_url | if . == null then "" else . end' < .returned)
definedOrExit "${ARCHIVE_DOWNLOAD_URL}" "Unable to get archive_download_url" .returned

call_curl -i "${ARCHIVE_DOWNLOAD_URL}" > .returned
echo "Getting download url from ${ARCHIVE_DOWNLOAD_URL}"
DOWNLOAD_URL=$(grep -oP 'Location: \K.+' < .returned)
definedOrExit "${DOWNLOAD_URL}" "Unable to get Location header with download url" .returned
DOWNLOAD_URL=${DOWNLOAD_URL%$'\r'}
rm -f .returned

echo "Downloading artifact package from ${DOWNLOAD_URL}"
call_curl "${DOWNLOAD_URL}" > openapi.json.zip
mkdir -p .tmp
unzip openapi.json.zip openapi.json -d .tmp
mv .tmp/openapi.json "${TARGET_PATH}"
rm -rf .tmp
rm openapi.json.zip
