import { resolve } from "path";
import { item } from "../util/models";
import axios from "axios";
import { rejects } from "assert";

export class api {
  url = "http://pvnas.local:1783";

  getLastItem(): Promise<item> {
    return new Promise<item>((resolve, reject) => {
      axios.get<item[]>(this.url + "/data/lastItem").then((response) => {
        resolve(response.data[0]);
      });
    });
  }

  getLastThreeDays(): Promise<item[]> {
    return new Promise<item[]>((resolve, reject) => {
      axios.get<item[]>(this.url + "/data/lastThreeDays").then((response) => {
        resolve(response.data);
      });
    });
  }

  getLastTenFlows(): Promise<item[]> {
    return new Promise<item[]>((resolve, reject) => {
      axios.get<item[]>(this.url + "/data/lastTenFlows").then((response) => {
        resolve(response.data);
      });
    });
  }
}
