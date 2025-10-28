# shackNotifications

The notification system for the AutoShack monitoring platform. This module provides email-based alerting for critical system events and monitoring failures.

## Overview

The shackNotifications module contains utilities for sending automated email alerts when the AutoShack system encounters issues or requires attention. It monitors watering events and system uptime, sending notifications to administrators when problems are detected.

## Components

### `emailUtil.py`
A utility class for sending emails via Gmail SMTP.

**Features:**
- SSL-secured email sending through Gmail
- Support for multiple recipients
- Simple interface for authentication and message delivery

**Usage:**
```python
from emailUtil import EmailUtil

emailUtil = EmailUtil("sender@gmail.com", "app_password")
emailUtil.sendEmail(["recipient@example.com"], "Your message here")
```

### `missedWaterAlert.py`
Monitors watering events and sends alerts when no watering has occurred within a specified timeframe.

**Features:**
- Queries MySQL database for recent watering events (flow_rate > 0)
- Checks for watering activity in the last 12 hours
- Sends "RED ALERT" notifications when no watering events are detected
- Configurable recipient list

**Database Query:**
- Connects to MySQL database using environment variables
- Searches `shacklog` table for recent flow events
- Uses datetime comparison to identify missed watering periods

### `uptimeStatusAlert.py`
Monitors system uptime and sends notifications when the server becomes unreachable.

**Features:**
- Ping-based server health checking
- Automatic notification when host is unreachable
- Configurable hostname monitoring via environment variables

## Environment Variables

The following environment variables must be configured:

**Database Connection (for missedWaterAlert.py):**
- `MYSQL_HOST` - MySQL server hostname
- `MYSQL_USER` - Database username
- `MYSQL_PASSWORD` - Database password
- `MYSQL_DATABASE` - Database name

**System Monitoring (for uptimeStatusAlert.py):**
- `HOSTNAME` - Target hostname to monitor for uptime

## Dependencies

```
pymysql
python-dotenv
```

## Usage

### Running Missed Water Alert
```bash
python missedWaterAlert.py
```

### Running Uptime Status Alert
```bash
python uptimeStatusAlert.py
```

## Email Configuration

Both alert scripts use hardcoded Gmail credentials:
- **Sender:** autoshackpi@gmail.com
- **App Password:** Uses Gmail app-specific password for authentication

**Note:** For production use, consider moving email credentials to environment variables for better security.

## Alert Recipients

Current notification recipients include:
- rskennedy99@gmail.com
- mskennedy67@gmail.com
- christy_kennedy@hotmail.com (uptime alerts only)

## Integration

These notification scripts are typically run as:
- **Scheduled cron jobs** for periodic monitoring
- **Triggered alerts** from other AutoShack components
- **Manual execution** for testing purposes

## Security Considerations

- Gmail app passwords are currently hardcoded in the source
- Consider using environment variables for email credentials
- Ensure proper access controls for notification recipient lists
- Monitor email sending quotas and rate limits
