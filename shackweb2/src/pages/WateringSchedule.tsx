import { useEffect, useState } from "react";
import { api } from "../api/api";
import { scheduleItem } from "../util/models";
import { Typography } from "@mui/material";

const API = new api();

const WateringSchedule = () => {
  const [items, setItems] = useState<scheduleItem[]>();

  useEffect(() => {
    //API.getLastThreeDays().then((resp) => setItems(resp));
    API.getSchedule().then((resp) => setItems(resp));
  }, []);

  return (
    <div>
      <h2>Shack Schedule</h2>
      {items !== undefined &&
        items.map((item, i) => {
          return (
            <div key={i}>
              <Typography>
                start time: {item.start_hour} duration: {item.duration}
              </Typography>
            </div>
          );
        })}
    </div>
  );
};

export default WateringSchedule;
