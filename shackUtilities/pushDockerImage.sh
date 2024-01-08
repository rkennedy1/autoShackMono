#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# Import echo_*() and validate_suv_host() functions
source "$SCRIPT_DIR/bash-utils.sh"

function pushDockerImage() {
    echo_info "Tagging Shack $1 Image to registry.digitalocean.com/autoshack/shack:$1"
    docker tag shack_$1 registry.digitalocean.com/autoshack/shack:$1 
    echo_info "Pushing Shack $1 Image to registry.digitalocean.com"
    docker push registry.digitalocean.com/autoshack/shack:$1
}

echo_header "Push Shack Server Image"
pushDockerImage server

echo_header "Push Shack Web Image"
pushDockerImage web