# AutoShack Build Utilities

Essential build and deployment scripts for the AutoShack project.

## Scripts

### `build.sh` - Main Build Script
Builds Docker images with configurable options.

**Usage:**
```bash
# Basic build
./build.sh

# Parallel build with logs
./build.sh --parallel --follow-logs

# Native platform build (faster)
./build.sh --native

# Clean build (no cache)
./build.sh --no-cache
```

**Options:**
- `--parallel` - Build both services simultaneously
- `--follow-logs` - Show real-time build output
- `--native` - Build for current platform (faster but less compatible)
- `--no-cache` - Force clean build
- `--platform <platform>` - Specify target platform (default: linux/amd64)

### `fastBuild.sh` - Quick Development Build
Optimized build for development with interactive options.

**Usage:**
```bash
./fastBuild.sh
```

Features:
- Interactive platform selection
- Parallel builds with real-time logs
- Optimized for development speed

### `push.sh` - Deploy to Registry
Pushes built images to the container registry.

**Usage:**
```bash
./push.sh
```

### `build.config.sh` - Build Configuration
Shared configuration settings for all build scripts.

### `bash-utils.sh` - Utility Functions
Colored terminal output functions used by all scripts.

## Quick Start

**Development Build:**
```bash
./fastBuild.sh
```

**Production Build & Deploy:**
```bash
./build.sh --parallel
./push.sh
```

## Images Built

- `shack_server` - Node.js backend service
- `shack_web` - React frontend application

## Requirements

- Docker with BuildKit support
- Container registry access (for push operations)