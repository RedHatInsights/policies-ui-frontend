#!/bin/bash

TARGET="${TARGET:-dist/index.html}"

function ensure_beta {
  sed -i 's/src=\"\/apps/src=\"\/beta\/apps/g' "${TARGET}"
}

function ensure_stable {
  sed -i 's/src=\"\/beta\/apps/src=\"\/apps/g' "${TARGET}"
}
