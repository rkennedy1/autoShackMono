# ShackCamera

The camera module for the AutoShack monitoring system. This component handles taking pictures of the greenhouse/shack environment and uploading them to the central server for monitoring and analysis.

## Overview

ShackCamera provides both programmatic and web-based interfaces for capturing images using connected cameras (webcam or libcamera-compatible devices). Images are automatically timestamped, stored locally, and then transferred to the central AutoShack server.

## Components

### `cam.py`
The main camera class that handles:
- **Image Capture**: Takes pictures using `fswebcam` (with fallback libcamera support)
- **File Naming**: Generates ISO timestamp-based filenames 
- **Image Transfer**: Uploads images to the central server via SCP
- **Server Notification**: Notifies the AutoShack server of new images via HTTP API

### `webserver.py`
A Flask web server that provides:
- **HTTP API**: `/takePicture` endpoint for remote camera triggering
- **CORS Support**: Configured for local network access from various devices
- **Remote Control**: Allows other AutoShack components to trigger photo capture

### `cam.py.save`
Legacy/backup version of the camera implementation with different configuration settings.

## Features

- **Multiple Camera Support**: Works with both fswebcam and libcamera systems
- **Automatic Timestamping**: Uses configurable timezone (default: America/Los_Angeles)
- **High Resolution**: Captures images at 3264x2448 resolution
- **Remote Upload**: Transfers images to central server automatically
- **Web API**: RESTful interface for integration with other system components
- **Cross-Origin Support**: CORS configured for local network devices

## Dependencies

```bash
pip install flask flask-cors requests python-dotenv
```

### System Dependencies
- `fswebcam` (primary camera interface)
- `libcamera-still` (alternative camera interface)
- `scp` (for file transfer)

## Configuration

### Environment Variables
Create a `.env` file in the shackCamera directory:

```env
FLASK_DEBUG=True
FLASK_ENV=development
```

### Network Configuration
The system is configured to work with these local network hosts:
- `guestserver.local` (primary server)
- `shackpi.local` (camera device)
- `Ryans-MacBook-Pro.local` (development machine)

## Usage

### Direct Camera Operation
```bash
python cam.py
```

### Web Server Mode
```bash
python webserver.py
```

Then trigger photos via HTTP:
```bash
curl http://localhost:5000/takePicture
```

### Programmatic Usage
```python
from cam import Cam

camera = Cam(timezone='America/Los_Angeles')
filename = camera.main()  # Takes photo and uploads
print(f"Photo saved as: {filename}")
```

## File Structure

```
shackCamera/
├── cam.py           # Main camera class
├── webserver.py     # Flask web server
├── cam.py.save      # Legacy backup
├── pics/            # Local image storage (created automatically)
└── README.md        # This file
```

## Integration

This module integrates with:
- **shackServer**: Receives uploaded images and filename notifications
- **shackController**: Can trigger photo capture via web API
- **shackWeb**: Displays captured images in the dashboard

## Image Workflow

1. **Capture**: Camera takes high-resolution photo with timestamp filename
2. **Store**: Image saved locally in `pics/` directory
3. **Upload**: Image transferred to central server via SCP
4. **Notify**: Server notified of new image via HTTP POST to `/lastPicture`
5. **Display**: Image becomes available in web dashboard

## Troubleshooting

### Camera Not Found
- Ensure webcam is connected and accessible
- Check if `fswebcam` is installed: `which fswebcam`
- Try alternative with libcamera: uncomment line 21 in `cam.py`

### Upload Failures
- Verify network connectivity to `guestserver.local`
- Check SSH key authentication is configured
- Ensure target directory exists on server

### Permission Issues
- Ensure camera device permissions: `ls -l /dev/video*`
- Add user to video group: `sudo usermod -a -G video $USER`

## Development

To modify camera settings:
- **Resolution**: Change `-r 3264x2448` in `takePicture()` method
- **Timezone**: Modify default in `Cam.__init__()`
- **Target Server**: Update hostname in `pushPicture()` method
- **API Endpoints**: Add new routes in `webserver.py`
