import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  DeviceThermostat,
  Opacity,
  WaterDrop,
  Schedule,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from "@mui/icons-material";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  subtitle?: string;
  progress?: number; // 0-100 for progress bar
  isActive?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  icon,
  color = "primary",
  trend,
  trendValue,
  subtitle,
  progress,
  isActive = false,
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp fontSize="small" color="success" />;
      case "down":
        return <TrendingDown fontSize="small" color="error" />;
      case "flat":
        return <TrendingFlat fontSize="small" color="disabled" />;
      default:
        return null;
    }
  };

  const getColorValue = (colorName: string) => {
    return theme.palette[colorName as keyof typeof theme.palette] as any;
  };

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "visible",
        border: isActive ? `2px solid ${getColorValue(color).main}` : "none",
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            top: -1,
            left: -1,
            right: -1,
            height: 4,
            backgroundColor: getColorValue(color).main,
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header with icon */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(getColorValue(color).main, 0.1),
              color: getColorValue(color).main,
              mr: 2,
            }}
          >
            {icon}
          </Box>

          {/* Title and main content container */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {title}
            </Typography>

            {/* Main value */}
            <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  color: getColorValue(color).main,
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>
              {unit && (
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ ml: 0.5, fontWeight: 400 }}
                >
                  {unit}
                </Typography>
              )}
            </Box>

            {/* Subtitle */}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {subtitle}
              </Typography>
            )}

            {/* Progress bar */}
            {progress !== undefined && (
              <Box sx={{ mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(getColorValue(color).main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getColorValue(color).main,
                      borderRadius: 3,
                    },
                  }}
                />
                {/* <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {progress}% of optimal range
                </Typography> */}
              </Box>
            )}
          </Box>
        </Box>

        {/* Trend indicator */}
        {trend && trendValue && (
          <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
            {getTrendIcon()}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {trendValue}
            </Typography>
          </Box>
        )}

        {/* Status chip for active states */}
        {isActive && (
          <Chip
            label="Active"
            size="small"
            color={color}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              fontWeight: 500,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Predefined status cards for common use cases
export const TemperatureCard: React.FC<{
  temperature: number;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}> = ({ temperature, trend, trendValue }) => {
  const getTemperatureColor = (temp: number) => {
    if (temp < 10 || temp > 35) return "error";
    if (temp < 15 || temp > 30) return "warning";
    return "success";
  };

  const getTemperatureProgress = (temp: number) => {
    // Optimal range: 15-30°C
    if (temp < 15) return Math.max(0, (temp / 15) * 50);
    if (temp > 30) return Math.max(50, 100 - ((temp - 30) / 10) * 50);
    return 50 + ((temp - 15) / 15) * 50;
  };

  return (
    <StatusCard
      title="Temperature"
      value={temperature}
      unit="°F"
      icon={<DeviceThermostat />}
      color={getTemperatureColor(temperature)}
      trend={trend}
      trendValue={trendValue}
      progress={getTemperatureProgress(temperature)}
      subtitle="Current ambient temperature"
    />
  );
};

export const HumidityCard: React.FC<{
  humidity: number;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}> = ({ humidity, trend, trendValue }) => {
  const getHumidityColor = (hum: number) => {
    if (hum < 30 || hum > 80) return "warning";
    if (hum >= 40 && hum <= 70) return "success";
    return "primary";
  };

  return (
    <StatusCard
      title="Humidity"
      value={humidity}
      unit="%"
      icon={<Opacity />}
      color={getHumidityColor(humidity)}
      trend={trend}
      trendValue={trendValue}
      progress={humidity}
      subtitle="Relative humidity level"
    />
  );
export const FlowRateCard: React.FC<{
  flowRate: number;
  isActive?: boolean;
  lastWatering?: string;
}> = ({ flowRate, isActive = false, lastWatering }) => {
  return (
    <StatusCard
      title="Water Flow"
      value={flowRate}
      unit="L/min"
      icon={<WaterDrop />}
      color="secondary"
      isActive={isActive}
      subtitle={
        lastWatering ? `Last watering: ${lastWatering}` : "Water flow rate"
      }
    />
  );
};

export const NextScheduleCard: React.FC<{
  nextSchedule?: string;
  scheduledDuration?: number;
}> = ({ nextSchedule, scheduledDuration }) => {
  return (
    <StatusCard
      title="Next Watering"
      value={nextSchedule || "Not scheduled"}
      icon={<Schedule />}
      color="primary"
      subtitle={
        scheduledDuration
          ? `Duration: ${scheduledDuration} minutes`
          : "Upcoming watering schedule"
      }
    />
  );
};

export default StatusCard;
