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

// function getDateSlice(dates, delta) {
//     let resDates = [];
//     let dateDelta = Math.round(dates.length / delta);
//     let counter = 0;
//     dates.map((date) => {
//         if (counter == dateDelta) {
//             resDates.push(date);
//             counter = 0;
//         }
//         counter++;
//     });
//     return resDates;
// }

// ==============================|| INCOME AREA CHART ||============================== //

const ShackDataChart = ({ slot }) => {
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
        fetch('http://127.0.0.1:3001:3001/data/lastDay')
            .then((response) => response.json())
            .then((json) => {
                let temps = [];
                let humiditys = [];
                let flows = [];
                json.map((entry) => {
                    if (entry.datetime) {
                        let date = new Date(entry.datetime);
                        dates.push(date.toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' '));
                        temps.push(entry.temperature);
                        humiditys.push(entry.humidity);
                        flows.push(entry.flow_rate * 10);
                    }
                });
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
                setOptions((prevState) => ({
                    ...prevState,
                    colors: [theme.palette.primary.main, theme.palette.primary[700]],
                    xaxis: {
                        categories: dates,
                        labels: {
                            style: {
                                colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary]
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: line
                        },
                        tickAmount: 12
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
            });
    }, [primary, secondary, line, theme, slot, setSeries]);

    return <ReactApexChart options={options} series={series} type="line" height={450} />;
};

ShackDataChart.propTypes = {
    slot: PropTypes.string
};

export default ShackDataChart;
