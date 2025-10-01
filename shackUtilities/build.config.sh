#!/usr/bin/env bash

# Build configuration for AutoShack services

# Docker settings
export DOCKER_BUILDKIT=1
export BUILDKIT_PROGRESS=plain

# Default platform
DEFAULT_PLATFORM="linux/amd64"

# Service configurations
declare -A SERVICES=(
  ["server"]="shackServer"
  ["web"]="shackWeb"
)

declare -A IMAGE_NAMES=(
  ["server"]="shack_server"
  ["web"]="shack_web"
)

# Build optimization settings
ENABLE_PARALLEL_BUILD=true
DEFAULT_USE_CACHE=true
CLEANUP_AFTER_BUILD=true

# Performance settings
MAX_PARALLEL_BUILDS=2
BUILD_TIMEOUT=1800  # 30 minutes

# Registry settings (if needed for pushing)
REGISTRY_URL=""
REGISTRY_NAMESPACE="autoshack"

# Build environment
BUILD_ENV="production"

# Logging
LOG_LEVEL="info"
LOG_FILE="/tmp/autoshack-build.log"

# Health check settings
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_INTERVAL="30s"
HEALTH_CHECK_TIMEOUT="3s"
HEALTH_CHECK_RETRIES=3

# Security settings
RUN_AS_NON_ROOT=true
USER_ID=1001
GROUP_ID=1001
