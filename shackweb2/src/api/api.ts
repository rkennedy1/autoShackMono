import { resolve } from "path";
import { shacklogItem, scheduleItem } from "../util/models";
import axios from "axios";
import { rejects } from "assert";

export class api {
  url = "http://pvnas.local:1783";

  getLastItem(): Promise<shacklogItem> {
    return new Promise<shacklogItem>((resolve, reject) => {
      axios
        .get<shacklogItem[]>(this.url + "/data/lastItem")
        .then((response) => {
          resolve(response.data[0]);
        });
    });
  }

  getLastThreeDays(): Promise<shacklogItem[]> {
    return new Promise<shacklogItem[]>((resolve, reject) => {
      axios
        .get<shacklogItem[]>(this.url + "/data/lastThreeDays")
        .then((response) => {
          resolve(response.data);
        });
    });
  }

  getLastTenFlows(): Promise<shacklogItem[]> {
    return new Promise<shacklogItem[]>((resolve, reject) => {
      axios
        .get<shacklogItem[]>(this.url + "/data/lastTenFlows")
        .then((response) => {
          resolve(response.data);
        });
    });
  }

  getSchedule(): Promise<scheduleItem[]> {
    return new Promise<scheduleItem[]>((resolve, rejects) => {
      axios.get<scheduleItem[]>(this.url + "/schedule").then((response) => {
        resolve(response.data);
      });
    });
  }
}
