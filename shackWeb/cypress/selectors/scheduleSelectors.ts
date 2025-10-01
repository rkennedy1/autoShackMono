import { searchById, searchContainsId } from "../support/utils";

export const selectors = {
  shackScheduleHeading: searchById("shackScheduleHeading"),
  shackScheduleItem: searchContainsId("shackScheduleItem"),
  startTimeInput: searchContainsId("startTimeInput"),
  durationInput: searchContainsId("durationInput"),
  saveButton: searchContainsId("saveButton"),
  plusButton: searchContainsId("plusButton"),
  trashButton: searchContainsId("trashButton"),
  addNewItemButton: searchContainsId("AddNewItemButton"),
};

// New selectors for enhanced UI
export const dashboardSelectors = {
  // Header
  appHeader: '[data-testid="app-header"]',
  themeToggle: '[data-testid="theme-toggle"]',

  // Status Cards
  temperatureCard: '[data-testid="temperature-card"]',
  humidityCard: '[data-testid="humidity-card"]',
  flowRateCard: '[data-testid="flow-rate-card"]',
  nextScheduleCard: '[data-testid="next-schedule-card"]',

  // Chart
  chartContainer: '[data-testid="chart-container"]',
  chartLegend: '[data-testid="chart-legend"]',

  // Schedule
  scheduleContainer: '[data-testid="schedule-container"]',
  scheduleHeader: '[data-testid="schedule-header"]',

  // Loading states
  loadingSkeleton: '[data-testid="loading-skeleton"]',
};
