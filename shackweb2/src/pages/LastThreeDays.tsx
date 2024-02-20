import { useEffect, useState } from "react";
import { api } from "../api/api";
import { shacklogItem } from "../util/models";
import ShackGraph from "../components/ShackGraph";

const API = new api();

const LastThreeDays = () => {
  const [shackData, setShackData] = useState<shacklogItem[]>();

  useEffect(() => {
    API.getLastThreeDays().then((resp) => setShackData(resp));
  }, []);

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <h2>Last 3 Days Waterings</h2>
      {shackData && <ShackGraph data={shackData} />}
    </div>
  );
};

export default LastThreeDays;
