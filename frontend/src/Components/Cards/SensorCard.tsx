import {Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import React from "react";
import SensorsIcon from '@mui/icons-material/Sensors';
import {Link} from "react-router-dom";

const SensorCard = ({sensor}: { sensor: Sensor }) => {

    return (
        <Card sx={{maxWidth: 345}}>
            <Link style={{textDecoration: "none"}} to={"/sensor/" + sensor.id} >
                <CardContent>
                    <SensorsIcon color={"primary"}/>
                    <Typography sx={{fontWeight: 'bold', margin: 3}} color="text.secondary" variant="h5">
                        {sensor.name}
                    </Typography>
                    <Divider sx={{margin: 2}} />
                    <Stack direction={"row"} spacing={1}>
                        {sensor.tags.map((tag) => (
                            <Chip color="primary" variant="outlined" label={tag}/>
                        ))}
                    </Stack>
                </CardContent>
            </Link>
        </Card>
    );
};

export default SensorCard;
