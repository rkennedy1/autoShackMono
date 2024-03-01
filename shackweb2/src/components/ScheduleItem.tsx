import React from "react";
import { Typography, Button, TextField, Box } from "@mui/material";
import { scheduleItem } from "../util/models";

const ScheduleItem: React.FC<{
  item: scheduleItem;
  index: number;
  onUpdate: Function;
  onDelete: Function;
  loading: boolean;
}> = ({ item, index, onUpdate, onDelete, loading }) => {
  const handleStartTimeChange = (value: number) => {
    onUpdate(index, { ...item, start_hour: value });
  };

  const handleDurationChange = (value: number) => {
    onUpdate(index, { ...item, duration: value });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography>
        <Box display="flex" alignItems="center">
          <span>Start Time&nbsp;</span>
          <TextField
            type="number"
            value={item.start_hour}
            variant="outlined"
            inputProps={{ min: 0, max: 24 }}
            onChange={(e) => handleStartTimeChange(parseInt(e.target.value))}
            id={`startTimeInput_${index}`} // ID added here
          />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Duration&nbsp;</span>
          <TextField
            type="number"
            value={item.duration}
            variant="outlined"
            inputProps={{ min: 0, max: 60 }}
            onChange={(e) => handleDurationChange(parseInt(e.target.value))}
            id={`durationInput_${index}`} // ID added here
          />
        </Box>
      </Typography>
      {item.id ? (
        <Button id={`saveButton_${index}`} onClick={() => onUpdate(index)}>
          <i className="fa-solid fa-floppy-disk"></i>
        </Button>
      ) : (
        <Button id={`plusButton_${index}`} onClick={() => onUpdate(index)}>
          <i className="fa-solid fa-plus"></i>
        </Button>
      )}
      <Button
        id={`trashButton_${index}`}
        onClick={() => onDelete(index, item.id)}
      >
        <i className="fa-solid fa-trash"></i>
      </Button>
    </div>
  );
};

export default ScheduleItem;
