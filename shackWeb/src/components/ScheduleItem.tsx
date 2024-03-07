import React, { useState } from "react";
import { Typography, Button, TextField, Box, Tooltip } from "@mui/material";
import { scheduleItem } from "../util/models";

interface Props {
  item: scheduleItem;
  index: number;
  onUpdate: Function;
  onDelete: Function;
}

const ScheduleItem: React.FC<Props> = ({ item, index, onUpdate, onDelete }) => {
  const [startTime, setStartTime] = useState(item.start_hour);
  const [duration, setDuration] = useState(item.duration);

  const handleUpdate = () => {
    if (startTime < 0 || startTime > 23 || duration < 0 || duration > 59) {
      alert("Invalid start time or duration");
      return;
    }
    onUpdate(index, { ...item, start_hour: startTime, duration: duration });
  };

  const handleDelete = () => {
    onDelete(index, item.id);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      id={`shackScheduleItem-${index}-component`}
    >
      <Typography>
        <Box display="flex" alignItems="center">
          <span>Start Time&nbsp;</span>
          <Tooltip title="Enter a number between 0 and 23">
            <TextField
              type="number"
              value={startTime}
              variant="outlined"
              inputProps={{ min: 0, max: 23 }}
              onChange={(e) => setStartTime(parseInt(e.target.value))}
              id={`startTimeInput_${index}`} // ID added here
            />
          </Tooltip>

          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Duration&nbsp;</span>
          <Tooltip title="Enter a number between 0 and 59">
            <TextField
              type="number"
              value={duration}
              variant="outlined"
              inputProps={{ min: 0, max: 59 }}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              id={`durationInput_${index}`} // ID added here
            />
          </Tooltip>
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
