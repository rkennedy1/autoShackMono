import React, { useEffect, useState } from "react";

const CurrentWeek: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState({
    stage: "veg",
    week: 1,
  });

  useEffect(() => {
    setCurrentWeek({ stage: "bloom", week: 8 });
  }, []);
  return (
    <div className="current-week-component">
      <h3>Current Week: {currentWeek.week}</h3>
      <h3>Current Stage: {currentWeek.stage}</h3>
    </div>
  );
};

export default CurrentWeek;
