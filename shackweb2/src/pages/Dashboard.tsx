import { useEffect, useState } from "react";
import { api } from "../api/api";
import { item } from "../util/models";

const API = new api();

const Dashboard = () => {
  const [items, setItems] = useState<item[]>();

  useEffect(() => {
    //API.getLastThreeDays().then((resp) => setItems(resp));
    API.getLastTenFlows().then((resp) => setItems(resp));
  }, []);

  return (
    <div>
      {items !== undefined &&
        items.map((item, i) => {
          return (
            <div key={i}>
              <div>
                Datetime: {item.datetime.toString()} Flowrate: {item.flowRate}{" "}
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

export default Dashboard;
