import { AxisOptions, Chart } from "react-charts";
import { Series, shacklogGraphItem, shacklogItem } from "../util/models";
import React from "react";

interface Props {
  graphData: shacklogItem[];
}

const ShackGraph: React.FC<Props> = ({ graphData }) => {
  const data: Series[] = [
    {
      label: "Flow Rate",
      data: graphData.map((item) => {
        return { date: new Date(item.datetime), data: item.flow_rate * 10 };
      }),
    },
    {
      label: "Humidity",
      data: graphData.map((item) => {
        return { date: new Date(item.datetime), data: item.humidity };
      }),
    },
    {
      label: "Temperature",
      data: graphData.map((item) => {
        return { date: new Date(item.datetime), data: item.temperature };
      }),
    },
  ];
  const primaryAxis = React.useMemo(
    (): AxisOptions<shacklogGraphItem> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<shacklogGraphItem>[] => [
      {
        getValue: (datum) => datum.data,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
      id="shackGraph-component"
    />
  );
};

export default ShackGraph;
