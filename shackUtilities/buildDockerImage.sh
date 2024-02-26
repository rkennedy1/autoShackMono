#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$SCRIPT_DIR/bash-utils.sh"

function buildDockerImage() {
  local image_name=$1
  echo_info "Removing any existing local docker image: $image_name"
  docker image rm "$image_name" &>/dev/null || true

  echo_info "Building new docker image: $image_name"
  docker buildx build --platform linux/amd64 -t "$image_name" . --no-cache --load
}

main() {
  echo_header "Building Shack Server Image"
  cd "$SCRIPT_DIR/../shackServer/" || { echo_error "Failed to change directory"; exit 1; }
  buildDockerImage "shack_server"

  echo_header "Building Shack Web Image"
  cd "$SCRIPT_DIR/../shackweb2/" || { echo_error "Failed to change directory"; exit 1; }
  buildDockerImage "shack_web"
}

main "$@"
