import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { scheduleItem } from "../util/models";
import { Typography, Button, TextField, Box } from "@mui/material";

const WateringSchedule = () => {
  const [items, setItems] = useState<scheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    API.getSchedule()
      .then((resp) => {
        setItems(resp || []);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateScheduleItem = async (index: number) => {
    const itemToUpdate = items[index];
    if (itemToUpdate) {
      setLoading(true);
      try {
        if (itemToUpdate.id) {
          // Item already has an ID, indicating it's saved, so update it
          const updatedItem = await API.updateScheduleItem(itemToUpdate);
          if (updatedItem) {
            setItems((prevItems) => {
              const updatedItems = [...prevItems];
              updatedItems[index] = updatedItem;
              return updatedItems;
            });
          }
        } else {
          // Item doesn't have an ID, indicating it's not saved yet, so add it
          const newItem = await API.addScheduleItem(itemToUpdate);
          if (newItem) {
            setItems((prevItems) => {
              const updatedItems = [...prevItems];
              updatedItems[index] = newItem;
              return updatedItems;
            });
          }
        }
      } catch (error) {
        console.error("Error updating schedule item:", error);
        // If there's an error, set the items back to their previous state
        setItems((prevItems) => [...prevItems]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartTimeChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], start_hour: parseInt(value) };
    setItems(newItems);
  };

  const handleDurationChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], duration: parseInt(value) };
    setItems(newItems);
  };

  const handleAddNewItem = () => {
    setItems(
      (prevItems) =>
        [...prevItems, { start_hour: 0, duration: 0 }] as scheduleItem[]
    );
  };

  const handleDeleteScheduleItem = (index: number, id: number) => {
    if (id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirmDelete) {
        API.deleteScheduleItem(id);
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
      }
    } else {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  return (
    <div>
      <h2 id="shackScheduleHeading">Shack Schedule</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <div
              key={i}
              id={"shackScheduleItem[" + i + "]"}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Typography>
                <Box display="flex" alignItems="center">
                  <span>Start Time&nbsp;</span>{" "}
                  <TextField
                    type="number"
                    value={item.start_hour}
                    variant="outlined"
                    inputProps={{ min: 0, max: 24 }}
                    onChange={(e) => handleStartTimeChange(i, e.target.value)}
                  />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>Duration&nbsp;</span>{" "}
                  <TextField
                    type="number"
                    value={item.duration}
                    variant="outlined"
                    inputProps={{ min: 0, max: 60 }}
                    onChange={(e) => handleDurationChange(i, e.target.value)}
                  />
                </Box>
              </Typography>
              {item.id ? (
                <Button onClick={() => handleUpdateScheduleItem(i)}>
                  <i className="fa-solid fa-floppy-disk"></i>{" "}
                </Button>
              ) : (
                <Button onClick={() => handleUpdateScheduleItem(i)}>
                  <i className="fa-solid fa-plus"></i>{" "}
                </Button>
              )}
              {/* Add delete button */}
              <Button onClick={() => handleDeleteScheduleItem(i, item.id)}>
                <i className="fa-solid fa-trash"></i>{" "}
              </Button>
            </div>
          ))
        ) : (
          <p>No schedule items available</p>
        )}
        <Button onClick={handleAddNewItem}>Add New Item</Button>
      </div>
    </div>
  );
};

export default WateringSchedule;
