# Auto Shack Controller

The Raspberry Pi-based controller component of the AutoShack automated watering system. This module interfaces with hardware sensors and pumps to monitor environmental conditions and control watering based on configurable schedules.

## Overview

The shackController is the core hardware interface that runs on a Raspberry Pi and manages:
- **Environmental Monitoring**: Temperature, humidity, and water flow sensing
- **Pump Control**: Automated water pump operation based on schedules
- **Data Logging**: Continuous collection and storage of sensor data
- **Schedule Management**: Time-based watering schedules with database/file fallback

## Hardware Components

- **Raspberry Pi**: Main controller board
- **DHT22 Sensor** (Pin 27): Temperature and humidity monitoring
- **Flow Sensor** (Pin 23): Water flow rate measurement
- **Water Pump** (Pin 18): Automated watering system
- **MySQL Database**: Primary data storage
- **MongoDB**: Alternative data storage option

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   autoShack.py  │    │   configData.py  │    │  sqlDatabase.py │
│  (Main Loop)    │◄──►│   (Scheduling)   │◄──►│  (Data Store)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│ Sensor Classes  │    │ shack.config.json│
│ • HumidityTemp  │    │   (Fallback)     │
│ • FlowSensor    │    └──────────────────┘
│ • Pump          │
└─────────────────┘
```

## Core Scripts

### `autoShack.py`
The main controller script that orchestrates the entire system:
- **Sensor Reading**: Collects data every second from all connected sensors
- **Schedule Processing**: Retrieves and processes watering schedules
- **Pump Control**: Manages water pump operation based on schedule
- **Data Logging**: Stores sensor readings and pump status to database
- **Error Handling**: Graceful fallback for database connectivity issues

**Key Features:**
- Continuous monitoring loop with 1-second intervals
- Database connectivity with automatic reconnection
- Comprehensive logging with daily log rotation
- Clean shutdown handling

### `configData.py`
Schedule and configuration management:
- **Database Schedule**: Primary schedule source from `shackSchedule` table
- **File Fallback**: JSON configuration file backup when database unavailable
- **Schedule Processing**: Determines pump state based on current time
- **Dynamic Configuration**: Real-time schedule updates

**Schedule Format:**
```json
{
  "events": [
    {
      "index": 1,
      "start_hour": 6,
      "start_minute": 0,
      "duration": 30
    }
  ]
}
```

### Hardware Interface Classes

#### `pump.py` - Water Pump Control
- **GPIO Control**: Direct GPIO pin manipulation for pump operation
- **Safety Features**: Proper setup and teardown procedures
- **Async Support**: Time-based pump operation with logging
- **State Management**: ON/OFF state tracking

#### `flow.py` - Flow Rate Monitoring
- **Pulse Counting**: Interrupt-based flow pulse detection
- **Rate Calculation**: Converts pulses to liters per minute
- **Calibration**: Configurable conversion factors
- **Real-time Monitoring**: Continuous flow rate updates

#### `humidityTempSensor.py` - Environmental Sensing
- **DHT22 Integration**: Temperature and humidity readings
- **Error Handling**: Timeout and invalid reading management
- **Multi-sampling**: Improved accuracy through sample averaging
- **Unit Conversion**: Fahrenheit temperature output

### Database Classes

#### `sqlDatabase.py` - MySQL Integration
- **Connection Management**: Automatic connection and reconnection
- **Data Insertion**: Structured logging of sensor data
- **Query Interface**: Schedule retrieval and data queries
- **Error Recovery**: Graceful handling of connection failures

#### `mongoDatabase.py` - MongoDB Alternative
- **Document Storage**: JSON-based data storage
- **Batch Operations**: Efficient bulk data insertion
- **TLS Security**: Secure certificate-based authentication
- **Log Processing**: Automated log file to database migration

## Installation

### Prerequisites
```bash
# Install system dependencies (Raspberry Pi)
sudo apt update
sudo apt install python3-pip python3-venv git

# Install pigpio daemon (required for DHT22)
sudo apt install pigpio python3-pigpio
sudo systemctl enable pigpiod
sudo systemctl start pigpiod
```

### Python Environment
```bash
# Navigate to controller directory
cd shackController/scripts

# Install Python dependencies
pip3 install -r requirements.txt
```

### Environment Configuration
Create a `.env` file in the scripts directory:
```bash
# MySQL Database Configuration
MYSQL_HOST=your_database_host
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database_name
```

### Hardware Setup
1. **Connect DHT22** sensor to GPIO pin 27
2. **Connect Flow Sensor** to GPIO pin 23 with pull-up resistor
3. **Connect Water Pump** relay to GPIO pin 18
4. **Verify GPIO permissions** for the running user

## Usage

### Manual Execution
```bash
# Run the main controller
python3 autoShack.py

# Test individual components
python3 configData.py
python3 pump.py
python3 flow.py
```

### Service Installation
Create a systemd service for automatic startup:
```bash
sudo nano /etc/systemd/system/autoshack.service
```

```ini
[Unit]
Description=AutoShack Controller
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/path/to/shackController/scripts
ExecStart=/usr/bin/python3 autoShack.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable autoshack.service
sudo systemctl start autoshack.service
```

## Configuration

### Schedule Configuration
Watering schedules can be configured through:

1. **Database (Primary)**: `shackSchedule` table with columns:
   - `id`: Schedule entry identifier
   - `start_hour`: Hour to begin watering (0-23)
   - `duration`: Duration in minutes

2. **File Fallback**: `shack.config.json` in the root directory

### Logging
- **Application Logs**: `logs/shack.log` (daily rotation, 5-day retention)
- **Component Logs**: Individual log files for each component
- **Database Logs**: Sensor data stored in `shacklog` table

### GPIO Pin Configuration
Modify pin assignments in the respective class constructors:
```python
# autoShack.py
self.temp_humidity_sensor = HumidityTempSensor(27, self.logger)  # DHT22
self.flow_sensor = FlowSensor(23, self.logger)                  # Flow sensor
self.pump = Pump(18, self.logger)                               # Pump relay
```

## Monitoring

### Log Files
```bash
# View real-time logs
tail -f logs/shack.log

# Check service status
sudo systemctl status autoshack.service
```

### Database Monitoring
```sql
-- Recent sensor readings
SELECT * FROM shacklog ORDER BY datetime DESC LIMIT 10;

-- Current schedule
SELECT * FROM shackSchedule WHERE active = 1;
```

## Troubleshooting

### Common Issues

**Database Connection Failures**
- Verify network connectivity and credentials
- Check MySQL service status
- Review connection logs
- System automatically falls back to file configuration

**Sensor Reading Errors**
- Verify GPIO connections and permissions
- Check pigpio daemon status: `sudo systemctl status pigpiod`
- Ensure proper sensor power supply
- Review DHT22 sensor placement and wiring

**Pump Control Issues**
- Verify relay connections and power
- Check GPIO pin assignments
- Test relay operation manually
- Review pump power requirements

**Permission Errors**
```bash
# Add user to gpio group
sudo usermod -a -G gpio $USER

# Set pigpio permissions
sudo chmod 666 /dev/gpiomem
```

### Debug Mode
Enable verbose logging by modifying the logging level:
```python
self.logger.setLevel(logging.DEBUG)
```

## Dependencies

See `requirements.txt` for the complete list:
- `pigpio-dht`: DHT22 sensor interface
- `RPi.GPIO`: Raspberry Pi GPIO control
- `python-dotenv`: Environment variable management
- `pymysql` / `mysql-connector-python`: MySQL database connectivity
- `python-json-logger`: Structured logging

## Integration

The shackController integrates with other AutoShack components:
- **shackServer**: Provides API endpoints for schedule management
- **shackWeb**: Web interface for monitoring and control
- **shackNotifications**: Alert system for system status
- **shackCamera**: Visual monitoring integration

## Development

### Adding New Sensors
1. Create a new sensor class following the existing pattern
2. Add sensor initialization to `autoShack.py`
3. Include sensor readings in the data collection loop
4. Update database schema if needed

### Modifying Schedules
Schedule logic is centralized in `configData.py`. The `set_desired_pump_state()` method can be modified to implement different scheduling algorithms.

### Testing
Individual components can be tested independently:
```bash
# Test pump operation
python3 -c "from pump import Pump; import logging; p = Pump(18, logging.getLogger()); p.pump_on(); time.sleep(5); p.pump_off()"

# Test sensor readings
python3 -c "from humidityTempSensor import HumidityTempSensor; import logging; s = HumidityTempSensor(27, logging.getLogger()); s.get_reading(); print(f'Temp: {s.temperature}F, Humidity: {s.humidity}%')"
```