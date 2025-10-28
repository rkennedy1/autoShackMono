import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  LocalFlorist,
  WaterDrop,
  DeviceThermostat,
  Opacity,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../theme/ThemeProvider";
import { getLastItem } from "../api/api";
import { shacklogItem } from "../util/models";

const AppHeader: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [lastReading, setLastReading] = useState<shacklogItem | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchLastReading = async () => {
      try {
        const data = await getLastItem();
        if (data) {
          setLastReading(data);
          setLastUpdate(fixUtcMarkedAsLocal(new Date(data.datetime)));
        }
      } catch (error) {
        console.error("Error fetching last reading:", error);
      }
    };

    function fixUtcMarkedAsLocal(input: string | Date): Date {
      const d = typeof input === "string" ? new Date(input) : input;
      // Shift the instant forward by the local offset so its *displayed* wall time matches the original text
      return new Date(d.getTime() + d.getTimezoneOffset() * 60_000);
    }

    // Fetch initial data
    fetchLastReading();

    // Set up interval to fetch data every 60 seconds (reduced frequency)
    const interval = setInterval(fetchLastReading, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (
    value: number,
    type: "temp" | "humidity" | "flow"
  ) => {
    switch (type) {
      case "temp":
        if (value < 10 || value > 35) return "error";
        if (value < 15 || value > 30) return "warning";
        return "success";
      case "humidity":
        if (value < 30 || value > 80) return "warning";
        if (value < 40 || value > 70) return "success";
        return "primary";
      case "flow":
        return value > 0 ? "primary" : "default";
      default:
        return "default";
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <LocalFlorist
            data-testid="eco-icon"
            sx={{ fontSize: 32, mr: 1, color: theme.palette.common.white }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.common.white,
              display: { xs: "none", sm: "block" },
            }}
          >
            AutoShack
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.common.white,
              display: { xs: "block", sm: "none" },
            }}
          >
            AutoShack
          </Typography>
        </Box>

        {/* Status Indicators */}
        {lastReading && (
          <Box
            data-testid="status-indicators"
            sx={{
              display: "flex",
              gap: 1,
              mr: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Tooltip title={`Temperature: ${lastReading.temperature}°F`}>
              <Chip
                icon={<DeviceThermostat />}
                label={`${lastReading.temperature}°F`}
                size="small"
                color={getStatusColor(lastReading.temperature, "temp")}
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: theme.palette.common.white,
                  "& .MuiChip-icon": {
                    color: theme.palette.common.white,
                  },
                  display: { xs: "none", md: "flex" },
                }}
              />
            </Tooltip>

            <Tooltip title={`Humidity: ${lastReading.humidity}%`}>
              <Chip
                icon={<Opacity />}
                label={`${lastReading.humidity}%`}
                size="small"
                color={getStatusColor(lastReading.humidity, "humidity")}
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: theme.palette.common.white,
                  "& .MuiChip-icon": {
                    color: theme.palette.common.white,
                  },
                  display: { xs: "none", md: "flex" },
                }}
              />
            </Tooltip>

            <Tooltip title={`Flow Rate: ${lastReading.flow_rate} L/min`}>
              <Chip
                icon={<WaterDrop />}
                label={lastReading.flow_rate > 0 ? "Active" : "Idle"}
                size="small"
                color={getStatusColor(lastReading.flow_rate, "flow")}
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: theme.palette.common.white,
                  "& .MuiChip-icon": {
                    color: theme.palette.common.white,
                  },
                }}
              />
            </Tooltip>
          </Box>
        )}

        {/* Last Update Time */}
        {lastUpdate && (
          <Typography
            variant="caption"
            data-testid="mobile-hidden"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              mr: 2,
              display: { xs: "none", sm: "block" },
            }}
          >
            Updated: {formatTime(lastUpdate)}
          </Typography>
        )}

        {/* Theme Toggle */}
        <Tooltip
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <IconButton
            data-testid="theme-toggle"
            onClick={toggleTheme}
            color="inherit"
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
