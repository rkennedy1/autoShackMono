import axios from "axios";
import { shacklogItem, scheduleItem } from "../util/models";

const PORT = ":1783";

// Construct base URL dynamically
const baseURL = `${window.location.protocol}//${window.location.hostname}${PORT}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export async function fetchResource<T>(url: string): Promise<T | null> {
  try {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function getLastItem(): Promise<shacklogItem | null> {
  const data = await fetchResource<shacklogItem[]>("/data/lastItem");
  return data ? data[0] : null;
}

export async function getLastThreeDays(): Promise<shacklogItem[] | null> {
  return fetchResource<shacklogItem[]>("/data/lastThreeDays");
}

export async function getLastTenFlows(): Promise<shacklogItem[] | null> {
  return fetchResource<shacklogItem[]>("/data/lastTenFlows");
}

export async function getSchedule(): Promise<scheduleItem[] | null> {
  return fetchResource<scheduleItem[]>("/schedule");
}

export async function updateScheduleItem(
  item: scheduleItem
): Promise<scheduleItem | null> {
  try {
    const response = await axiosInstance.post("/schedule/update", item);
    return response.data[0];
  } catch (error) {
    console.error("Error updating schedule item:", error);
    return null;
  }
}

export async function addScheduleItem(
  item: scheduleItem
): Promise<scheduleItem | null> {
  try {
    const response = await axiosInstance.post("/schedule/add", item);
    return response.data;
  } catch (error) {
    console.error("Error add schedule item:", error);
    return null;
  }
}

export async function deleteScheduleItem(id: number) {
  try {
    await axiosInstance.post("/schedule/delete", { id: id });
  } catch (error) {
    console.error("Error add schedule item:", error);
  }
}
