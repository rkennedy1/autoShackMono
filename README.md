# AutoShackMono

[![Run Cypress Tests](https://github.com/rkennedy1/autoShackMono/actions/workflows/cypress-tests.yml/badge.svg)](https://github.com/rkennedy1/autoShackMono/actions/workflows/cypress-tests.yml)

An intelligent IoT plant watering and monitoring system built with Raspberry Pi, featuring automated scheduling, environmental monitoring, camera surveillance, and a modern web dashboard.

## 🌱 Overview

AutoShackMono is a comprehensive automated plant care system that combines hardware sensors, intelligent watering controls, real-time monitoring, and web-based management. The system provides 24/7 environmental monitoring with automated watering based on configurable schedules, complete with camera surveillance and alert notifications.

### Key Features

- **🌡️ Environmental Monitoring**: Real-time temperature, humidity, and water flow tracking
- **💧 Automated Watering**: Schedule-based pump control with database and file fallback
- **📸 Visual Monitoring**: Automated camera capture with timestamped photos
- **📊 Web Dashboard**: Real-time data visualization and schedule management
- **🔔 Alert System**: Email notifications for missed watering and system issues
- **🐳 Docker Deployment**: Containerized services for easy deployment
- **📱 Cross-Platform**: Web interface accessible from any device

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Raspberry Pi  │    │   Web Dashboard │    │  Notifications  │
│  (Controller)   │◄──►│   (Frontend)    │◄──►│   (Alerts)     │
│                 │    │                 │    │                 │
│ • Sensors       │    │ • React UI      │    │ • Email Alerts │
│ • Pump Control  │    │ • Data Charts   │    │ • Uptime Mon.   │
│ • Data Logging  │    │ • Schedule Mgmt │    │ • Flow Monitor  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Central Server (API)                        │
│  • RESTful API      • MySQL Database     • Rate Limiting       │
│  • Schedule Mgmt    • Sensor Data        • CORS Support        │
│  • Camera Integration • Docker Ready     • Swagger Docs        │
└─────────────────────────────────────────────────────────────────┘
         ▲                                                 ▲
         │                                                 │
┌─────────────────┐                               ┌─────────────────┐
│   Camera Module │                               │    Utilities    │
│                 │                               │                 │
│ • Photo Capture │                               │ • Docker Build  │
│ • Auto Upload   │                               │ • Deploy Tools  │
│ • Web API       │                               │ • Bash Utils    │
└─────────────────┘                               └─────────────────┘
```

## 📦 Project Components

### 🎮 [shackController](./shackController/README.md)
Raspberry Pi-based hardware controller that interfaces with sensors and pumps.
- **Hardware**: DHT22 sensor, flow sensor, water pump relay
- **Features**: Real-time monitoring, automated watering, database logging
- **Technology**: Python, GPIO control, MySQL integration

### 🌐 [shackServer](./shackServer/README.md) 
Node.js/TypeScript Express API server providing backend services.
- **API**: RESTful endpoints for data and schedule management
- **Database**: MySQL with connection pooling
- **Technology**: Node.js, Express, TypeScript, Swagger documentation

### 💻 [shackWeb](./shackWeb/README.md)
React-based web dashboard for monitoring and control.
- **Features**: Real-time charts, schedule management, responsive design
- **Technology**: React 18, TypeScript, Material-UI, Cypress testing

### 📸 [shackCamera](./shackCamera/README.md)
Camera module for visual monitoring with automated photo capture.
- **Features**: Scheduled photos, automatic upload, web API integration
- **Technology**: Python, Flask, fswebcam/libcamera support

### 🔔 [shackNotifications](./shackNotifications/README.md)
Alert system for monitoring critical events and system health.
- **Features**: Missed watering alerts, uptime monitoring, email notifications
- **Technology**: Python, Gmail SMTP, MySQL monitoring

### 🛠️ [shackUtilities](./shackUtilities/README.md)
Build and deployment utilities for managing the entire stack.
- **Features**: Docker image building, registry deployment, colored output
- **Technology**: Bash scripts, Docker, DigitalOcean registry

## 🚀 Quick Start

### Prerequisites

- **Hardware**: Raspberry Pi 4+ with GPIO access
- **Software**: Docker, Docker Compose, MySQL database
- **Network**: Local network access between components

### 1. Hardware Setup

```bash
# Connect sensors to Raspberry Pi GPIO
DHT22 Sensor    → GPIO Pin 27
Flow Sensor     → GPIO Pin 23  
Water Pump Relay → GPIO Pin 18

# Install pigpio daemon (required for sensors)
sudo apt install pigpio python3-pigpio
sudo systemctl enable pigpiod
sudo systemctl start pigpiod
```

### 2. Environment Configuration

Create environment files:

```bash
# shackServer/.env
PORT=1783
MYSQL_HOST=your_database_host
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=autoshack

# shackController/scripts/.env
MYSQL_HOST=your_database_host
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=autoshack
```

### 3. Database Setup

```sql
-- Create database tables
CREATE TABLE shacklog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  datetime DATETIME,
  humdity DECIMAL(5,2),
  temperature DECIMAL(5,2),
  flow_rate DECIMAL(5,2),
  pump_status VARCHAR(50),
  execution_time INT
);

CREATE TABLE shackSchedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_hour VARCHAR(5),
  duration VARCHAR(10)
);
```

### 4. Docker Deployment

```bash
# Build Docker images
cd shackUtilities
./buildDockerImage.sh

# Start services
cd ..
docker-compose up -d

# Verify services
docker-compose ps
```

### 5. Start Hardware Controller

```bash
# Start controller in screen session
screen -S ShackController
cd shackController/scripts/
python3 autoShack.py

# Detach from screen: Ctrl-A, then d
```

## 📊 Usage

### Web Dashboard
Access the web interface at `http://your-server:80`:
- **Dashboard**: Real-time sensor data and system status
- **Schedule Management**: Add/edit/delete watering schedules
- **Historical Data**: Interactive charts showing last 3 days of data

### API Access
The server provides RESTful APIs at `http://your-server:1783`:
- **Documentation**: `/api-docs` (Swagger UI)
- **Data**: `/data/lastDay`, `/data/lastThreeDays`
- **Schedules**: `/schedule` (GET/POST/PUT/DELETE)

### Camera Integration
Camera captures photos automatically and provides web API:
```bash
# Manual photo capture
curl http://camera-host:5000/takePicture

# Photos uploaded to server automatically
```

## 🔧 Development

### Local Development Setup

1. **Install dependencies** for each component:
   ```bash
   # Server
   cd shackServer && yarn install
   
   # Web
   cd shackWeb && yarn install
   
   # Controller
   cd shackController/scripts && pip install -r requirements.txt
   ```

2. **Start development servers**:
   ```bash
   # Server (Terminal 1)
   cd shackServer && yarn dev
   
   # Web (Terminal 2) 
   cd shackWeb && yarn start
   
   # Controller (Terminal 3)
   cd shackController/scripts && python autoShack.py
   ```

### Testing

```bash
# Web frontend tests
cd shackWeb
yarn test
npx cypress run

# API testing via Swagger
open http://localhost:1783/api-docs
```

## 📋 Monitoring & Logs

### System Logs
```bash
# Controller logs
tail -f shackController/logs/shack.log

# Service status
sudo systemctl status autoshack.service

# Docker logs
docker-compose logs -f server
docker-compose logs -f web
```

### Database Monitoring
```sql
-- Recent sensor readings
SELECT * FROM shacklog ORDER BY datetime DESC LIMIT 10;

-- Active schedules
SELECT * FROM shackSchedule;

-- Flow events (watering)
SELECT * FROM shacklog WHERE flow_rate > 0 ORDER BY datetime DESC LIMIT 10;
```

## 🚨 Troubleshooting

### Common Issues

**Sensor Reading Errors**
```bash
# Check pigpio daemon
sudo systemctl status pigpiod

# Verify GPIO permissions
sudo usermod -a -G gpio $USER
```

**Database Connection Issues**
- Verify MySQL service is running
- Check network connectivity and credentials
- System automatically falls back to file-based configuration

**Docker Deployment Issues**
```bash
# Rebuild images
cd shackUtilities && ./buildDockerImage.sh

# Check service health
docker-compose ps
docker-compose logs service_name
```

## 🤝 Contributing

1. **Code Style**: Follow existing TypeScript/Python conventions
2. **Testing**: Add tests for new features
3. **Documentation**: Update README files for component changes
4. **API Changes**: Update Swagger documentation

## 📄 License

MIT License - This project is open source and available under the MIT License.

## 🎯 Roadmap

- [ ] Mobile app for iOS/Android
- [ ] Advanced analytics and ML predictions
- [ ] Multi-zone watering support
- [ ] Integration with weather APIs
- [ ] Voice control via smart assistants

---

**Quick Commands Reference:**

```bash
# Start system
screen -S ShackController
cd shackController/scripts/ && python3 autoShack.py
# Ctrl-A, d to detach

# View logs
cd shackController/logs/ && tail -f shack.log

# Docker services
docker-compose up -d
docker-compose logs -f

# Web access
open http://localhost:80        # Dashboard
open http://localhost:1783/api-docs  # API docs
```
    