import { useEffect, useState } from "react";
import { api } from "../api/api";
import { shacklogItem } from "../util/models";

const API = new api();

const LastTenWaterings = () => {
  const [items, setItems] = useState<shacklogItem[]>();

  useEffect(() => {
    //API.getLastThreeDays().then((resp) => setItems(resp));
    API.getLastTenFlows().then((resp) => setItems(resp));
  }, []);

  return (
    <div>
      <h2>Last Ten Waterings</h2>
      {items !== undefined &&
        items.map((item, i) => {
          return (
            <div key={i}>
              <div>
                Datetime: {item.datetime.toString()} Flowrate: {item.flow_rate}{" "}
                Temperature:
                {item.temperature} Humidity:{item.humidity}
              </div>
              <div></div>
            </div>
          );
        })}
    </div>
  );
};

export default LastTenWaterings;
