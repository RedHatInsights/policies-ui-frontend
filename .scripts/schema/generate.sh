#!/usr/bin/env bash

OPENAPI_JSON_PATH=${OPENAPI_JSON_PATH:-./utils/openapi-generator/openapi.json}

OUTPUT_PATH="./src/generated"
OPENAPI_NORMALIZED_PATH="${OUTPUT_PATH}/openapi.json"
SCHEMAS="./utils/openapi-generator/schemas/"

jq -S -c '.' "${OPENAPI_JSON_PATH}"  > "${OPENAPI_NORMALIZED_PATH}"
op3-codegen "${OPENAPI_NORMALIZED_PATH}" -o "${OUTPUT_PATH}" -t "${SCHEMAS}" --generateEnums
rm "${OPENAPI_NORMALIZED_PATH}"
eslint --fix "${OUTPUT_PATH}/**/*.ts"
