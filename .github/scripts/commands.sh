#!/bin/bash

TARGET="${TARGET:-dist/index.html}"

function ensure_beta {
  sed -i 's/include src=\"\/apps/include src=\"\/beta\/apps/g' "${TARGET}"
}

function ensure_stable {
  sed -i 's/include src=\"\/beta\/apps/include src=\"\/apps/g' "${TARGET}"
}
