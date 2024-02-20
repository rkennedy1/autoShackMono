import { Grid } from "@mui/material";
import LastTenWaterings from "./LastTenWaterings";
import WateringSchedule from "./WateringSchedule";

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <LastTenWaterings />
      </Grid>
      <Grid item xs={6}>
        <WateringSchedule />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
