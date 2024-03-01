// WateringSchedule.js
import React, { useEffect, useState } from "react";
import {
  getSchedule,
  updateScheduleItem,
  addScheduleItem,
  deleteScheduleItem,
} from "../api/api";
import { Button } from "@mui/material";
import ScheduleItem from "../components/ScheduleItem";
import { scheduleItem } from "../util/models";

const WateringSchedule = () => {
  const [items, setItems] = useState<scheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSchedule()
      .then((resp) => {
        setItems(resp || []);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateScheduleItem = async (
    index: number,
    updatedItem: scheduleItem
  ) => {
    setLoading(true);
    try {
      const newItem = updatedItem.id
        ? await updateScheduleItem(updatedItem)
        : await addScheduleItem(updatedItem);
      if (newItem) {
        setItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = newItem;
          return updatedItems;
        });
      }
    } catch (error) {
      console.error("Error updating schedule item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScheduleItem = (index: number, id: number) => {
    if (id) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirmDelete) {
        deleteScheduleItem(id);
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

  const handleAddNewItem = () => {
    setItems((prevItems) => [...prevItems, { start_hour: 0, duration: 0 }]);
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
            <ScheduleItem
              key={i}
              index={i}
              item={item}
              onUpdate={handleUpdateScheduleItem}
              onDelete={handleDeleteScheduleItem}
              loading={loading}
            />
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
