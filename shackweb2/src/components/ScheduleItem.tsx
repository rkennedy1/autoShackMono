import React, { useState } from "react";
import { Typography, Button, TextField, Box } from "@mui/material";
import { scheduleItem } from "../util/models";

const ScheduleItem: React.FC<{
  item: scheduleItem;
  index: number;
  onUpdate: Function;
  onDelete: Function;
}> = ({ item, index, onUpdate, onDelete }) => {
  const [startTime, setStartTime] = useState(item.start_hour);
  const [duration, setDuration] = useState(item.duration);

  const handleUpdate = () => {
    onUpdate(index, { ...item, start_hour: startTime, duration: duration });
  };

  const handleDelete = () => {
    onDelete(index, item.id);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      id={`shackScheduleItem_${index}`}
    >
      <Typography>
        <Box display="flex" alignItems="center">
          <span>Start Time&nbsp;</span>
          <TextField
            type="number"
            value={startTime}
            variant="outlined"
            inputProps={{ min: 0, max: 24 }}
            onChange={(e) => setStartTime(parseInt(e.target.value))}
            id={`startTimeInput_${index}`} // ID added here
          />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Duration&nbsp;</span>
          <TextField
            type="number"
            value={duration}
            variant="outlined"
            inputProps={{ min: 0, max: 60 }}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            id={`durationInput_${index}`} // ID added here
          />
        </Box>
      </Typography>
      {item.id ? (
        <Button id={`saveButton_${index}`} onClick={handleUpdate}>
          <i className="fa-solid fa-floppy-disk"></i>
        </Button>
      ) : (
        <Button id={`plusButton_${index}`} onClick={handleUpdate}>
          <i className="fa-solid fa-plus"></i>
        </Button>
      )}
      <Button id={`trashButton_${index}`} onClick={handleDelete}>
        <i className="fa-solid fa-trash"></i>
      </Button>
    </div>
  );
};

export default ScheduleItem;
