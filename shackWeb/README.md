# ShackWeb - AutoShack Monitoring Dashboard

The web frontend for the AutoShack automated plant watering system. This React application provides real-time monitoring of environmental sensors and management of watering schedules.

## Overview

ShackWeb is part of the AutoShackMono project, serving as the user interface for:
- Viewing real-time sensor data (temperature, humidity, water flow)
- Managing automated watering schedules
- Monitoring system performance over the last 3 days

## Features

### 📊 Dashboard
- **Real-time Monitoring**: View current sensor readings and system status
- **Historical Data**: Interactive charts showing the last 3 days of sensor data
- **Split View**: Side-by-side display of data visualization and schedule management

### 💧 Watering Schedule Management
- **Add/Edit/Delete**: Manage watering schedules with start times and durations
- **Real-time Updates**: Changes are immediately synchronized with the backend
- **Validation**: Input validation to prevent scheduling conflicts

### 📈 Data Visualization
- **Interactive Charts**: Built with `react-charts` for smooth data visualization
- **Multi-series Data**: Temperature, humidity, and flow rate on synchronized timelines
- **Responsive Design**: Charts adapt to different screen sizes

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Charts**: React Charts v3 (beta)
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, Cypress E2E
- **Build**: Create React App
- **Deployment**: Docker with Nginx

## API Integration

The application connects to the ShackServer backend (port 1783) with the following endpoints:

### Data Endpoints
- `GET /data/lastItem` - Latest sensor reading
- `GET /data/lastThreeDays` - Historical data for charts
- `GET /data/lastTenFlows` - Recent watering events

### Schedule Management
- `GET /schedule` - Fetch all watering schedules
- `POST /schedule/add` - Add new schedule item
- `POST /schedule/update` - Update existing schedule
- `POST /schedule/delete` - Remove schedule item

## Data Models

### Sensor Data (`shacklogItem`)
```typescript
interface shacklogItem {
  datetime: Date;
  flow_rate: number;
  temperature: number;
  humidity: number;
}
```

### Schedule Item (`scheduleItem`)
```typescript
interface scheduleItem {
  id?: number;
  start_hour: number;  // Hour of day (0-23)
  duration: number;    // Duration in minutes
}
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Running ShackServer backend (see `../shackServer/README.md`)

### Installation

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Start development server**:
   ```bash
   yarn start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

3. **Backend Connection**: Ensure the ShackServer is running on port 1783 for full functionality

### Available Scripts

- `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run unit tests
- `yarn test --coverage` - Run tests with coverage report

## Testing

### Unit Tests
```bash
yarn test
```

### End-to-End Tests (Cypress)
```bash
# Install Cypress dependencies
npx cypress install

# Run Cypress tests
npx cypress run

# Open Cypress Test Runner
npx cypress open
```

Test files are located in:
- `cypress/e2e/` - End-to-end tests
- `cypress/components/` - Component tests

## Docker Deployment

### Build Image
```bash
docker build -t shackweb .
```

### Run Container
```bash
docker run -p 8080:80 shackweb
```

The Dockerfile uses a multi-stage build:
1. **Build Stage**: Node.js Alpine to build the React app
2. **Production Stage**: Nginx to serve static files

### Docker Compose
The application is typically deployed as part of the AutoShackMono stack:
```bash
# From project root
docker-compose up shackweb
```

## Project Structure

```
src/
├── api/              # API client and HTTP utilities
├── components/       # Reusable React components
│   ├── Loading.tsx   # Loading spinner component
│   ├── ScheduleItem.tsx  # Individual schedule entry
│   └── ShackGraph.tsx    # Data visualization component
├── pages/            # Page components
│   ├── Dashboard.tsx     # Main dashboard layout
│   ├── LastThreeDays.tsx # Historical data view
│   └── WateringSchedule.tsx # Schedule management
├── util/             # Utilities and type definitions
│   └── models.ts     # TypeScript interfaces
├── App.tsx           # Root application component
└── index.tsx         # Application entry point
```

## Environment Configuration

The application automatically detects the backend server using the current hostname and port 1783. For different environments:

- **Development**: Connects to `localhost:1783`
- **Production**: Connects to `[hostname]:1783`

## Contributing

1. **Code Style**: Follow existing TypeScript and React conventions
2. **Testing**: Add tests for new features
3. **Components**: Keep components focused and reusable
4. **API**: Use the centralized API client in `src/api/api.ts`

## Troubleshooting

### Common Issues

**"No data available"**
- Ensure ShackServer is running and accessible
- Check browser console for API errors
- Verify backend database contains data

**Schedule updates not saving**
- Check network connectivity to backend
- Verify schedule item format (start_hour: 0-23, duration in minutes)
- Check browser console for validation errors

**Charts not displaying**
- Ensure there's data in the last 3 days
- Check for JavaScript errors in browser console
- Verify chart container has proper dimensions

### Debug Mode
Enable additional logging by opening browser developer tools and checking the console for detailed error messages.

## Related Projects

- **shackServer**: Backend API server (`../shackServer/`)
- **shackController**: Hardware controller (`../shackController/`)
- **shackNotifications**: Alert system (`../shackNotifications/`)

## License

Part of the AutoShackMono project. See root project for license information.
