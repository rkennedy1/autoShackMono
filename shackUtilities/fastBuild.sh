#!/usr/bin/env bash

# Fast build script - optimized for development speed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
source "$SCRIPT_DIR/bash-utils.sh"

echo_header "🚀 Fast Build"
echo_info "Optimized for development speed:"
echo_info "✅ Parallel builds"
echo_info "✅ Real-time log following"
echo_info "✅ Docker layer caching"
echo_info ""

# Check if user wants native build (faster but platform-specific)
read -p "Build for native platform (faster) or AMD64 (compatible)? [native/amd64] (default: amd64): " build_type
build_type=${build_type:-amd64}

if [ "$build_type" = "native" ] || [ "$build_type" = "n" ]; then
    echo_warning "Building for native platform - may not run on different architectures!"
    platform_arg="--native"
else
    echo_info "Building for AMD64 - compatible with most servers"
    platform_arg=""
fi

echo_info "Starting fast build..."

# Run optimized build
exec "$SCRIPT_DIR/build.sh" --parallel --follow-logs $platform_arg
