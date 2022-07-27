import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    const [series, setSeries] = useState([
        {
            name: 'Tempurature',
            data: [86, 80, 90, 10, 11]
        },
        {
            name: 'Humidity',
            data: [40, 45, 50, 45, 40]
        },
        {
            name: 'Flow',
            data: [0, 0, 0, 50, 0]
        }
    ]);

    useEffect(() => {
        let dates = [];
        fetch('http://raspberrypi.local:3001/data/lastDay')
            .then((response) => response.json())
            .then((json) => {
                let temps = [];
                let humiditys = [];
                let flows = [];
                json.map((entry) => {
                    if (entry.temperature && entry.humidity) {
                        dates.push(entry.datetime);
                        temps.push(entry.temperature);
                        humiditys.push(entry.humidity);
                        flows.push(entry.flow_rate);
                    }
                });
                console.log([dates, temps, humiditys, flows]);
                setSeries([
                    {
                        name: 'Tempurature',
                        data: temps
                    },
                    {
                        name: 'Humidity',
                        data: humiditys
                    },
                    {
                        name: 'Flow',
                        data: flows
                    }
                ]);
            });
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                categories: dates,
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: 24
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, [primary, secondary, line, theme, slot, setSeries]);

    // const [series, setSeries] = useState([
    //     {
    //         name: 'Tempurature',
    //         data: data[1]
    //     },
    //     {
    //         name: 'Sessions',
    //         data: data[2]
    //     }
    // ]);

    // useEffect(() => {
    //     setSeries([
    //         {
    //             name: 'Page Views',
    //             data: slot === 'month' ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : [31, 40, 28, 51, 42, 109, 100]
    //         },
    //         {
    //             name: 'Sessions',
    //             data: slot === 'month' ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41] : [11, 32, 45, 32, 34, 52, 41]
    //         }
    //     ]);
    // }, [slot]);

    return <ReactApexChart options={options} series={series} type="line" height={450} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
