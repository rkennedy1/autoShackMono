#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# Import echo_*() and validate_suv_host() functions
source "$SCRIPT_DIR/bash-utils.sh"

# Default values
USE_CACHE=true
PARALLEL_BUILD=false
FOLLOW_LOGS=false
PLATFORM="linux/amd64"
NATIVE_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-cache)
      USE_CACHE=false
      shift
      ;;
    --parallel)
      PARALLEL_BUILD=true
      shift
      ;;
    --follow-logs)
      FOLLOW_LOGS=true
      shift
      ;;
    --native)
      NATIVE_BUILD=true
      PLATFORM="linux/$(uname -m)"
      shift
      ;;
    --platform)
      PLATFORM="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  --no-cache      Build without using Docker cache"
      echo "  --parallel      Build images in parallel"
      echo "  --follow-logs   Follow build logs in real-time"
      echo "  --native        Build for native platform (faster but platform-specific)"
      echo "  --platform      Target platform (default: linux/amd64)"
      echo "  --help, -h      Show this help message"
      exit 0
      ;;
    *)
      echo_error "Unknown option: $1"
      exit 1
      ;;
  esac
done

function buildDockerImage() {
  local image_name=$1
  local build_context=$2
  local log_file=$3
  
  echo_info "Building docker image: $image_name"
  
  # Build cache options
  local cache_opts=""
  if [ "$USE_CACHE" = "false" ]; then
    cache_opts="--no-cache"
  fi
  
  
  # Use BuildKit for better performance and caching
  export DOCKER_BUILDKIT=1
  
  # Performance optimizations for M1 Mac
  export BUILDKIT_PROGRESS=plain
  
  # Build with optimized settings and capture output
  if [ -n "$log_file" ]; then
    {
      echo "=== Building $image_name at $(date) ==="
      echo "Platform: $PLATFORM"
      echo "Native build: $NATIVE_BUILD"
      
      docker buildx build \
        --platform "$PLATFORM" \
        -t "$image_name" \
        $cache_opts \
        --load \
        "$build_context" 2>&1
      echo "=== Completed $image_name at $(date) ==="
    } | tee "$log_file"
  else
    docker buildx build \
      --platform "$PLATFORM" \
      -t "$image_name" \
      $cache_opts \
      --load \
      "$build_context"
  fi
}

function buildServerImage() {
  local log_file=$1
  echo_header "Building Shack Server Image"
  local server_dir="$SCRIPT_DIR/../shackServer/"
  
  if [ ! -d "$server_dir" ]; then
    echo_error "Server directory not found: $server_dir"
    return 1
  fi
  
  buildDockerImage "shack_server" "$server_dir" "$log_file"
}

function buildWebImage() {
  local log_file=$1
  echo_header "Building Shack Web Image"
  local web_dir="$SCRIPT_DIR/../shackWeb/"
  
  if [ ! -d "$web_dir" ]; then
    echo_error "Web directory not found: $web_dir"
    return 1
  fi
  
  buildDockerImage "shack_web" "$web_dir" "$log_file"
}

function cleanup_old_images() {
  echo_info "Cleaning up old unused images..."
  docker image prune -f --filter "dangling=true" || true
}

function follow_logs_realtime() {
  local server_log=$1
  local web_log=$2
  local server_pid=$3
  local web_pid=$4
  
  echo_info "Following build logs in real-time..."
  echo_info "Press Ctrl+C to stop following logs (builds will continue)"
  echo_info ""
  
  # Use multitail if available, otherwise fall back to tail
  if command -v multitail >/dev/null 2>&1; then
    multitail -l "tail -f $server_log" -l "tail -f $web_log" &
    tail_pid=$!
  else
    # Split screen with tail
    {
      echo "=== SERVER BUILD LOG ==="
      tail -f "$server_log" 2>/dev/null | sed 's/^/[SERVER] /' &
      server_tail_pid=$!
      
      echo "=== WEB BUILD LOG ==="
      tail -f "$web_log" 2>/dev/null | sed 's/^/[WEB] /' &
      web_tail_pid=$!
      
      wait
    } &
    tail_pid=$!
  fi
  
  # Wait for builds to complete
  while kill -0 $server_pid 2>/dev/null || kill -0 $web_pid 2>/dev/null; do
    sleep 1
  done
  
  # Kill tail processes
  kill $tail_pid 2>/dev/null || true
  if [ -n "${server_tail_pid:-}" ]; then
    kill $server_tail_pid 2>/dev/null || true
  fi
  if [ -n "${web_tail_pid:-}" ]; then
    kill $web_tail_pid 2>/dev/null || true
  fi
}

function show_parallel_progress() {
  local server_log=$1
  local web_log=$2
  local server_pid=$3
  local web_pid=$4
  
  if [ "$FOLLOW_LOGS" = "true" ]; then
    follow_logs_realtime "$server_log" "$web_log" $server_pid $web_pid
  else
    echo_info "Monitoring parallel builds..."
    echo_info "Server log: $server_log"
    echo_info "Web log: $web_log"
    echo_info ""
    echo_info "Use 'tail -f $server_log' in another terminal to follow server build"
    echo_info "Use 'tail -f $web_log' in another terminal to follow web build"
    echo_info "Or run with --follow-logs to see real-time output"
    echo_info ""
    
    # Show progress every 10 seconds
    while kill -0 $server_pid 2>/dev/null || kill -0 $web_pid 2>/dev/null; do
      local server_status="RUNNING"
      local web_status="RUNNING"
      
      if ! kill -0 $server_pid 2>/dev/null; then
        server_status="COMPLETED"
      fi
      
      if ! kill -0 $web_pid 2>/dev/null; then
        web_status="COMPLETED"
      fi
      
      echo_info "$(date '+%H:%M:%S') - Server: $server_status | Web: $web_status"
      sleep 10
    done
  fi
}

main() {
  local start_time=$(date +%s)
  local timestamp=$(date '+%Y%m%d_%H%M%S')
  
  echo_header "Docker Image Build Script"
  echo_info "Platform: $PLATFORM"
  echo_info "Use cache: $USE_CACHE"
  echo_info "Parallel build: $PARALLEL_BUILD"
  echo_info "Follow logs: $FOLLOW_LOGS"
  
  if [ "$PARALLEL_BUILD" = "true" ]; then
    # Create log files for parallel builds
    local server_log="/tmp/shack_server_build_${timestamp}.log"
    local web_log="/tmp/shack_web_build_${timestamp}.log"
    
    echo_info "Building images in parallel..."
    echo_info "Build logs will be saved to:"
    echo_info "  Server: $server_log"
    echo_info "  Web: $web_log"
    echo_info ""
    
    # Start builds in background with logging
    buildServerImage "$server_log" &
    server_pid=$!
    
    buildWebImage "$web_log" &
    web_pid=$!
    
    # Show progress while builds are running
    show_parallel_progress "$server_log" "$web_log" $server_pid $web_pid
    
    # Wait for both builds to complete
    wait $server_pid
    server_exit_code=$?
    
    wait $web_pid
    web_exit_code=$?
    
    echo_info ""
    if [ $server_exit_code -eq 0 ]; then
      echo_info "✅ Server build completed successfully"
    else
      echo_error "❌ Server build failed (exit code: $server_exit_code)"
      echo_error "Check log: $server_log"
    fi
    
    if [ $web_exit_code -eq 0 ]; then
      echo_info "✅ Web build completed successfully"
    else
      echo_error "❌ Web build failed (exit code: $web_exit_code)"
      echo_error "Check log: $web_log"
    fi
    
    if [ $server_exit_code -ne 0 ] || [ $web_exit_code -ne 0 ]; then
      echo_error "One or more builds failed"
      echo_info "Logs available at:"
      echo_info "  Server: $server_log"
      echo_info "  Web: $web_log"
      exit 1
    fi
    
    echo_info ""
    echo_info "Build logs saved to:"
    echo_info "  Server: $server_log"
    echo_info "  Web: $web_log"
    
  else
    echo_info "Building images sequentially..."
    buildServerImage ""
    buildWebImage ""
  fi
  
  cleanup_old_images
  
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  echo_info "Build completed in ${duration} seconds"
  
  # Show image sizes
  echo_header "Built Images"
  docker images | grep -E "(shack_server|shack_web)" || true
}

main "$@"
