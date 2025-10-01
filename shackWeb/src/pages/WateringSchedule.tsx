import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { Schedule, Add } from "@mui/icons-material";
import {
  getSchedule,
  updateScheduleItem,
  addScheduleItem,
  deleteScheduleItem,
} from "../api/api";
import ScheduleItem from "../components/ScheduleItem";
import { scheduleItem } from "../util/models";
import { ScheduleSkeleton } from "../components/LoadingSkeleton";

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
      const responseItem = updatedItem.id
        ? await updateScheduleItem(updatedItem)
        : await addScheduleItem(updatedItem);
      console.log(responseItem!.id);
      if (responseItem) {
        setItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = updatedItem;
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

  if (loading) {
    return <ScheduleSkeleton />;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Schedule sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600 }}
            id="shackScheduleHeading"
          >
            Shack Schedule
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Schedule Items */}
        <Box sx={{ mb: 3 }}>
          {items.length > 0 ? (
            <Box>
              {items.map((item, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <ScheduleItem
                    index={i}
                    item={item}
                    onUpdate={handleUpdateScheduleItem}
                    onDelete={handleDeleteScheduleItem}
                  />
                  {i < items.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">
                No schedule items available
              </Typography>
            </Box>
          )}
        </Box>

        {/* Add Button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleAddNewItem}
            variant="contained"
            startIcon={<Add />}
            id="AddNewItemButton"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
            }}
          >
            Add New Schedule
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WateringSchedule;
