import { AxisOptions, Chart } from "react-charts";
import { graphProps, Series, shacklogGraphItem } from "../util/models";
import React from "react";
import { useTheme } from "@mui/material/styles";

const ShackGraph = (props: graphProps) => {
  const theme = useTheme();

  const data: Series[] = [
    {
      label: "Flow Rate",
      data: props.data.map((item) => {
        // Cap flow rate at 100 to prevent graph scaling issues
        // We only care about flow vs no flow, not exact rate
        const cappedFlowRate = Math.min(item.flow_rate * 10, 100);
        return { date: new Date(item.datetime), data: cappedFlowRate };
      }),
    },
    {
      label: "Humidity",
      data: props.data.map((item) => {
        return { date: new Date(item.datetime), data: item.humidity };
      }),
    },
    {
      label: "Temperature (°F)",
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
    <div
      style={{
        width: "100%",
        height: "100%",
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          defaultColors: [
            theme.palette.secondary.main, // Flow Rate - Blue
            theme.palette.primary.main, // Humidity - Green
            theme.palette.warning.main, // Temperature - Orange
          ],
          dark: theme.palette.mode === "dark",
        }}
      />
    </div>
  );
};

export default ShackGraph;
