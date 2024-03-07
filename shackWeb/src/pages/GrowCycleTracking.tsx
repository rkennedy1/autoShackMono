import React from "react";
import CurrentWeek from "../components/CurrentWeek";

interface Props {
  // Define your component's props here
}

const GrowCycleTracking: React.FC<Props> = () => {
  // Add your component logic here

  return (
    <div>
      <h1>Grow Cycle Tracking</h1>
      <CurrentWeek />
      <p>Under construction</p>
    </div>
  );
};

export default GrowCycleTracking;
