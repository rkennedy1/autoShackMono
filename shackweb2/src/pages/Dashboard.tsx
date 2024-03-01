import { Grid } from "@mui/material";
import LastThreeDays from "./LastThreeDays";
import WateringSchedule from "./WateringSchedule";

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} alignItems={"stretch"}>
        <LastThreeDays />
      </Grid>
      <Grid item xs={6}>
        <WateringSchedule />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
