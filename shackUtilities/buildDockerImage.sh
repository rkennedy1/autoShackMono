SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# Import echo_*() and validate_suv_host() functions
source "$SCRIPT_DIR/bash-utils.sh"

function buildDockerImage() {
  echo_info "Removing any existing local docker image"
  docker image rm "$1" &>/dev/null || true

  echo_info "Building new docker image"
  docker build -t "$1" . --no-cache
}

echo_header "Building Shack Server Image"
cd ../shackServer/
buildDockerImage shack_server

echo_header "Building Shack Web Image"
cd ../shackWeb/
buildDockerImage shack_web