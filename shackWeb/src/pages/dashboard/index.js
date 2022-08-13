import { useEffect, useState } from 'react';

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project import
import OrdersTable from './OrdersTable';
import ShackDataChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import SensorReading from 'components/cards/peripherals/SensorReading';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// api
import SensorApi from 'api/SensorApi';
import { date } from '../../../node_modules/yup/lib/locale';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

function getData() {
    let temperature = 0;
    let humidity = 0;
    let flow = 0;
    fetch('http://raspberrypi.local:3001/data/lastItem')
        .then((response) => response.json())
        .then((json) => {
            if (json.temperature && json.humidity) {
                let date = new Date(json[i].datetime);
                console.log(date);
                temperature = json.temperature;
                humidity = json.humidity;
                flow = json.flow * 10;
                console.log(json.flow, '    :     ', flow);
            }
            return { temperature: temperature, humidity: humidity, flow: flow };
        });
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('day');
    const [temperature, setTemp] = useState();
    const [humidity, setHumidity] = useState();
    const [flow, setFlow] = useState();
    const [lastPic, setLastPic] = useState('loading_gif.gif');

    useEffect(() => {
        fetch('http://raspberrypi.local:3001/data/lastItem')
            .then((response) => response.json())
            .then((json) => {
                if (json) {
                    setTemp(json[0].temperature);
                    setHumidity(json[0].humidity);
                    setFlow(json[0].flow_rate);
                }
            });
        fetch('http://raspberrypi.local:3001/lastPicture')
            .then((response) => response.json())
            .then((json) => {
                setLastPic(json.lastPic);
                console.log(lastPic);
            });
    });

    function takePicture() {
        console.log('picture');
        fetch('http://camerapi.local:5000/takePicture');
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
                        <Typography variant="h5">Tent Photo</Typography>
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
