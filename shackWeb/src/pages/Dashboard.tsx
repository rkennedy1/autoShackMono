import { Grid } from "@mui/material";
import LastThreeDays from "./LastThreeDays";
import WateringSchedule from "./WateringSchedule";
import GrowCycleTracking from "./GrowCycleTracking";

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} alignItems={"stretch"}>
        <LastThreeDays />
      </Grid>
      <Grid item xs={6}>
        <WateringSchedule />
        <GrowCycleTracking />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
