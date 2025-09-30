# Shack Utilities

This directory contains utility scripts for building, deploying, and managing the AutoShack project infrastructure.

## Scripts Overview

### `bash-utils.sh`
A utility library providing colored output functions for better terminal experience.

**Functions:**
- `echo_header()` - Displays cyan-colored headers with asterisk borders
- `echo_subheader()` - Displays cyan-colored subheaders
- `echo_bright()` - Displays bright white text
- `echo_dim()` - Displays gray dimmed text
- `echo_warning()` - Displays yellow warning text
- `echo_error()` - Displays red error text
- `echo_info()` - Displays green informational text

**Usage:**
```bash
source ./bash-utils.sh
echo_header "Starting deployment"
echo_info "Process completed successfully"
echo_error "Something went wrong"
```

### `buildDockerImage.sh`
Builds Docker images for the AutoShack services with consistent configuration.

**Features:**
- Removes existing local images before building
- Uses buildx for cross-platform builds (linux/amd64)
- Builds with `--no-cache` for fresh builds
- Builds both `shack_server` and `shack_web` images

**Usage:**
```bash
./buildDockerImage.sh
```

**Images Built:**
- `shack_server` - Built from `../shackServer/` directory
- `shack_web` - Built from `../shackweb2/` directory

### `pushDockerImages.sh`
Pushes built Docker images to DigitalOcean Container Registry.

**Registry:** `registry.digitalocean.com/autoshack/`

**Images Pushed:**
- `shack_server` → `registry.digitalocean.com/autoshack/shack_server`
- `shack_web` → `registry.digitalocean.com/autoshack/shack_web`

**Usage:**
```bash
./pushDockerImages.sh
```

## Deployment Workflow

1. **Build Images:**
   ```bash
   ./buildDockerImage.sh
   ```

2. **Push to Registry:**
   ```bash
   ./pushDockerImages.sh
   ```

## Prerequisites

- Docker with buildx support
- Access to DigitalOcean Container Registry
- Proper authentication for the registry

## Directory Structure

```
shackUtilities/
├── README.md              # This file
├── bash-utils.sh          # Terminal output utilities
├── buildDockerImage.sh    # Docker image builder
└── pushDockerImages.sh    # Registry push script
```

## Notes

- All scripts use `bash-utils.sh` for consistent terminal output styling
- Images are built for `linux/amd64` platform for deployment compatibility
- The build script includes error handling and directory validation
- Fresh builds are ensured by removing existing images and using `--no-cache`
