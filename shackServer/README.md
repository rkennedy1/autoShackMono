# AutoShack Server

A Node.js/TypeScript Express server that provides the backend API for the AutoShack IoT watering system. This server manages sensor data logging, watering schedules, and camera integration for automated plant care.

## Overview

The AutoShack Server is the central hub of the AutoShack system, providing RESTful APIs for:
- **Sensor Data Management**: Collecting and retrieving humidity, temperature, and flow rate data
- **Watering Schedule Management**: CRUD operations for automated watering schedules
- **Camera Integration**: Handling latest picture updates from the camera module
- **Rate Limiting & Security**: Built-in request rate limiting and CORS support

## Architecture

```
├── index.ts           # Main server entry point with Express configuration
├── models.ts          # TypeScript interfaces and data models
├── src/
│   ├── data.ts        # Routes for sensor data retrieval
│   ├── schedule.ts    # Routes for schedule management
│   └── db.ts          # MySQL database connection configuration
├── swagger.ts         # Swagger API documentation generator
└── Dockerfile         # Multi-stage Docker build configuration
```

## API Endpoints

### Camera Operations
- `POST /lastPicture` - Update the latest picture filename
- `GET /lastPicture` - Retrieve the latest picture filename

### Sensor Data (`/data`)
- `GET /data/lastDay` - Get sensor data from the last 24 hours
- `GET /data/lastThreeDays` - Get sensor data from the last 3 days
- `GET /data/lastWeek` - Get sensor data from the last 7 days
- `GET /data/lastTwoWeeks` - Get sensor data from the last 14 days
- `GET /data/lastMonth` - Get sensor data from the last 30 days
- `GET /data/lastItem` - Get the most recent sensor reading
- `GET /data/lastFlow` - Get the last recorded flow event
- `GET /data/lastTenFlows` - Get the last 10 flow events

### Schedule Management (`/schedule`)
- `GET /schedule` - Retrieve all watering schedules
- `POST /schedule/add` - Add a new watering schedule
- `POST /schedule/update` - Update an existing schedule
- `POST /schedule/delete` - Delete a schedule

### API Documentation
- `GET /api-docs` - Interactive Swagger UI documentation

## Data Models

### ShackSchedule
```typescript
interface ShackSchedule {
  start_hour: string;    // When to start watering (HH:MM format)
  duration: string;      // How long to water (minutes)
  id: number;           // Unique identifier
}
```

### shackLogItem
```typescript
interface shackLogItem {
  id: number;
  datetime: Date;
  humdity: number;       // Humidity percentage
  temperature: number;   // Temperature in Celsius
  flow_rate: number;     // Water flow rate
  pump_status: string;   // Current pump status
  execution_time: number; // Process execution time
}
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=1783                    # Server port (default: 1783)
MYSQL_HOST=localhost         # MySQL database host
MYSQL_USER=your_username     # MySQL username
MYSQL_PASSWORD=your_password # MySQL password
MYSQL_DATABASE=autoshack     # MySQL database name
```

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL database
- Yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Build the project:**
   ```bash
   yarn build
   ```

4. **Generate API documentation:**
   ```bash
   yarn swagger
   ```

### Development

Start the development server with hot reloading:
```bash
yarn dev
```

The server will start on `http://localhost:1783` with automatic restart on file changes.

### Production

Start the production server:
```bash
yarn start
```

## Docker Deployment

The server includes a multi-stage Dockerfile for optimized production deployment:

```bash
# Build the Docker image
docker build -t autoshack-server .

# Run the container
docker run -p 1783:1783 --env-file .env autoshack-server
```

The Dockerfile uses:
- **Stage 1**: Build stage with full Node.js environment
- **Stage 2**: Production stage with Alpine Linux for minimal image size

## Database Schema

The server expects the following MySQL tables:

### shacklog
Stores sensor readings and system logs:
```sql
CREATE TABLE shacklog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  datetime DATETIME,
  humdity DECIMAL(5,2),
  temperature DECIMAL(5,2),
  flow_rate DECIMAL(5,2),
  pump_status VARCHAR(50),
  execution_time INT
);
```

### shackSchedule
Stores watering schedules:
```sql
CREATE TABLE shackSchedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_hour VARCHAR(5),
  duration VARCHAR(10)
);
```

## Security Features

- **Rate Limiting**: 100 requests per 15-minute window per IP
- **CORS**: Cross-origin resource sharing enabled
- **Error Handling**: Centralized error middleware
- **SQL Injection Protection**: Parameterized queries

## Monitoring & Logging

- Request rate limiting with express-rate-limit
- Error logging to console with stack traces
- Swagger documentation for API testing and monitoring

## Related Components

This server works with other AutoShack components:
- **shackController**: Python scripts that collect sensor data and post to this API
- **shackWeb**: React frontend that consumes this API
- **shackCamera**: Camera module that posts images via the `/lastPicture` endpoint
- **shackNotifications**: Alert system that monitors API endpoints

## API Usage Examples

### Get Recent Sensor Data
```bash
curl http://localhost:1783/data/lastDay
```

### Add a Watering Schedule
```bash
curl -X POST http://localhost:1783/schedule/add \
  -H "Content-Type: application/json" \
  -d '{"start_hour": "08:00", "duration": "5"}'
```

### Update Latest Picture
```bash
curl -X POST http://localhost:1783/lastPicture \
  -H "Content-Type: application/json" \
  -d '{"fileName": "plant_20231201_080000.jpg"}'
```

## Development Notes

- The server uses TypeScript for type safety
- Database connections use connection pooling for better performance
- All routes include Swagger documentation comments
- The `/data` router has some duplicate route definitions that should be cleaned up
- Static file serving is configured for `public/` and `images/` directories

## Contributing

When making changes:
1. Update TypeScript interfaces in `models.ts` if data structures change
2. Add Swagger comments to new routes using `// #swagger.tags = ['TagName']`
3. Run `yarn swagger` to regenerate API documentation
4. Test endpoints using the Swagger UI at `/api-docs`

## License

MIT License - see the main project LICENSE file for details.