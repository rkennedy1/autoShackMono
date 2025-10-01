import React, { useState, useEffect } from "react";
import { Grid, Container, Typography, Alert, Snackbar } from "@mui/material";
import {
  TemperatureCard,
  HumidityCard,
  FlowRateCard,
  NextScheduleCard,
} from "../components/StatusCard";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import LastThreeDays from "./LastThreeDays";
import WateringSchedule from "./WateringSchedule";
import { getLastItem, getSchedule } from "../api/api";
import { shacklogItem, scheduleItem } from "../util/models";

const EnhancedDashboard: React.FC = () => {
  const [lastReading, setLastReading] = useState<shacklogItem | null>(null);
  const [schedule, setSchedule] = useState<scheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [readingData, scheduleData] = await Promise.all([
          getLastItem(),
          getSchedule(),
        ]);

        if (readingData) {
          setLastReading(readingData);
        }

        if (scheduleData) {
          setSchedule(scheduleData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDashboardData();

    // Set up interval to refresh data every 60 seconds (reduced frequency)
    const interval = setInterval(fetchDashboardData, 60000);

    return () => clearInterval(interval);
  }, []);

  const getNextScheduledWatering = () => {
    if (!schedule.length) return null;

    const now = new Date();
    const currentHour = now.getHours();

    // Sort schedule by start_hour
    const sortedSchedule = [...schedule].sort(
      (a, b) => a.start_hour - b.start_hour
    );

    // Find next scheduled watering
    let nextSchedule = sortedSchedule.find(
      (item) => item.start_hour > currentHour
    );

    // If no schedule found for today, get the first one for tomorrow
    if (!nextSchedule) {
      nextSchedule = sortedSchedule[0];
    }

    if (nextSchedule) {
      const nextDate = new Date();
      if (nextSchedule.start_hour <= currentHour) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      nextDate.setHours(nextSchedule.start_hour, 0, 0, 0);

      return {
        time: nextDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: nextSchedule.duration,
      };
    }

    return null;
  };

  const formatLastWatering = () => {
    if (!lastReading || !lastReading.datetime) return undefined;

    const lastTime = new Date(lastReading.datetime);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" variant="filled" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const nextWatering = getNextScheduledWatering();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        Dashboard
      </Typography>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }} data-testid="status-cards">
        <Grid item xs={12} sm={6} md={3}>
          <TemperatureCard
            temperature={lastReading?.temperature || 0}
            trend="flat"
            trendValue="Stable"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <HumidityCard
            humidity={lastReading?.humidity || 0}
            trend="flat"
            trendValue="Normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FlowRateCard
            flowRate={lastReading?.flow_rate || 0}
            isActive={(lastReading?.flow_rate || 0) > 0}
            lastWatering={formatLastWatering()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <NextScheduleCard
            nextSchedule={nextWatering?.time}
            scheduledDuration={nextWatering?.duration}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <LastThreeDays />
        </Grid>
        <Grid item xs={12} lg={4}>
          <WateringSchedule />
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={null}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
          data-testid="error-alert"
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EnhancedDashboard;
