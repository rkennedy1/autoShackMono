import axios from "axios";
import { shacklogItem, scheduleItem } from "../util/models";

const PORT = ":1783";

// Construct base URL dynamically
const baseURL = `${window.location.protocol}//${window.location.hostname}${PORT}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export class API {
  static async fetchResource<T>(url: string): Promise<T | null> {
    try {
      const response = await axiosInstance.get<T>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  static async getLastItem(): Promise<shacklogItem | null> {
    const data = await this.fetchResource<shacklogItem[]>("/data/lastItem");
    return data ? data[0] : null;
  }

  static async getLastThreeDays(): Promise<shacklogItem[] | null> {
    return this.fetchResource<shacklogItem[]>("/data/lastThreeDays");
  }

  static async getLastTenFlows(): Promise<shacklogItem[] | null> {
    return this.fetchResource<shacklogItem[]>("/data/lastTenFlows");
  }

  static async getSchedule(): Promise<scheduleItem[] | null> {
    return this.fetchResource<scheduleItem[]>("/schedule");
  }

  static async updateScheduleItem(
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

  static async addScheduleItem(
    item: scheduleItem
  ): Promise<scheduleItem | null> {
    try {
      const response = await axiosInstance.post("/schedule/add", item);
      return response.data[0];
    } catch (error) {
      console.error("Error add schedule item:", error);
      return null;
    }
  }

  static async deleteScheduleItem(id: number) {
    try {
      await axiosInstance.post("/schedule/delete", { id: id });
    } catch (error) {
      console.error("Error add schedule item:", error);
    }
  }
}
