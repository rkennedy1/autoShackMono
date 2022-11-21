import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import ShackDataChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import SensorReading from 'components/cards/peripherals/SensorReading';
import { date } from '../../../node_modules/yup/lib/locale';

const serverUrl = 'http://guestserver.local:3001';
const camerapiUrl = 'http://camerapi.local:5000';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [slot, setSlot] = useState('day');
    const [temperature, setTemp] = useState();
    const [humidity, setHumidity] = useState();
    const [flow, setFlow] = useState([
        { id: 0, datetime: '2022-08-14T13:03:03.000Z', humidity: 0, temperature: 0, flow_rate: 0, pump_status: 'OFF', execution_time: 0 }
    ]);
    const [lastPic, setLastPic] = useState('loading_gif.gif');

    useEffect(() => {
        fetch(serverUrl + '/data/lastItem')
            .then((response) => response.json())
            .then((json) => {
                if (json) {
                    setTemp(json[0].temperature);
                    setHumidity(json[0].humidity);
                }
            });
        fetch(serverUrl + '/lastPicture')
            .then((response) => response.json())
            .then((json) => {
                setLastPic(json.lastPic);
            });
        fetch(serverUrl + '/data/lastFlow')
            .then((response) => response.json())
            .then((json) => {
                setFlow(json);
            });
    }, []);

    function takePicture() {
        fetch(camerapiUrl + '/takePicture').then((response) =>
            response.json().then((json) => {
                setLastPic(json.fileName);
            })
        );
    }

    function formatDate(dateParm) {
        date = new Date(Date.parse(dateParm));
        date.setHours(date.getHours() + 8);
        return date.toLocaleString();
    }

    //flow[0].datetime.slice(0, 19).replace(/-/g, '/').replace('T', ' ')
    //new Date(Date.parse(flow[0].datetime)).toLocaleString()

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
            <Grid item xs={3}>
                <SensorReading title="Last Flow" value={formatDate(flow[0].datetime)} />
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
            {lastPic && (
                <Grid item xs={12} md={5} lg={4}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">
                                Tent Photo Taken:&nbsp;
                                {formatDate(lastPic.slice(0, -4))}
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
                        <img src={serverUrl + `/images/${lastPic}`} alt="Last One Taken in the Tent" width="400" height="400" />
                    </MainCard>
                </Grid>
            )}
        </Grid>
    );
};

export default DashboardDefault;
