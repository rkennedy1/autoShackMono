import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import ShackDataChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import SensorReading from 'components/cards/peripherals/SensorReading';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [slot, setSlot] = useState('day');
    const [temperature, setTemp] = useState();
    const [humidity, setHumidity] = useState();
    const [flow, setFlow] = useState({ date: 1, flow_rate: 10 });
    const [lastPic, setLastPic] = useState('loading_gif.gif');

    function lastFlow(json) {
        for (var i = 0; i < json.length; i++) {
            console.log(json[i]);
            if (json[i].flow_rate > 0) {
                console.log(json[i]);
                return { date: 0, flow_rate: json[i].flow_rate };
            }
        }
    }

    useEffect(() => {
        fetch('http://raspberrypi.local:3001/data/lastItem')
            .then((response) => response.json())
            .then((json) => {
                if (json) {
                    setTemp(json[0].temperature);
                    setHumidity(json[0].humidity);
                }
            });
        fetch('http://raspberrypi.local:3001/lastPicture')
            .then((response) => response.json())
            .then((json) => {
                setLastPic(json.lastPic);
            });
    });

    function takePicture() {
        fetch('http://camerapi.local:5000/takePicture').then((response) =>
            response.json().then((json) => {
                setLastPic(json.fileName);
            })
        );
    }

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid item xs={3}>
                <SensorReading title="Tempurature" value={temperature} percentage={temperature} />
            </Grid>
            <Grid item xs={3}>
                <SensorReading title="Humidity" value={humidity} percentage={humidity} />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Watering Events</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlot('day')}
                                color={slot === 'day' ? 'primary' : 'secondary'}
                                variant={slot === 'day' ? 'outlined' : 'text'}
                            >
                                Day
                            </Button>
                            {/* <Button
                                size="small"
                                onClick={() => setSlot('week')}
                                color={slot === 'week' ? 'primary' : 'secondary'}
                                variant={slot === 'week' ? 'outlined' : 'text'}
                            >
                                Week
                            </Button> */}
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <ShackDataChart />
                    </Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">
                            Tent Photo Taken:&nbsp;
                            {lastPic.slice(0, -4).slice(0, 19).replace(/-/g, '/').replace('T', ' ')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                takePicture();
                            }}
                        >
                            Take Photo
                        </Button>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}></Box>
                    <img
                        src={`http://raspberrypi.local:3001/images/${lastPic}`}
                        alt="Last One Taken in the Tent"
                        width="400"
                        height="400"
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
