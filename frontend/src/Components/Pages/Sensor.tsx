import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {apiGet} from "../../utils/api";
import {googleMapToken} from "../../utils/constants";
import {Button, ButtonGroup, Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import moment from 'moment';
import {LineChart} from "@mui/x-charts";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import GoogleMapReact from 'google-map-react';
import {Room} from "@mui/icons-material";

const Marker: React.FC<{ lat: number; lng: number }> = () => (
    <Room sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '18px',
        height: '18px',
        transform: 'translate(-50%, -50%)'
    }}/>
);

const Sensor = () => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const isMobile = width <= 768;

    const {id} = useParams();
    const [sensor, setSensor] = useState<any>([]);
    const [samples, setSamples] = useState<any>([]);
    const [startDate, setStartDate] = useState<any>(moment().subtract(6, 'hours').toISOString());
    const [endDate, setEndDate] = useState<any>(undefined);
    const [activeButton, setActiveButton] = useState('last6Hours');

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    useEffect(() => {
        apiGet("/sensors/" + id).then((res) => {
            setSensor(res.data);
        }).catch((err) => {
            console.error("sensor error", err);
        });
    }, [id]);

    useEffect(() => {
        let args = "?sensorId=" + id;
        if (startDate) {
            args += "&startDate=" + startDate;
        }
        if (endDate) {
            args += "&endDate=" + endDate;
        }
        apiGet("/samples" + args).then((res) => {
            setSamples(res.data.samples);
        }).catch((err) => {
            console.error("samples error", err);
        });
    }, [id, startDate, endDate]);

    const handleButtonClick = (startDate: string | undefined, endDate: string | undefined, buttonName: string) => {
        setActiveButton(buttonName);
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const InfoCard = ({title, value, description}: { title: any, value: any, description: any }) => (
            <Card>
                <CardContent
                    sx={{display: "flex", flexDirection: 'column', justifyContent: 'space-between', height: "100%"}}>
                    <Typography sx={{fontWeight: 'bold', marginX: 3, marginBottom: 1}} color="text.secondary" variant="h6">
                        {title}
                    </Typography>
                    <Typography sx={{fontWeight: 'bold', margin: 3}} color="primary" variant="h3">
                        {value}
                    </Typography>
                    <div>
                        <Divider sx={{marginTop: 1}}/>
                        <Typography sx={{marginTop: 1}} color="text.secondary" variant="body2">
                            {description}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        )
    ;

    return (
        <Stack spacing={3} style={{marginTop: 70, marginBottom: 50}}>
            <Stack direction={isMobile ? "column" : "row"} spacing={3} style={{margin: 10}}>
                <Typography sx={{fontWeight: 'bold'}} color="primary" variant="h5">
                    {sensor.name}
                </Typography>
                <Stack direction={"row"} spacing={1}>
                    {sensor.tags && sensor.tags.map((tag: string) => (
                        <Chip color="primary" variant="outlined" label={tag}/>
                    ))}
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={3} style={{margin: 10}}>
                <Typography color="text.secondary" variant="body1">
                    {sensor.description}
                </Typography>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={5} style={{marginTop: 50}}>
                <InfoCard
                    title={"Last value"}
                    value={(samples.length > 0 ? (samples[samples.length - 1].value as string) : "-") + (sensor.unit ? (" " + sensor.unit) : "")}
                    description={samples.length > 0 ?
                        moment(samples[samples.length - 1].createdAt).fromNow()
                        :
                        ""}
                />
                <InfoCard
                    title={"Total samples"}
                    value={samples.length}
                    description={samples.length > 0 ?
                        "From " + moment(samples[0].createdAt).fromNow()
                        :
                        ""}
                />
                <Card>
                    <CardContent
                        sx={{display: "flex", flexDirection: 'column', justifyContent: 'space-between', height: "100%"}}>
                        <Typography sx={{fontWeight: 'bold', marginX: 5, marginBottom: 1}} color="text.secondary" variant="h6">
                            Statistics
                        </Typography>
                        <Typography sx={{marginTop: 0}} color="deepskyblue" variant="h6">
                            Min: {samples.length > 0 ?
                            (samples.slice().sort((a: any, b: any) => a.value - b.value)[0].value) : "-"} {sensor.unit}
                        </Typography>
                        <Typography sx={{marginTop: 0}} color="orangered" variant="h6">
                            Max: {samples.length > 0 ? (samples.slice().sort((a: any, b: any) => b.value - a.value)[0].value) : "-"} {sensor.unit}
                        </Typography>
                        <Typography sx={{marginTop: 0}} color="darkgreen" variant="h6">
                            Average: {samples.length > 0 ? (samples.reduce((acc: any, b: any) => acc + b.value, 0) / samples.length).toFixed(2) : "-"} {sensor.unit}
                        </Typography>
                        <div>
                            <Divider sx={{marginTop: 0}}/>
                            <Typography sx={{marginTop: 1}} color="text.secondary" variant="body2">

                            </Typography>
                        </div>
                    </CardContent>
                </Card>
                {(sensor.location && sensor.location.latitude && sensor.location.longitude && sensor.location.altitude) &&
                    <Card>
                        <CardContent sx={{
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: "100%"
                        }}>
                            <Typography sx={{fontWeight: 'bold', marginX: 3, marginBottom: 1}} color="text.secondary"
                                        variant="h6">
                                Location
                            </Typography>
                            <div className="map-container" style={{width: 200, height: 200}}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{key: googleMapToken}}
                                    defaultCenter={{
                                        lat: sensor.location.latitude,
                                        lng: sensor.location.longitude
                                    }}
                                    defaultZoom={16}
                                >
                                    <Marker key={0} lat={sensor.location.latitude} lng={sensor.location.longitude} />
                                </GoogleMapReact>
                            </div>
                            <div>
                                <Divider sx={{marginTop: 1}}/>
                                <Typography sx={{marginTop: 1}} color="text.secondary" variant="body2">
                                    Altitude: {sensor.location && sensor.location.altitude} m
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                }
            </Stack>
            <Divider sx={{margin: 1}}/>
            <Stack direction={"row"} spacing={3} style={{marginTop: 20}}>
                <ButtonGroup className={isMobile ? "button-group-mobile" : "button-group"} variant="outlined"
                             aria-label="outlined button group">
                    <Button
                        className={activeButton === 'lastHour' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'hours').toISOString(), undefined, 'lastHour')}
                    >
                        Last hour
                    </Button>
                    <Button
                        className={activeButton === 'last6Hours' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(6, 'hours').toISOString(), undefined, 'last6Hours')}
                    >
                        Last 6 hours
                    </Button>
                    <Button
                        className={activeButton === 'last12Hours' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(12, 'hours').toISOString(), undefined, 'last12Hours')}
                    >
                        Last 12 hours
                    </Button>
                    <Button
                        className={activeButton === 'today' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().startOf('day').toISOString(), undefined, 'today')}
                    >
                        Today
                    </Button>
                    <Button
                        className={activeButton === 'yesterday' ? 'active' : ''}
                        onClick={() =>
                            handleButtonClick(
                                moment().subtract(1, 'days').startOf('day').toISOString(),
                                moment().subtract(1, 'days').endOf('day').toISOString(),
                                'yesterday'
                            )
                        }
                    >
                        Yesterday
                    </Button>
                    <Button
                        className={activeButton === 'lastWeek' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'week').startOf('day').toISOString(), undefined, 'lastWeek')}
                    >
                        Last week
                    </Button>
                    <Button
                        className={activeButton === 'lastMonth' ? 'active' : ''}
                        onClick={() => handleButtonClick(moment().subtract(1, 'month').startOf('day').toISOString(), undefined, 'lastMonth')}
                    >
                        Last month
                    </Button>
                    <Button
                        className={activeButton === 'all' ? 'active' : ''}
                        onClick={() => handleButtonClick(undefined, undefined, 'all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={5} style={{marginTop: 50}}>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3}} color="text.secondary" variant="h6">
                            Chart
                        </Typography>
                        {samples.length > 0 &&
                            <LineChart
                                xAxis={[
                                    {
                                        data: samples.map((sample: any) => moment(sample.createdAt)),
                                        scaleType: 'time',
                                    },
                                ]}
                                series={[
                                    {
                                        data: samples.map((sample: any) => sample.value),
                                        area: true,
                                    },
                                ]}
                                width={isMobile ? width - 50 : 500}
                                height={400}
                            />}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold', marginX: 3, marginBottom: 3}} color="text.secondary"
                                    variant="h6">
                            History table
                        </Typography>
                        {samples.length > 0 &&
                            <>
                                <TableContainer component={Paper}>
                                    <Table sx={{minWidth: isMobile ? width - 50 : 400}} size="small"
                                           aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Value</TableCell>
                                                <TableCell align="right">Activity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(samples.map((sample: any) => ({
                                                value: sample.value + (sensor.unit ? (" " + sensor.unit) : ""),
                                                activity: moment(sample.createdAt).fromNow()
                                            })).reverse().splice(0, 15) as any).map((row: any) => (
                                                <TableRow
                                                    key={row.id}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.value}
                                                    </TableCell>
                                                    <TableCell align="right">{row.activity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Divider sx={{marginTop: 3}}/>
                                <Typography sx={{marginTop: 1}}
                                            color="text.secondary"
                                            variant="body2">
                                    Showing
                                    last {samples.length > 15 ? "15" : samples.length} of {samples.length} samples
                                </Typography>
                            </>
                        }
                    </CardContent>
                </Card>
            </Stack>
        </Stack>
    )
};
export default Sensor;
