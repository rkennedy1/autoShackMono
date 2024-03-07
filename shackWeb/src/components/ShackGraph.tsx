import { AxisOptions, Chart } from "react-charts";
import { graphProps, Series, shacklogGraphItem } from "../util/models";
import React from "react";

const ShackGraph = (props: graphProps) => {
  const data: Series[] = [
    {
      label: "Flow Rate",
      data: props.data.map((item) => {
        return { date: new Date(item.datetime), data: item.flow_rate * 10 };
      }),
    },
    {
      label: "Humidity",
      data: props.data.map((item) => {
        return { date: new Date(item.datetime), data: item.humidity };
      }),
    },
    {
      label: "Temperature",
      data: props.data.map((item) => {
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
    />
  );
};

export default ShackGraph;
