import React from "react";
import { Card, CardContent, Skeleton, Box, Grid } from "@mui/material";

// Generic skeleton for status cards
export const StatusCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with icon and title */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{ mr: 2, borderRadius: 2 }}
          />
          <Skeleton variant="text" width={120} height={28} />
        </Box>

        {/* Main value */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width={100} height={48} />
        </Box>

        {/* Subtitle */}
        <Skeleton variant="text" width={160} height={20} sx={{ mb: 2 }} />

        {/* Progress bar */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={6}
          sx={{ borderRadius: 3, mb: 1 }}
        />
        <Skeleton variant="text" width={80} height={16} />
      </CardContent>
    </Card>
  );
};

// Skeleton for the chart component
export const ChartSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Chart title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Skeleton variant="text" width={150} height={32} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>

        {/* Chart area */}
        <Box sx={{ position: "relative", height: 300 }}>
          {/* Y-axis labels */}
          <Box
            sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40 }}
          >
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={30}
                height={16}
                sx={{ position: "absolute", top: `${i * 20}%` }}
              />
            ))}
          </Box>

          {/* Chart lines */}
          <Box sx={{ ml: 5, height: "100%", position: "relative" }}>
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={1}
                sx={{ position: "absolute", top: `${(i + 1) * 20}%` }}
              />
            ))}

            {/* Data lines */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={2}
              sx={{ position: "absolute", top: "30%", borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={2}
              sx={{ position: "absolute", top: "50%", borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={2}
              sx={{ position: "absolute", top: "70%", borderRadius: 1 }}
            />
          </Box>

          {/* X-axis labels */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              ml: 5,
            }}
          >
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} variant="text" width={40} height={16} />
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Skeleton variant="circular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Skeleton for schedule items
export const ScheduleItemSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", p: 2, mb: 1 }}>
      <Skeleton variant="text" width={80} height={24} sx={{ mr: 2 }} />
      <Skeleton
        variant="rectangular"
        width={100}
        height={40}
        sx={{ mr: 2, borderRadius: 1 }}
      />
      <Skeleton variant="text" width={80} height={24} sx={{ mr: 2 }} />
      <Skeleton
        variant="rectangular"
        width={100}
        height={40}
        sx={{ mr: 2, borderRadius: 1 }}
      />
      <Skeleton
        variant="rectangular"
        width={40}
        height={40}
        sx={{ mr: 1, borderRadius: 1 }}
      />
      <Skeleton
        variant="rectangular"
        width={40}
        height={40}
        sx={{ borderRadius: 1 }}
      />
    </Box>
  );
};

// Skeleton for the schedule section
export const ScheduleSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 3 }} />

        {/* Schedule items */}
        {[...Array(3)].map((_, i) => (
          <ScheduleItemSkeleton key={i} />
        ))}

        {/* Add button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Dashboard skeleton that combines all components
export const DashboardSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }} data-testid="loading-skeleton">
      {/* Status cards row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatusCardSkeleton />
          </Grid>
        ))}
      </Grid>

      {/* Main content row */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartSkeleton />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScheduleSkeleton />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
