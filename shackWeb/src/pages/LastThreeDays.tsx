import { useEffect, useState } from "react";
import { shacklogItem } from "../util/models";
import ShackGraph from "../components/ShackGraph";
import { getLastThreeDays } from "../api/api";
import Loading from "../components/Loading";

const NO_DATA_MESSAGE = "No data available";
const ERROR_FETCHING_DATA_MESSAGE = "Error fetching data:";

const LastThreeDays = () => {
  const [shackData, setShackData] = useState<shacklogItem[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getLastThreeDays()
      .then((resp: shacklogItem[] | null) => {
        if (resp && resp.length > 0) {
          setShackData(resp);
        } else {
          console.log(NO_DATA_MESSAGE);
        }
      })
      .catch((error: Error) => {
        console.error(ERROR_FETCHING_DATA_MESSAGE, error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <h2 id="last3DaysHeading">Last 3 Days</h2>
      {loading ? (
        <Loading name="lastThreeDays" />
      ) : shackData && shackData.length > 0 ? (
        <ShackGraph data={shackData} />
      ) : (
        <p>{NO_DATA_MESSAGE}</p>
      )}
    </div>
  );
};

export default LastThreeDays;
