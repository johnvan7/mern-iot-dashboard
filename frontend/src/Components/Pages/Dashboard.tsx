import React from 'react';
import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import {Link} from "react-router-dom";

const Dashboard = ({sensors} : {sensors: Sensor[]}) => {

    return (
        <Box marginTop={15}>
            <Stack direction="row" spacing={10}>
                <Card sx={{maxWidth: 550}}>
                    <Link style={{textDecoration: "none"}} to={"/sensors"}>
                        <CardContent>
                            <SensorsIcon color={"primary"}/>
                            <Typography sx={{fontWeight: 'bold', margin: 3}} color="text.secondary" variant="h4">
                                Sensors
                            </Typography>
                            <Typography sx={{fontWeight: 'bold', margin: 3}} color="primary" variant="h2">
                                {sensors.length}
                            </Typography>
                        </CardContent>
                    </Link>
                </Card>
            </Stack>
        </Box>
    )
}

export default Dashboard;
