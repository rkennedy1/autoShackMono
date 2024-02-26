import { useEffect, useState } from "react";
import { API } from "../api/api";
import { shacklogItem } from "../util/models";
import ShackGraph from "../components/ShackGraph";

const NO_DATA_MESSAGE = "No data available";
const ERROR_FETCHING_DATA_MESSAGE = "Error fetching data:";

const LastThreeDays = () => {
  const [shackData, setShackData] = useState<shacklogItem[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    API.getLastThreeDays()
      .then((resp) => {
        if (resp && resp.length > 0) {
          setShackData(resp);
        } else {
          console.log(NO_DATA_MESSAGE);
        }
      })
      .catch((error) => {
        console.error(ERROR_FETCHING_DATA_MESSAGE, error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <h2 id="last3DaysHeading">Last 3 Days Waterings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : shackData && shackData.length > 0 ? (
        <ShackGraph data={shackData} />
      ) : (
        <p>{NO_DATA_MESSAGE}</p>
      )}
    </div>
  );
};

export default LastThreeDays;
