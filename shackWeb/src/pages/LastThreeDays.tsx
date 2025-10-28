import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Stack
} from "@mui/material";
import { 
  ShowChart,
  DeviceThermostat,
  Opacity,
  WaterDrop
} from "@mui/icons-material";
import { shacklogItem } from "../util/models";
import ShackGraph from "../components/ShackGraph";
import { getLastThreeDays } from "../api/api";
import { ChartSkeleton } from "../components/LoadingSkeleton";

const NO_DATA_MESSAGE = "No data available";
const ERROR_FETCHING_DATA_MESSAGE = "Error fetching data:";

const LastThreeDays = () => {
  const [shackData, setShackData] = useState<shacklogItem[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getLastThreeDays()
      .then((resp: shacklogItem[] | null) => {
        if (resp && resp.length > 0) {
          setShackData(resp);
        } else {
          console.log(NO_DATA_MESSAGE);
        }
      })
      .catch((error: Error) => {
        console.error(ERROR_FETCHING_DATA_MESSAGE, error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ShowChart sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Last 3 Days
            </Typography>
          </Box>
          
          {/* Legend */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
            <Chip
              icon={<WaterDrop />}
              label="Flow Rate"
              size="small"
              variant="outlined"
              color="secondary"
            />
            <Chip
              icon={<Opacity />}
              label="Humidity"
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              icon={<DeviceThermostat />}
              label="Temperature"
              size="small"
              variant="outlined"
              color="warning"
            />
          </Stack>
        </Box>

        {/* Chart Content */}
        <Box sx={{ height: 400, width: "100%" }}>
          {shackData && shackData.length > 0 ? (
            <ShackGraph data={shackData} />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">{NO_DATA_MESSAGE}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LastThreeDays;
